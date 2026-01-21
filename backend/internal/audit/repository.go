package audit

import "fraud-detection-backend/internal/database"

func CreateLog(log *AuditLog) error {
	return database.DB.Create(log).Error
}
