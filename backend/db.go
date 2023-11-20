package main

import (
	"context"
	"log"
	"os"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/google/uuid"
	"google.golang.org/api/iterator"
)

func createFirestoreClient() *firestore.Client {
	ctx := context.Background()
	// Sets your Google Cloud Platform project ID.
	projectID := os.Getenv("PROJECT_ID")

	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
			log.Fatalf("Failed to create client: %v", err)
	}

	return client
}

func addMovie(data AddMovieRequest) error {
	ctx := context.Background()
	
	client := createFirestoreClient()
	defer client.Close()
	
	id := uuid.New().String()
	timestamp := time.Now()

	_, _, err := client.Collection("movies").Add(ctx, map[string]interface{}{
		"id":    	id,
		"title":    data.Title,
		"image":    data.Image,
		"imdb":    	data.Imdb,
		"rating":   data.Rating,
		"created":  timestamp,
		"count": 	1,
	})
	if err != nil {
			// Handle any errors in an appropriate way, such as returning them.
			log.Printf("An error has occurred: %s", err)
	}

	return err
}

func editMovie(data EditMovieRequest) error {
	ctx := context.Background()
	
	client := createFirestoreClient()
	defer client.Close()

	iter := client.Collection("movies").Where("id", "==", data.Id).Documents(ctx)
	for {
			doc, err := iter.Next()
			if err == iterator.Done {
					break
			}
			if err != nil {
					return err
			}
			_, err = doc.Ref.Update(ctx, []firestore.Update{
				{
					Path: "title",
					Value: data.Title,
				},
				{
					Path: "image",
					Value: data.Image,
				},
				{
					Path: "imdb",
					Value: data.Imdb,
				},
				{
					Path: "rating",
					Value: data.Rating,
				},
				{
					Path: "count",
					Value: data.Count,
				},
			})
			if err != nil {
				return err
			}
	}
	return nil
}

func deleteMovie(movieId string) error {
	ctx := context.Background()
	
	client := createFirestoreClient()
	defer client.Close()

	iter := client.Collection("movies").Where("id", "==", movieId).Documents(ctx)
	for {
			doc, err := iter.Next()
			if err == iterator.Done {
					break
			}
			if err != nil {
					return err
			}
			_, err = doc.Ref.Delete(ctx)
			if err != nil {
				return err
			}
	}
	return nil
}

func getAllMovies() []map[string]interface{} {
	var res []map[string]interface{}
	ctx := context.Background()

	client := createFirestoreClient()
	defer client.Close()

	iter := client.Collection("movies").Documents(ctx)
	for {
			doc, err := iter.Next()
			if err == iterator.Done {
					break
			}
			if err != nil {
					log.Fatalf("Failed to iterate: %v", err)
			}
			res = append(res, doc.Data())
	}
	
	// calculate the average rating
	for _, movie := range res {
		rating := movie["rating"].(int64)
		count := movie["count"].(int64)
		avgRating := rating / count
		movie["avg_rating"] = avgRating		
	}
	return res
}