package jobs

import (
	"log"
	"time"

	"fraud-detection-backend/internal/database"
)

func StaleTransactionJob() {
	cutoff := time.Now().Add(-10 * time.Minute)

	result := database.DB.
		Table("transactions").
		Where("status = ? AND created_at < ?", "PENDING", cutoff).
		Update("status", "FAILED")

	log.Printf("⏱️ Stale transactions marked FAILED: %d\n", result.RowsAffected)
}
