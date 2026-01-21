package transactions

import "time"

type Transaction struct {
	ID            string `gorm:"primaryKey"`
	UserID        string `gorm:"index"`
	Amount        float64
	Currency      string
	Status        string
	RiskScore     int
	DeviceID      string `gorm:"index"`
	Location      string
	PaymentMethod string
	CreatedAt     time.Time
}
