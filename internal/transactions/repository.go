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
