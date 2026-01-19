package router

import (
	"github.com/gin-gonic/gin"

	"fraud-detection-backend/internal/auth"
	"fraud-detection-backend/internal/middleware"
	"fraud-detection-backend/pkg/response"
)

func SetupRouter() *gin.Engine {
	r := gin.New()
	r.Use(middleware.RequestLogger())
	r.Use(gin.Recovery())

	r.POST("/auth/register", auth.RegisterHandler)
	r.POST("/auth/login", auth.LoginHandler)

	protected := r.Group("/protected")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/me", func(c *gin.Context) {
			response.Success(c, "Authenticated user", gin.H{
				"user_id": c.GetString("user_id"),
				"role":    c.GetString("role"),
			})
		})
	}

	return r
}
