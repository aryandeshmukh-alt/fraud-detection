package transactions

import (
	"time"

	"fraud-detection-backend/internal/events"

	"github.com/google/uuid"
)

func CreateTransaction(
	userID string,
	amount float64,
	currency string,
	deviceID string,
	location string,
	paymentMethod string,
) (*Transaction, error) {

	txn := &Transaction{
		ID:            uuid.NewString(),
		UserID:        userID,
		Amount:        amount,
		Currency:      currency,
		Status:        "PENDING",
		RiskScore:     0,
		DeviceID:      deviceID,
		Location:      location,
		PaymentMethod: paymentMethod,
		CreatedAt:     time.Now(),
	}

	if err := Create(txn); err != nil {
		return nil, err
	}

	events.PublishTransactionCreated(events.TransactionEvent{
		TransactionID: txn.ID,
		UserID:        txn.UserID,
		Amount:        txn.Amount,
	})

	return txn, nil
}

func FetchTransactionHistory(userID string, limit, offset int) ([]Transaction, error) {
	return GetUserTransactions(userID, limit, offset)
}
