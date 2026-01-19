package main

import (
	"fraud-detection-backend/internal/config"
	"fraud-detection-backend/internal/logger"
	"fraud-detection-backend/internal/router"
)

func main() {
	config.LoadConfig()
	logger.InitLogger()

	r := router.SetupRouter()
	r.Run(":" + config.AppConfig.ServerPort)
}
