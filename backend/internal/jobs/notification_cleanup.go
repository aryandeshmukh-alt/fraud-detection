package jobs

import (
	"log"
	"time"

	"fraud-detection-backend/internal/database"
)

func NotificationCleanupJob() {
	cutoff := time.Now().AddDate(0, 0, -30)

	result := database.DB.
		Table("notifications").
		Where("read_at IS NOT NULL AND created_at < ?", cutoff).
		Delete(nil)

	log.Printf("🧹 Notification cleanup: %d rows deleted\n", result.RowsAffected)
}
