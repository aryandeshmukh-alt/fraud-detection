package router

import (
	"fraud-detection-backend/internal/middleware"
	"fraud-detection-backend/pkg/response"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.New()
	r.Use(middleware.RequestLogger())
	r.Use(gin.Recovery())

	r.GET("/health", func(c *gin.Context) {
		response.Success(c, "Service is healthy", gin.H{
			"status": "UP",
		})
	})

	return r
}
