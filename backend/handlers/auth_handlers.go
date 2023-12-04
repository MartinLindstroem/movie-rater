package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"net/mail"
	"time"

	"github.com/Geshdo/the-maze-go-martin/helpers"
	"github.com/Geshdo/the-maze-go-martin/internal/auth"
	"github.com/Geshdo/the-maze-go-martin/internal/database"
	"github.com/Geshdo/the-maze-go-martin/types"
)

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	var data types.UserAuthRequest
	err := json.NewDecoder(r.Body).Decode(&data)
	
	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Error decoding JSON")
		return
	}

	userExists, _, err := database.CheckIfUserExists(data.Email)
	if err != nil {
		log.Fatal(err)
	}

	if userExists {
		helpers.RespondWithError(w, http.StatusBadRequest, "User already exists")
		return
	}

	_, err = mail.ParseAddress(data.Email)

	if err != nil {
		helpers.RespondWithError(w, 400, "Invalid email address")
		return
	}

	if (len(data.Password) < 5) {
		helpers.RespondWithError(w, 400, "Password too short")
		return
	} 
	
	err = database.CreateUser(data)
	if err != nil {
		helpers.RespondWithError(w, 500, "Something went wrong")
	}  else {
		helpers.RespondWithJSON(w, 201, "User successfully created")
	}

}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var data types.UserAuthRequest
	err := json.NewDecoder(r.Body).Decode(&data)
	
	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Error decoding JSON")
		return
	}

	err = database.CheckUserCredentials(data)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	tokenString, err := auth.CreateJwtToken(data.Email)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	http.SetCookie(w, &http.Cookie {
		Name: "token",
		Value: tokenString,
		Path: "/",
		Expires: time.Now().Add(time.Minute * 30),
		HttpOnly: true,
	})


	helpers.RespondWithJSON(w, http.StatusOK, types.LoginResponse{
		Msg: "Successful login",
		Email: data.Email,
	})
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie {
		Name: "token",
		Value: "",
		Path: "/",
		MaxAge: -1,
	})

	helpers.RespondWithJSON(w, http.StatusOK, "Successful logout")
}