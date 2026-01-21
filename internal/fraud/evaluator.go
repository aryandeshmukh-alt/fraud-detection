package fraud

import (
	"log"
	"strings"
	"time"

	"github.com/google/uuid"

	"fraud-detection-backend/internal/audit"
	"fraud-detection-backend/internal/database"
	"fraud-detection-backend/internal/notifications"
)

/*
txnSnapshot holds only the data needed to judge a transaction.
*/
type txnSnapshot struct {
	ID        string
	UserID    string
	Amount    float64
	DeviceID  string
	CreatedAt time.Time
}

/*
userStats represents the user's usual spending pattern.
AvgAmount = 0 means the user has no past successful transactions.
*/
type userStats struct {
	AvgAmount float64
}

/*
EvaluateTransaction runs asynchronously after a transaction is created.

Design decision:
- Each user has one primary trusted device
- New devices are NEVER auto-trusted
- Any transaction from a different device increases risk
*/
func EvaluateTransaction(txnID string) {

	log.Println("Fraud evaluation started for transaction:", txnID)

	// ------------------------------------------------
	// Load transaction
	// ------------------------------------------------
	var txn txnSnapshot
	if err := database.DB.
		Table("transactions").
		Where("id = ?", txnID).
		First(&txn).Error; err != nil {
		return
	}

	riskScore := 0
	var triggeredRules []string

	// ------------------------------------------------
	// Load user spending baseline
	// ------------------------------------------------
	var stats userStats
	database.DB.
		Table("user_transaction_stats").
		Select("avg_amount").
		Where("user_id = ?", txn.UserID).
		First(&stats)

	// =================================================
	// RULE 1: First transaction safety check
	// =================================================
	// If we don't know the user yet and the first transaction
	// itself is very large, we add risk.
	if stats.AvgAmount == 0 && txn.Amount > 100000 {
		riskScore += 30
		triggeredRules = append(triggeredRules, "FIRST_TRANSACTION_HIGH_AMOUNT")
	}

	// =================================================
	// RULE 2: Amount deviation
	// =================================================
	if stats.AvgAmount > 0 {

		switch {
		case txn.Amount >= stats.AvgAmount*10:
			riskScore += 40
			triggeredRules = append(triggeredRules, "AMOUNT_DEVIATION_HIGH")

		case txn.Amount >= stats.AvgAmount*5:
			riskScore += 30
			triggeredRules = append(triggeredRules, "AMOUNT_DEVIATION_MEDIUM")

		case txn.Amount >= stats.AvgAmount*2:
			riskScore += 20
			triggeredRules = append(triggeredRules, "AMOUNT_DEVIATION_LOW")
		}
	}

	// =================================================
	// RULE 3: Velocity (amount-aware)
	// =================================================
	var recentTxnCount int64

	database.DB.
		Table("transactions").
		Where(
			"user_id = ? AND created_at > ?",
			txn.UserID,
			time.Now().Add(-1*time.Minute),
		).
		Count(&recentTxnCount)

	if txn.Amount >= 1000 && txn.Amount < 10000 && recentTxnCount >= 4 {
		riskScore += 20
		triggeredRules = append(triggeredRules, "RAPID_MEDIUM_AMOUNT")
	}

	if txn.Amount >= 10000 && txn.Amount < 50000 && recentTxnCount >= 3 {
		riskScore += 30
		triggeredRules = append(triggeredRules, "RAPID_LARGE_AMOUNT")
	}

	if txn.Amount >= 50000 && recentTxnCount >= 2 {
		riskScore += 40
		triggeredRules = append(triggeredRules, "RAPID_VERY_LARGE_AMOUNT")
	}

	// =================================================
	// RULE 4: Device mismatch check
	// =================================================
	// We trust ONLY the first device used by the user.
	// Any other device always adds risk.
	var trustedDevice string

	database.DB.
		Table("devices").
		Select("device_id").
		Where("user_id = ?", txn.UserID).
		Limit(1).
		Scan(&trustedDevice)

	if trustedDevice != "" && trustedDevice != txn.DeviceID {
		riskScore += 30
		triggeredRules = append(triggeredRules, "UNTRUSTED_DEVICE")
	}

	// =================================================
	// RULE 5: Missing device guard
	// =================================================
	if txn.DeviceID == "" {
		riskScore += 50
		triggeredRules = append(triggeredRules, "MISSING_DEVICE_ID")
	}

	// ------------------------------------------------
	// Save fraud evaluation
	// ------------------------------------------------
	database.DB.Table("fraud_evaluations").Create(map[string]interface{}{
		"id":              uuid.NewString(),
		"transaction_id":  txn.ID,
		"risk_score":      riskScore,
		"rules_triggered": strings.Join(triggeredRules, ","),
		"created_at":      time.Now(),
	})

	// =================================================
	// Decision
	// =================================================
	status := "SUCCESS"
	event := "TRANSACTION_ALLOWED"

	if riskScore >= 30 && riskScore <= 70 {
		status = "FLAGGED"
		event = "TRANSACTION_FLAGGED"
	} else if riskScore > 70 {
		status = "BLOCKED"
		event = "TRANSACTION_BLOCKED"
	}

	// =================================================
	// Notifications
	// =================================================
	if status == "FLAGGED" {
		notifications.CreateTransactionNotification(
			txn.UserID,
			txn.ID,
			"TXN_FLAGGED",
			"Transaction Flagged",
			"Your transaction was flagged due to unusual activity.",
		)
	}

	if status == "BLOCKED" {
		notifications.CreateTransactionNotification(
			txn.UserID,
			txn.ID,
			"TXN_BLOCKED",
			"Transaction Blocked",
			"Your transaction was blocked due to high risk.",
		)
	}

	// ------------------------------------------------
	// Update transaction
	// ------------------------------------------------
	database.DB.
		Table("transactions").
		Where("id = ?", txn.ID).
		Updates(map[string]interface{}{
			"status":     status,
			"risk_score": riskScore,
		})

	// =================================================
	// Audit log
	// =================================================
	audit.CreateLog(&audit.AuditLog{
		ID:          uuid.NewString(),
		EventType:   event,
		EntityType:  "TRANSACTION",
		EntityID:    txn.ID,
		Description: "Triggered rules: " + strings.Join(triggeredRules, ","),
		CreatedAt:   time.Now(),
	})

	// =================================================
	// Learn behavior ONLY on success
	// =================================================
	if status == "SUCCESS" {

		database.DB.Exec(`
			INSERT INTO user_transaction_stats (user_id, total_txns, total_amount, avg_amount)
			VALUES (?, 1, ?, ?)
			ON CONFLICT (user_id)
			DO UPDATE SET
				total_txns = user_transaction_stats.total_txns + 1,
				total_amount = user_transaction_stats.total_amount + EXCLUDED.total_amount,
				avg_amount =
					(user_transaction_stats.total_amount + EXCLUDED.total_amount)
					/ (user_transaction_stats.total_txns + 1),
				last_updated = NOW()
		`, txn.UserID, txn.Amount, txn.Amount)
	}

	// =================================================
	// Store PRIMARY device only once
	// =================================================
	// We store device only if user has no device yet.
	if status == "SUCCESS" && trustedDevice == "" {
		database.DB.Table("devices").Create(map[string]interface{}{
			"user_id":    txn.UserID,
			"device_id":  txn.DeviceID,
			"first_seen": time.Now(),
		})
	}
}
