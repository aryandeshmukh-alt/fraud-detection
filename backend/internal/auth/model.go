package auth

import "time"

type User struct {
	ID        string `gorm:"type:uuid;primaryKey"`
	Name      string
	Email     string `gorm:"unique"`
	Password  string
	Role      string
	CreatedAt time.Time
}
