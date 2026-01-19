package audit

import "time"

type AuditLog struct {
	ID          string
	EventType   string
	EntityType  string
	EntityID    string
	Description string
	CreatedAt   time.Time
}
