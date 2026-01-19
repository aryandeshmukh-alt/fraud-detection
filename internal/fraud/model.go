package fraud

import "time"

type FraudEvaluation struct {
	ID             string
	TransactionID  string
	RiskScore      int
	RulesTriggered string
	CreatedAt      time.Time
}
