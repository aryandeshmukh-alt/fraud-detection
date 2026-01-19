package middleware

import (
	"fraud-detection-backend/pkg/response"

	"github.com/gin-gonic/gin"
)

func RequireRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.GetString("role") != role {
			response.Error(c, 403, "Forbidden", "Insufficient role")
			c.Abort()
			return
		}
		c.Next()
	}
}
