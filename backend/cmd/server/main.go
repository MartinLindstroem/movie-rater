package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Geshdo/the-maze-go-martin/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load("./.env")
	// test
	portString := os.Getenv("PORT")

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options {
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
		ExposedHeaders: []string{"Link"},
		AllowCredentials: true,
		MaxAge: 300,
	}))

	v1Router := chi.NewRouter()
	v1Router.Get("/healthz", handlers.HandlerReadiness)
	v1Router.Get("/err", handlers.HandlerErr)
	v1Router.Get("/movies", handlers.GetMoviesHandler)
	v1Router.Post("/movies/add", handlers.AddMovieHandler)
	v1Router.Delete("/movies/delete", handlers.DeleteMovieHandler)
	v1Router.Put("/movies/edit", handlers.EditMovieHandler)
	v1Router.Put("/movies/rate", handlers.RateMovieHandler)
	v1Router.Post("/users/register", handlers.CreateUserHandler)
	v1Router.Post("/users/login", handlers.LoginHandler)
	v1Router.Post("/users/logout", handlers.LogoutHandler)

	router.Mount("/v1", v1Router)

	srv := &http.Server {
		Handler: router,
		Addr: ":" + portString,
	}

	log.Printf("Server starting on port %v", portString)
	err := srv.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Port: ", portString)

}