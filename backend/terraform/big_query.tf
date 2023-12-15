resource "google_pubsub_schema" "movies_schema" {
  name = "pubsub-movies-schema"
  type = "PROTOCOL_BUFFER"
  definition = <<EOF

syntax = "proto2";

message ProtocolBuffer {
  required string title = 1;
  required string date = 2;
}
EOF
}

resource "google_pubsub_schema" "pageviews_schema" {
  name = "pubsub-pageviews-schema"
  type = "PROTOCOL_BUFFER"
    definition = <<EOF

syntax = "proto2";

message ProtocolBuffer {
  required string path = 1;
  required string userAgent = 2;
  required string date = 3;
}
EOF
}

resource "google_pubsub_topic" "movies_topic" {
  name = "movie-topic"

  depends_on = [google_pubsub_schema.movies_schema]
  schema_settings {
    schema = "projects/${var.projectID}/schemas/${google_pubsub_schema.movies_schema.name}"
    encoding = "JSON"
  }
}

resource "google_pubsub_topic" "pageviews_topic" {
  name = "pageview-topic"

  depends_on = [google_pubsub_schema.pageviews_schema]
  schema_settings {
    schema = "projects/${var.projectID}/schemas/${google_pubsub_schema.pageviews_schema.name}"
    encoding = "JSON"
  }
}

resource "google_pubsub_subscription" "movies_sub" {
  name  = "movies-subscription"
  topic = google_pubsub_topic.movies_topic.name

  bigquery_config {
    table = "${google_bigquery_table.movies.project}.${google_bigquery_table.movies.dataset_id}.${google_bigquery_table.movies.table_id}"
    use_topic_schema = true
  }

  depends_on = [google_project_iam_member.viewer, google_project_iam_member.editor]
}

resource "google_pubsub_subscription" "pageviews_sub" {
  name  = "pageviews-subscription"
  topic = google_pubsub_topic.pageviews_topic.name

  bigquery_config {
    table = "${google_bigquery_table.pageviews.project}.${google_bigquery_table.pageviews.dataset_id}.${google_bigquery_table.pageviews.table_id}"
    use_topic_schema = true
  }

  depends_on = [google_project_iam_member.viewer, google_project_iam_member.editor]
}

data "google_project" "project" {
}

resource "google_project_iam_member" "viewer" {
  project = data.google_project.project.project_id
  role   = "roles/bigquery.metadataViewer"
  member = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-pubsub.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "editor" {
  project = data.google_project.project.project_id
  role   = "roles/bigquery.dataEditor"
  member = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-pubsub.iam.gserviceaccount.com"
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
  deletion_protection = false

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
  deletion_protection = false

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