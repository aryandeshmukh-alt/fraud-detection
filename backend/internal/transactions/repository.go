package transactions

import "fraud-detection-backend/internal/database"

func Create(txn *Transaction) error {
	return database.DB.Create(txn).Error
}

func FindByID(id string) (*Transaction, error) {
	var txn Transaction
	err := database.DB.First(&txn, "id = ?", id).Error
	return &txn, err
}

func GetUserTransactions(userID string, limit, offset int) ([]Transaction, error) {
	var txns []Transaction
	err := database.DB.
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&txns).Error
	return txns, err
}
