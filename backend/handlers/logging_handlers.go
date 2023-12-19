package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/Geshdo/the-maze-go-martin/helpers"
	"github.com/Geshdo/the-maze-go-martin/internal/logging"
	"github.com/Geshdo/the-maze-go-martin/types"
)

func HandlerReadiness(w http.ResponseWriter, r *http.Request) {
	helpers.RespondWithJSON(w, 200, struct{}{})
}

func HandlerErr(w http.ResponseWriter, r *http.Request) {
	helpers.RespondWithError(w, 400, "Something went wrong")
}

func IncrementPageViews(w http.ResponseWriter, r *http.Request) {
	var data types.PageviewsTopicMessage
	err := json.NewDecoder(r.Body).Decode(&data)

	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Error decoding JSON")
		return
	}
	var buffer bytes.Buffer
	logging.PublishTopic(&buffer, "pageview-topic", types.TopicMessage{Path: data.Path, UserAgent: data.UserAgent})
}
