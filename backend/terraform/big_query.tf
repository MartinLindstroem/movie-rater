resource "google_pubsub_topic" "movies" {
  name = "movie-topic"
}

resource "google_pubsub_topic" "pageviews" {
  name = "pageview-topic"
}

resource "google_pubsub_subscription" "movies" {
  name  = "movies-subscription"
  topic = google_pubsub_topic.movies.name

  bigquery_config {
    table = "${google_bigquery_table.movies.project}.${google_bigquery_table.movies.dataset_id}.${google_bigquery_table.movies.table_id}"
  }

#   depends_on = [google_project_iam_member.viewer, google_project_iam_member.editor]
}

resource "google_pubsub_subscription" "pageviews" {
  name  = "pageviews-subscription"
  topic = google_pubsub_topic.pageviews.name

  bigquery_config {
    table = "${google_bigquery_table.pageviews.project}.${google_bigquery_table.pageviews.dataset_id}.${google_bigquery_table.pageviews.table_id}"
  }

#   depends_on = [google_project_iam_member.viewer, google_project_iam_member.editor]
}


resource "google_bigquery_dataset" "default" {
  dataset_id                  = "the_maze_go"
  friendly_name               = "maze-data"
  description                 = "Dataset for logging page views and movie actions"
  location                    = "europe-north1"
}

resource "google_bigquery_table" "movies" {
  dataset_id = google_bigquery_dataset.default.dataset_id
  table_id   = "movies"

  schema = <<EOF
[
  {
    "name": "title",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "Movie title"
  },
  {
    "name": "date",
    "type": "TIMESTAMP",
    "mode": "REQUIRED",
    "description": "Date when movie was added"
  }
]
EOF

}

resource "google_bigquery_table" "pageviews" {
  dataset_id = google_bigquery_dataset.default.dataset_id
  table_id   = "page-views"

  schema = <<EOF
[
  {
    "name": "path",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "Path of the accessed page"
  },
  {
    "name": "userAgent",
    "type": "string",
    "mode": "REQUIRED",
    "description": "Device used to access the page"
  },
  {
    "name": "date",
    "type": "TIMESTAMP",
    "mode": "REQUIRED",
    "description": "Timestamp of when the page was accessed"
  }
]
EOF

}