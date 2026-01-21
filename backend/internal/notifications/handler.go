package notifications

import (
	"strconv"

	"fraud-detection-backend/pkg/response"

	"github.com/gin-gonic/gin"
)

// GET /notifications
func GetNotificationsHandler(c *gin.Context) {
	userID := c.GetString("user_id")

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	notifications, err := FetchUserNotifications(userID, limit, offset)
	if err != nil {
		response.Error(c, 500, "Failed to fetch notifications", err.Error())
		return
	}

	response.Success(c, "Notifications fetched", notifications)
}

// GET /notifications/unread-count
func GetUnreadCountHandler(c *gin.Context) {
	userID := c.GetString("user_id")

	count, err := FetchUnreadCount(userID)
	if err != nil {
		response.Error(c, 500, "Failed to fetch unread count", err.Error())
		return
	}

	response.Success(c, "Unread count fetched", gin.H{
		"unread_count": count,
	})
}

// PATCH /notifications/:id/read
func MarkNotificationReadHandler(c *gin.Context) {
	userID := c.GetString("user_id")
	notificationID := c.Param("id")

	if err := ReadNotification(notificationID, userID); err != nil {
		response.Error(c, 500, "Failed to mark notification as read", err.Error())
		return
	}

	response.Success(c, "Notification marked as read", nil)
}

// PATCH /notifications/read-all
func MarkAllReadHandler(c *gin.Context) {
	userID := c.GetString("user_id")

	if err := ReadAllNotifications(userID); err != nil {
		response.Error(c, 500, "Failed to mark all notifications as read", err.Error())
		return
	}

	response.Success(c, "All notifications marked as read", nil)
}
