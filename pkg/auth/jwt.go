package auth

import (
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/29 11:20
// @Desc:	Jwt生成与解析

type AccessClaims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	JwtSign  string `json:"jwt_sign"`
	jwt.RegisteredClaims
}

func CreateAccessToken(userID uint, username, secretKey, jwtSign string) (string, error) {
	jwtSecret := []byte(secretKey)

	claims := AccessClaims{
		UserID:   userID,
		Username: username,
		JwtSign:  jwtSign,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   "cyber-life",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(12 * time.Hour)),
			ID:        fmt.Sprintf("%d-%d", userID, time.Now().UnixNano()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ParseAccessToken(tokenStr, secretKey string) (*AccessClaims, error) {
	jwtSecret := []byte(secretKey)
	token, err := jwt.ParseWithClaims(tokenStr, &AccessClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*AccessClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("token非法")
}
