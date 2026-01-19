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

type txnSnapshot struct {
	ID        string
	UserID    string
	Amount    float64
	DeviceID  string
	CreatedAt time.Time
}

func EvaluateTransaction(txnID string) {
	var txn txnSnapshot

	log.Println("🧠 Fraud evaluation started for txn:", txnID)

	if err := database.DB.
		Table("transactions").
		Where("id = ?", txnID).
		First(&txn).Error; err != nil {
		return
	}

	risk := 0
	var rules []string

	// ---------- LARGE AMOUNT ----------
	if txn.Amount > 50000 {
		risk += 40
		rules = append(rules, LargeAmountRule)
	}

	// ---------- RAPID TRANSACTIONS (TEST MODE) ----------
	var txnCount int64
	database.DB.
		Table("transactions").
		Where(
			"user_id = ? AND created_at > ?",
			txn.UserID,
			time.Now().Add(-30*time.Second),
		).
		Count(&txnCount)

	if txnCount >= 2 {
		risk += 30
		rules = append(rules, RapidTxnRule)
	}

	// ---------- NEW DEVICE ----------
	var deviceCount int64
	database.DB.
		Table("devices").
		Where("device_id = ?", txn.DeviceID).
		Count(&deviceCount)

	if deviceCount == 0 {
		risk += 20
		rules = append(rules, NewDeviceRule)
	}

	// ---------- SAVE FRAUD EVALUATION ----------
	database.DB.Table("fraud_evaluations").Create(map[string]interface{}{
		"id":              uuid.NewString(),
		"transaction_id":  txn.ID,
		"risk_score":      risk,
		"rules_triggered": strings.Join(rules, ","),
		"created_at":      time.Now(),
	})

	// ---------- DECISION ----------
	status := "SUCCESS"
	event := "TRANSACTION_ALLOWED"

	if risk >= 30 && risk <= 70 {
		status = "FLAGGED"
		event = "TRANSACTION_FLAGGED"
	} else if risk > 70 {
		status = "BLOCKED"
		event = "TRANSACTION_BLOCKED"
	}

	log.Println("📢 Creating notification for status:", status)

	// ---------------- Notifications ----------------
	if status == "FLAGGED" {
		notifications.CreateTransactionNotification(
			txn.UserID,
			txn.ID,
			"TXN_FLAGGED",
			"Transaction Flagged",
			"Your transaction was flagged due to suspicious activity.",
		)
	}

	if status == "BLOCKED" {
		notifications.CreateTransactionNotification(
			txn.UserID,
			txn.ID,
			"TXN_BLOCKED",
			"Transaction Blocked",
			"Your transaction was blocked due to high risk activity.",
		)
	}

	database.DB.Table("transactions").
		Where("id = ?", txn.ID).
		Updates(map[string]interface{}{
			"status":     status,
			"risk_score": risk,
		})

	// ---------- AUDIT ----------
	audit.CreateLog(&audit.AuditLog{
		ID:          uuid.NewString(),
		EventType:   event,
		EntityType:  "TRANSACTION",
		EntityID:    txn.ID,
		Description: "Rules triggered: " + strings.Join(rules, ","),
		CreatedAt:   time.Now(),
	})

	// ---------- DEVICE LEARNING ----------
	// Device learning ONLY for safe transactions
	if deviceCount == 0 && status == "SUCCESS" {
		database.DB.Table("devices").Create(map[string]interface{}{
			"device_id":  txn.DeviceID,
			"user_id":    txn.UserID,
			"first_seen": time.Now(),
		})
	}

}
