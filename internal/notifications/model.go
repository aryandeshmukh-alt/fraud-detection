package notifications

import "time"

type Notification struct {
	ID            string  `gorm:"type:uuid;primaryKey"`
	UserID        string  `gorm:"type:uuid;not null"`
	TransactionID *string `gorm:"type:uuid"`

	Type    string `gorm:"size:50;not null"`
	Channel string `gorm:"size:30;not null"`
	Status  string `gorm:"size:30;not null"`

	Title   string `gorm:"size:200;not null"`
	Message string `gorm:"type:text;not null"`

	CreatedAt time.Time
	ReadAt    *time.Time
}
