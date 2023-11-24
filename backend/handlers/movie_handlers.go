package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Geshdo/the-maze-go-martin/helpers"
	"github.com/Geshdo/the-maze-go-martin/internal/database"
	"github.com/Geshdo/the-maze-go-martin/types"
)



func HandlerReadiness(w http.ResponseWriter, r *http.Request) {
	helpers.RespondWithJSON(w, 200, struct{}{})
}

func HandlerErr(w http.ResponseWriter, r *http.Request) {
	helpers.RespondWithError(w, 400, "Something went wrong")
}

func GetMoviesHandler(w http.ResponseWriter, r *http.Request) {
	movies := database.GetAllMovies()
	helpers.RespondWithJSON(w, 200, movies)
}

func AddMovieHandler(w http.ResponseWriter, r *http.Request) {
	var data types.AddMovieRequest
	err := json.NewDecoder(r.Body).Decode(&data)
	
	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Error decoding JSON")
		return
	}

	if (data.Title == "" || data.Imdb == "" || data.Rating < 1) {
		helpers.RespondWithError(w, 400, "Invalid data given")
	} else {
		err = database.AddMovie(data)
		if err != nil {
			helpers.RespondWithError(w, 500, "Something went wrong")
		}  else {
			helpers.RespondWithJSON(w, 201, "Movie successfully added")
		}
	}
}

func DeleteMovieHandler(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
			return
		}

		helpers.RespondWithError(w, http.StatusBadRequest, "An error occured")
	}

	tokenString := c.Value
	fmt.Println(tokenString)

	// token, err := auth.VerifyJwtToken(tokenString)

	var data types.DeleteMovieRequest
	err = json.NewDecoder(r.Body).Decode(&data)
	
	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Error decoding JSON")
		return
	}

	if (data.Id == "") {
		helpers.RespondWithError(w, 400, "Invalid data given")
	} else {
		err = database.DeleteMovie(data.Id)
		if err != nil {
			helpers.RespondWithError(w, 500, "Something went wrong")
		} else {
			helpers.RespondWithJSON(w, 200, "Movie successfully deleted")
		}
	}
}

func EditMovieHandler(w http.ResponseWriter, r *http.Request) {
	var data types.EditMovieRequest
	err := json.NewDecoder(r.Body).Decode(&data)
	
	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Error decoding JSON")
		return
	}

	if (data.Id == "" || data.Rating < 1) {
		helpers.RespondWithError(w, 400, "Invalid data given")
	} else {
		err = database.EditMovie(data)
		if err != nil {
			helpers.RespondWithError(w, 500, "Something went wrong")
		} else {
			helpers.RespondWithJSON(w, 200, "Movie successfully edited")
		}
	}
}

func RateMovieHandler(w http.ResponseWriter, r *http.Request) {
	var data types.UpdateRatingRequest
	err := json.NewDecoder(r.Body).Decode(&data)
	
	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Error decoding JSON")
		return
	}

	if (data.Rating < 1 || data.Id == "") {
		helpers.RespondWithError(w, 400, "Invalid data given")
	} else {
		err = database.UpdateMovieRating(data)
		if err != nil {
			helpers.RespondWithError(w, 500, "Something went wrong")
		} else {
			helpers.RespondWithJSON(w, 200, "Movie successfully updated")
		}
	}
}