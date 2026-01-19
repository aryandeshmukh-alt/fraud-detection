package transactions

import "time"

type Transaction struct {
	ID        string `gorm:"type:uuid;primaryKey"`
	UserID    string
	Amount    float64
	Currency  string
	Status    string
	RiskScore int
	DeviceID  string
	Location  string
	CreatedAt time.Time
}
