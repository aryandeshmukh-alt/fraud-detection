package transactions

import (
	"fraud-detection-backend/pkg/response"

	"github.com/gin-gonic/gin"
)

func CreateTransactionHandler(c *gin.Context) {
	var req struct {
		Amount   float64 `json:"amount"`
		Currency string  `json:"currency"`
		Location string  `json:"location"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "Invalid request", err.Error())
		return
	}

	userID := c.GetString("user_id")
	deviceID := c.GetString("device_id")

	txn, err := CreateTransaction(
		userID,
		req.Amount,
		req.Currency,
		deviceID,
		req.Location,
	)

	if err != nil {
		response.Error(c, 500, "Transaction failed", err.Error())
		return
	}

	response.Success(c, "Transaction created", txn)
}
