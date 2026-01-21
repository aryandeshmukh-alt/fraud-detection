package jobs

import (
	"log"

	"github.com/robfig/cron/v3"
)

func StartScheduler() {
	c := cron.New(cron.WithSeconds())

	// Daily at 02:00 AM
	c.AddFunc("0 0 2 * * *", NotificationCleanupJob)

	// TEMP: Every 1 minute (for testing)
	c.AddFunc("0 * * * * *", FraudSummaryJob)

	// Every 5 minutes
	c.AddFunc("0 */5 * * * *", StaleTransactionJob)

	log.Println("🕒 Cron scheduler started")

	c.Start()
}
