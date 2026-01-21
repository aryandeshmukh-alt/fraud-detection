package events

import (
	"encoding/json"

	amqp "github.com/rabbitmq/amqp091-go"
)

type TransactionEvent struct {
	TransactionID string  `json:"transaction_id"`
	UserID        string  `json:"user_id"`
	Amount        float64 `json:"amount"`
	DeviceID      string  `json:"device_id"`
}

func PublishTransactionCreated(event TransactionEvent) error {
	body, _ := json.Marshal(event)

	return Channel.Publish(
		"",
		"transactions.created",
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
}
