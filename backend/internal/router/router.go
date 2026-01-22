package router

import (
	"github.com/gin-gonic/gin"

	"fraud-detection-backend/internal/admin"
	"fraud-detection-backend/internal/auth"
	"fraud-detection-backend/internal/middleware"
	"fraud-detection-backend/internal/notifications"
	"fraud-detection-backend/internal/transactions"
	"fraud-detection-backend/pkg/response"
)

func SetupRouter() *gin.Engine {
	r := gin.New()

	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.RequestLogger())
	r.Use(gin.Recovery())

	// -------- Debug --------
	r.GET("/__debug", func(c *gin.Context) {
		c.JSON(200, gin.H{"routes": "router loaded"})
	})

	// -------- Auth Routes --------
	r.POST("/auth/register", auth.RegisterHandler)
	r.POST("/auth/login", auth.LoginHandler)
	r.POST("/auth/logout", middleware.AuthMiddleware(), auth.LogoutHandler)

	// -------- Protected User Routes --------
	protected := r.Group("/")
	protected.Use(
		middleware.AuthMiddleware(),
		middleware.DeviceMiddleware(), // 🔥 ADD THIS
	)
	{
		protected.GET("/protected/me", func(c *gin.Context) {
			response.Success(c, "Authenticated user", gin.H{
				"user_id":   c.GetString("user_id"),
				"role":      c.GetString("role"),
				"device_id": c.GetString("device_id"),
			})
		})

		protected.POST("/transactions", transactions.CreateTransactionHandler)
		protected.GET("/transactions/history", transactions.GetTransactionHistoryHandler)
		protected.GET("/notifications", notifications.GetNotificationsHandler)
		protected.GET("/notifications/unread-count", notifications.GetUnreadCountHandler)
		protected.PATCH("/notifications/:id/read", notifications.MarkNotificationReadHandler)
		protected.PATCH("/notifications/read-all", notifications.MarkAllReadHandler)
	}

	// -------- Admin Routes (🔥 MUST BE BEFORE return) --------
	adminGroup := r.Group("/admin")
	adminGroup.Use(
		middleware.AuthMiddleware(),
		middleware.DeviceMiddleware(),
		middleware.RequireRole("ADMIN"),
	)
	{
		adminGroup.GET("/transactions", admin.GetFlaggedTransactionsHandler)
		adminGroup.GET("/fraud-evaluations", admin.GetFraudEvaluationsHandler)
		adminGroup.GET("/audit-logs", admin.GetAuditLogsHandler)
	}

	return r
}
