package transactions

import (
	"fraud-detection-backend/pkg/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateTransactionHandler(c *gin.Context) {
	var req struct {
		Amount        float64 `json:"amount" binding:"required"`
		Currency      string  `json:"currency" binding:"required"`
		Location      string  `json:"location" binding:"required"`
		PaymentMethod string  `json:"payment_method" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "Invalid request", err.Error())
		return
	}

	// 🔐 Derived from JWT
	userID := c.GetString("user_id")

	// 📱 Derived from DeviceMiddleware
	deviceID := c.GetString("device_id")

	if deviceID == "" {
		response.Error(c, 500, "Device not detected", "device_id missing in context")
		return
	}

	txn, err := CreateTransaction(
		userID,
		req.Amount,
		req.Currency,
		deviceID,
		req.Location,
		req.PaymentMethod,
	)

	if err != nil {
		response.Error(c, 500, "Transaction failed", err.Error())
		return
	}

	response.Success(c, "Transaction created", txn)
}

func GetTransactionHistoryHandler(c *gin.Context) {
	userID := c.GetString("user_id")

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	txns, err := FetchTransactionHistory(userID, limit, offset)
	if err != nil {
		response.Error(c, 500, "Failed to fetch transactions", err.Error())
		return
	}

	response.Success(c, "Transaction history fetched", txns)
}
