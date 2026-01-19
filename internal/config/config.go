package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	ServerPort string
	AppEnv     string
}

var AppConfig *Config

func LoadConfig() {
	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Fatal("Error loading .env file")
	}

	AppConfig = &Config{
		ServerPort: viper.GetString("SERVER_PORT"),
		AppEnv:     viper.GetString("APP_ENV"),
	}
}
