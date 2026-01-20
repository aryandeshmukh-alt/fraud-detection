package middleware

import (
	"crypto/sha256"
	"encoding/hex"
	"log"
	"net"

	"github.com/gin-gonic/gin"
)

func DeviceMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		log.Println("DeviceMiddleware Started:")
		userAgent := c.Request.UserAgent()

		ip, _, err := net.SplitHostPort(c.Request.RemoteAddr)
		if err != nil {
			ip = c.ClientIP()
		}

		raw := userAgent + "|" + ip
		hash := sha256.Sum256([]byte(raw))
		deviceID := hex.EncodeToString(hash[:])

		//log.Println("📱 DeviceMiddleware device_id:", deviceID)

		c.Set("device_id", deviceID)
		c.Next()
	}
}
