package auth

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var secretKey string
var jwtKey []byte

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
	secretKey = os.Getenv("JWT_SECRET")
	jwtKey = []byte(secretKey)
	log.Printf("JWT secret is %v", secretKey)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Minute * 30).Unix(),
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

func AuthorizeUser(r *http.Request) (msg string, code int, err error) {
	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			return "Unauthorized", 401, err
		}

		return "An error occured", 400, err
	}

	tokenString := c.Value
	err = VerifyJwtToken(tokenString)

	if err != nil {
		return "Unauthorized", 401, err
	}

	return "Successful login", 200, nil
}
