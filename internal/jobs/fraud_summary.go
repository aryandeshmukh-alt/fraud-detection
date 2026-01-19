package jobs

import (
	"log"

	"fraud-detection-backend/internal/database"
)

func FraudSummaryJob() {
	type Summary struct {
		Status string
		Count  int64
	}

	var results []Summary

	database.DB.
		Table("transactions").
		Select("status, COUNT(*) as count").
		Group("status").
		Scan(&results)

	log.Println("📊 Fraud summary snapshot:")
	for _, r := range results {
		log.Printf("   %s → %d\n", r.Status, r.Count)
	}
}
