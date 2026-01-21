package auth

import (
	"fraud-detection-backend/pkg/response"

	"github.com/gin-gonic/gin"
)

func RegisterHandler(c *gin.Context) {
	var req struct {
		Name     string
		Email    string
		Password string
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "Invalid request", err.Error())
		return
	}

	user, err := Register(req.Name, req.Email, req.Password)
	if err != nil {
		response.Error(c, 400, "Registration failed", err.Error())
		return
	}

	response.Success(c, "User registered", gin.H{
		"user_id": user.ID,
	})
}

func LoginHandler(c *gin.Context) {
	var req struct {
		Email    string
		Password string
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "Invalid request", err.Error())
		return
	}

	user, err := Login(req.Email, req.Password)
	if err != nil {
		response.Error(c, 401, "Login failed", err.Error())
		return
	}

	token, err := GenerateToken(user.ID, user.Role)
	if err != nil {
		response.Error(c, 500, "Token generation failed", err.Error())
		return
	}

	// 🔐 Set JWT as HTTP-only cookie
	c.SetCookie(
		"access_token", // name
		token,          // value
		86400,          // maxAge (1 day)
		"/",            // path
		"",             // domain (empty = current)
		false,          // secure (true in prod with HTTPS)
		true,           // httpOnly
	)

	response.Success(c, "Login successful", gin.H{
		"user_id": user.ID,
		"role":    user.Role,
	})
}

func LogoutHandler(c *gin.Context) {
	c.SetCookie(
		"access_token",
		"",
		-1, // delete cookie
		"/",
		"",
		false,
		true,
	)

	response.Success(c, "Logged out successfully", nil)
}
