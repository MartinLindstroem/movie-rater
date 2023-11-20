package main

import (
	"encoding/json"
	"net/http"
)

type AddMovieRequest struct {
	Title string `json:"title"`
	Image string `json:"image"`
	Imdb string `json:"imdb"`
	Rating int `json:"rating"`
}

type EditMovieRequest struct {
	Id string `json:"id"`
	Title string `json:"title"`
	Image string `json:"image"`
	Imdb string `json:"imdb"`
	Rating int `json:"rating"`
	Count int `json:"count"`
}

type DeleteMovieRequest struct {
	Id string `json:"id"`
}

func handlerReadiness(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, 200, struct{}{})
}

func handlerErr(w http.ResponseWriter, r *http.Request) {
	respondWithError(w, 400, "Something went wrong")
}

func handlerGetMovies(w http.ResponseWriter, r *http.Request) {
	movies := getAllMovies()
	respondWithJSON(w, 200, movies)
}

func handlerAddMovie(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var data AddMovieRequest
	err := json.NewDecoder(r.Body).Decode(&data)
	
	if err != nil {
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	if (data.Title == "" || data.Imdb == "" || data.Rating == 0) {
		respondWithError(w, 400, "Invalid data given")
	} else {
		err = addMovie(data)
		if err != nil {
			respondWithError(w, 500, "Something went wrong")
		}  else {
			respondWithJSON(w, 201, "Movie successfully added")
		}
	}
}

func handlerDeleteMovie(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var data DeleteMovieRequest
	err := json.NewDecoder(r.Body).Decode(&data)
	
	if err != nil {
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	if (data.Id == "") {
		respondWithError(w, 400, "Invalid data given")
	} else {
		err = deleteMovie(data.Id)
		if err != nil {
			respondWithError(w, 500, "Something went wrong")
		} else {
			respondWithJSON(w, 200, "Movie successfully deleted")
		}
	}
}

func handlerEditMovie(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var data EditMovieRequest
	err := json.NewDecoder(r.Body).Decode(&data)
	
	if err != nil {
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	if (data.Id == "") {
		respondWithError(w, 400, "Invalid data given")
	} else {
		err = editMovie(data)
		if err != nil {
			respondWithError(w, 500, "Something went wrong")
		} else {
			respondWithJSON(w, 200, "Movie successfully edited")
		}
	}
}