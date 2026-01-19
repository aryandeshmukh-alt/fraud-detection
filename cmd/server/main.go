package main

import (
	"fraud-detection-backend/internal/auth"
	"fraud-detection-backend/internal/config"
	"fraud-detection-backend/internal/database"
	"fraud-detection-backend/internal/events"
	"fraud-detection-backend/internal/jobs"
	"fraud-detection-backend/internal/logger"
	"fraud-detection-backend/internal/notifications"
	"fraud-detection-backend/internal/router"
	"fraud-detection-backend/internal/transactions"
)

func main() {
	config.LoadConfig()
	logger.InitLogger()

	database.Connect(config.AppConfig.DBDsn)
	jobs.StartScheduler()

	database.DB.AutoMigrate(
		&auth.User{},
		&transactions.Transaction{},
		&transactions.Device{},
		&notifications.Notification{},
	)

	events.InitRabbitMQ()
	events.StartTransactionConsumer()

	r := router.SetupRouter()
	r.Run(":" + config.AppConfig.ServerPort)
}
