package events

import (
	"encoding/json"
	"log"

	"fraud-detection-backend/internal/fraud"
)

func StartTransactionConsumer() {
	msgs, err := Channel.Consume(
		"transactions.created",
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal("Failed to start consumer:", err)
	}

	go func() {
		for msg := range msgs {
			var event TransactionEvent
			if err := json.Unmarshal(msg.Body, &event); err != nil {
				log.Println("Invalid event:", err)
				continue
			}

			log.Println("📥 Received transaction event:", event.TransactionID)

			// 🔥 Async fraud evaluation
			fraud.EvaluateTransaction(event.TransactionID)
		}
	}()
}
