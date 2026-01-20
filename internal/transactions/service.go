package transactions

import (
	"time"

	"fraud-detection-backend/internal/events"

	"github.com/google/uuid"
)

func CreateTransaction(userID string, amount float64, currency, deviceID, location string) (*Transaction, error) {
	txn := &Transaction{
		ID:        uuid.NewString(),
		UserID:    userID,
		Amount:    amount,
		Currency:  currency,
		Status:    "PENDING",
		RiskScore: 0,
		DeviceID:  deviceID,
		Location:  location,
		CreatedAt: time.Now(),
	}

	if err := Create(txn); err != nil {
		return nil, err
	}

	// 🔥 Publish async event (NON-BLOCKING)
	events.PublishTransactionCreated(events.TransactionEvent{
		TransactionID: txn.ID,
		UserID:        txn.UserID,
		Amount:        txn.Amount,
		DeviceID:      txn.DeviceID,
	})

	return txn, nil
}
