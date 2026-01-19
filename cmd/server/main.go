package main

import (
	"fraud-detection-backend/internal/auth"
	"fraud-detection-backend/internal/config"
	"fraud-detection-backend/internal/database"
	"fraud-detection-backend/internal/logger"
	"fraud-detection-backend/internal/router"
)

func main() {
	config.LoadConfig()
	logger.InitLogger()

	// Connect DB
	database.Connect(config.AppConfig.DBDsn)

	// Auto-migrate User table
	database.DB.AutoMigrate(&auth.User{})

	// Start server
	r := router.SetupRouter()
	r.Run(":" + config.AppConfig.ServerPort)
}
