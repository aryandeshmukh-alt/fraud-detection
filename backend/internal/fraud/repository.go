package fraud

import "fraud-detection-backend/internal/database"

func SaveEvaluation(eval *FraudEvaluation) error {
	return database.DB.Create(eval).Error
}
