package auth

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var secretKey = os.Getenv("JWT_SECRET")
var jwtKey = []byte(secretKey)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    fmt.Println(string(bytes), err)
    return string(bytes), err
}

func CheckPasswordHash(password, hash string) error {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err
}

func CreateJwtToken(username string) (string, error) {
    
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims {
        "username": username,
        "exp": time.Now().Add(time.Minute * 30),
    })

    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        log.Println(err)
        return "", err
    }

    return tokenString, nil
}

func VerifyJwtToken(tokenString string) error {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })

    if err != nil {
        return err
    }

    if !token.Valid {
        return fmt.Errorf("invalid token")
    }

    return nil
}
