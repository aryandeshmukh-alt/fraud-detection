package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	ServerPort string
	AppEnv     string
	DBDsn      string
	JWTSecret  string
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
		DBDsn:      viper.GetString("DB_DSN"),
		JWTSecret:  viper.GetString("JWT_SECRET"),
	}
}
