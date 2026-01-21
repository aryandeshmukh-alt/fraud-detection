package admin

import (
	"fraud-detection-backend/internal/database"
)

type TransactionSummary struct {
	ID        string
	UserID    string
	Amount    float64
	Status    string
	RiskScore int
	CreatedAt string
}

type FraudDetail struct {
	TransactionID  string
	RiskScore      int
	RulesTriggered string
	CreatedAt      string
}

type AuditLogEntry struct {
	EventType   string
	EntityType  string
	EntityID    string
	Description string
	CreatedAt   string
}

// -------- Transactions --------

func GetFlaggedAndBlockedTransactions() ([]TransactionSummary, error) {
	var txns []TransactionSummary

	err := database.DB.
		Table("transactions").
		Select("id, user_id, amount, status, risk_score, created_at").
		Where("status IN ('FLAGGED', 'BLOCKED')").
		Order("created_at DESC").
		Scan(&txns).Error

	return txns, err
}

// -------- Fraud Evaluations --------

func GetFraudEvaluations(limit int) ([]FraudDetail, error) {
	var evals []FraudDetail

	err := database.DB.
		Table("fraud_evaluations").
		Select("transaction_id, risk_score, rules_triggered, created_at").
		Order("created_at DESC").
		Limit(limit).
		Scan(&evals).Error

	return evals, err
}

// -------- Audit Logs --------

func GetAuditLogs(limit int) ([]AuditLogEntry, error) {
	var logs []AuditLogEntry

	err := database.DB.
		Table("audit_logs").
		Select("event_type, entity_type, entity_id, description, created_at").
		Order("created_at DESC").
		Limit(limit).
		Scan(&logs).Error

	return logs, err
}
