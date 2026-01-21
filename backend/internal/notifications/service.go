package notifications

import (
	"log"
	"time"

	"github.com/google/uuid"
)

func CreateTransactionNotification(
	userID string,
	transactionID string,
	notificationType string,
	title string,
	message string,
) error {

	n := &Notification{
		ID:            uuid.NewString(),
		UserID:        userID,
		TransactionID: &transactionID,
		Type:          notificationType,
		Channel:       "IN_APP",
		Status:        "SENT",
		Title:         title,
		Message:       message,
		CreatedAt:     time.Now(),
	}

	if err := Create(n); err != nil {
		log.Println("❌ Notification creation failed:", err)
		return err
	}

	return nil // ✅ DO NOT insert again
}

func FetchUserNotifications(userID string, limit, offset int) ([]Notification, error) {
	return GetByUser(userID, limit, offset)
}

func FetchUnreadCount(userID string) (int64, error) {
	return GetUnreadCount(userID)
}

func ReadNotification(notificationID, userID string) error {
	return MarkAsRead(notificationID, userID)
}

func ReadAllNotifications(userID string) error {
	return MarkAllAsRead(userID)
}
