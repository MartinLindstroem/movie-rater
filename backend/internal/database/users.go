package database

import (
	"context"
	"errors"
	"log"

	"github.com/Geshdo/the-maze-go-martin/internal/auth"
	"github.com/Geshdo/the-maze-go-martin/types"
	"google.golang.org/api/iterator"
)

func CheckIfUserExists(email string) (bool, map[string]interface{}, error)  {
	ctx := context.Background()
	user := make(map[string]interface{})
	
	client := createFirestoreClient()
	defer client.Close()

	iter := client.Collection("users").Where("email", "==", email).Documents(ctx)
	for {
			doc, err := iter.Next()
			if err == iterator.Done {
					break
			}
			if err != nil {
				return false, user, err
			}

			if len(doc.Data()) > 0 {
				return true, doc.Data(), nil
			}
	}
	return false, user, nil
}

func CreateUser(data types.UserAuthRequest) error {
	ctx := context.Background()
	
	client := createFirestoreClient()
	defer client.Close()

	hashedPassword, hashErr := auth.HashPassword(data.Password)
	if hashErr != nil {
		log.Println("Error hashing password: ", hashErr)
		return hashErr
	}

	_, _, err := client.Collection("users").Add(ctx, map[string]interface{}{
		"email":    	data.Email,
		"password":    hashedPassword,

	})
	if err != nil {
			log.Printf("An error has occurred: %s", err)
	}

	return err
}

func CheckUserCredentials(data types.UserAuthRequest) error {
	userExists, user, err := CheckIfUserExists(data.Email)
	if err != nil {
		log.Fatal(err)
	}

	if userExists {
		err := auth.CheckPasswordHash(data.Password, user["password"].(string))

		if err != nil {
			log.Fatalf("Error comparing passwords: %v", err)
		}

		return err
	}

	return errors.New("incorrect password")
}