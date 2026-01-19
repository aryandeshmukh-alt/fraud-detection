package auth

import (
	"errors"

	"fraud-detection-backend/internal/database"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Register(name, email, password string) (*User, error) {
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), 10)

	user := &User{
		ID:       uuid.NewString(),
		Name:     name,
		Email:    email,
		Password: string(hash),
		Role:     "USER",
	}

	if err := database.DB.Create(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func Login(email, password string) (*User, error) {
	var user User
	if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	return &user, nil
}
