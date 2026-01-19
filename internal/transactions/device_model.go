package transactions

import "time"

type Device struct {
	DeviceID  string `gorm:"primaryKey"`
	UserID    string
	FirstSeen time.Time
}
