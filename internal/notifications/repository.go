package notifications

import (
	"time"

	"fraud-detection-backend/internal/database"
)

func Create(notification *Notification) error {
	return database.DB.Create(notification).Error
}

func GetByUser(userID string, limit, offset int) ([]Notification, error) {
	var notifications []Notification
	err := database.DB.
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&notifications).Error
	return notifications, err
}

func GetUnreadCount(userID string) (int64, error) {
	var count int64
	err := database.DB.
		Model(&Notification{}).
		Where("user_id = ? AND read_at IS NULL", userID).
		Count(&count).Error
	return count, err
}

func MarkAsRead(notificationID, userID string) error {
	now := time.Now()
	return database.DB.
		Model(&Notification{}).
		Where("id = ? AND user_id = ?", notificationID, userID).
		Update("read_at", now).Error
}

func MarkAllAsRead(userID string) error {
	now := time.Now()
	return database.DB.
		Model(&Notification{}).
		Where("user_id = ? AND read_at IS NULL", userID).
		Update("read_at", now).Error
}
