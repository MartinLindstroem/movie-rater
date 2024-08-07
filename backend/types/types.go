package types

import "github.com/golang-jwt/jwt/v5"

type AddMovieRequest struct {
	Title  string `json:"title"`
	Image  string `json:"image"`
	Imdb   string `json:"imdb"`
	Rating int64  `json:"rating"`
}

type EditMovieRequest struct {
	Id     string `json:"id"`
	Title  string `json:"title"`
	Image  string `json:"image"`
	Imdb   string `json:"imdb"`
	Rating int64  `json:"rating"`
	Count  int64  `json:"count"`
}

type UpdateRatingRequest struct {
	Id     string `json:"id"`
	Rating int64  `json:"rating"`
}

type DeleteMovieRequest struct {
	Id string `json:"id"`
}

type UserAuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type LoginResponse struct {
	Msg   string `json:"msg"`
	Email string `json:"email"`
}

type TopicMessage struct {
	MovieTitle string `json:"movieTitle"`
	Path       string `json:"path"`
	UserAgent  string `json:"userAgent"`
}

type MovieTopicMessage struct {
	MovieTitle string `json:"movieTitle"`
}

type PageviewsTopicMessage struct {
	Path      string `json:"path"`
	UserAgent string `json:"userAgent"`
}
