package logging

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"time"

	"cloud.google.com/go/pubsub"
	pb "github.com/Geshdo/the-maze-go-martin/internal/logging/proto"
	"github.com/Geshdo/the-maze-go-martin/types"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
)

func PublishTopic(w io.Writer, topic string, data types.TopicMessage) error {
	projectID := os.Getenv("PROJECT_ID")
	topicID := topic
	var movieTopicData proto.Message
	var pageviewsTopicData proto.Message

	ctx := context.Background()
	client, err := pubsub.NewClient(ctx, projectID)
	if err != nil {
		log.Printf("pubsub: NewClient: %v", err)
		return fmt.Errorf("pubsub: NewClient: %w", err)
	}
	defer client.Close()

	currentDate := time.Now().Unix()
	currentDateString := strconv.FormatInt(currentDate, 10)

	if topicID == "movie-topic" {
		movieTopicData = &pb.MovieMessage{
			Title: &data.MovieTitle,
			Date:  &currentDateString,
		}
		fmt.Print(movieTopicData)
	}

	if topicID == "pageview-topic" {
		pageviewsTopicData = &pb.PageviewsMessage{
			Path:      &data.Path,
			UserAgent: &data.UserAgent,
			Date:      &currentDateString,
		}
	}

	t := client.Topic(topicID)
	cfg, err := t.Config(ctx)
	if err != nil {
		log.Printf("topic.Config err: %v", err)
		return fmt.Errorf("topic.Config err: %w", err)
	}
	encoding := cfg.SchemaSettings.Encoding

	var msg []byte
	switch encoding {
	case pubsub.EncodingBinary:
		if topicID == "movie-topic" {
			msg, err = proto.Marshal(movieTopicData)
		}
		if topicID == "pageview-topic" {
			msg, err = proto.Marshal(pageviewsTopicData)
		}

		if err != nil {
			log.Printf("proto.Marshal err: %v", err)
			return fmt.Errorf("proto.Marshal err: %w", err)
		}
	case pubsub.EncodingJSON:
		if topicID == "movie-topic" {
			msg, err = protojson.Marshal(movieTopicData)
		}
		if topicID == "pageview-topic" {
			msg, err = protojson.Marshal(pageviewsTopicData)
		}
		if err != nil {
			log.Printf("protojson.Marshal err: %v", err)
			return fmt.Errorf("protojson.Marshal err: %w", err)
		}
	default:
		log.Printf("invalid encoding: %v", encoding)
		return fmt.Errorf("invalid encoding: %v", encoding)
	}

	result := t.Publish(ctx, &pubsub.Message{
		Data: msg,
	})

	_, err = result.Get(ctx)
	if err != nil {
		log.Printf("result.Get: %v", err)
		return fmt.Errorf("result.Get: %w", err)
	}
	fmt.Fprintf(w, "Published proto message with %#v encoding: %s\n", encoding, string(msg))
	// log.Printf("LOG: Published proto message with %#v encoding: %s\n", encoding, string(msg))
	return nil

}
