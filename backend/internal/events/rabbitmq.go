package events

import (
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

var Channel *amqp.Channel

func InitRabbitMQ() {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatal("Failed to connect to RabbitMQ")
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("Failed to open channel")
	}

	_, err = ch.QueueDeclare(
		"transactions.created",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal("Queue declare failed")
	}

	Channel = ch
}
