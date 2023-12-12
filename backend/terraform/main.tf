terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~>5.8.0"
    }
  }

  backend "gcs" {
    bucket = "the-maze-terraform-state-bucket"
    prefix = "backend"
  }
}

provider "google" {
  project = var.projectID
  region = var.region
}

# # Create backend cloud run instance
# resource "google_cloud_run_service" "run_service" {
#   name = "cloudrun-maze-backend"
#   location = var.region

#   template {
#     spec {
#       containers {
#         image = "europe-north1-docker.pkg.dev/the-maze-go/the-maze-go/backend:${var.github_sha}"
#         env {
#           name = "PROJECT_ID"
#           value = var.projectID
#         }
#       }
#     }
#   }

#   traffic {
#     percent = 100
#     latest_revision = true
#   }
# }

# # Allow unauthenticated users to invoke the service
# resource "google_cloud_run_service_iam_member" "run_all_users" {
#   service  = google_cloud_run_service.run_service.name
#   location = google_cloud_run_service.run_service.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }

# resource "google_bigquery_dataset" "default" {
#   dataset_id                  = "the-maze-go"
#   friendly_name               = "maze-data"
#   description                 = "Dataset for logging page views and movie actions"
#   location                    = "europe-north1"
# }

# resource "google_bigquery_table" "default" {
#   dataset_id = google_bigquery_dataset.default.dataset_id
#   table_id   = "movies"

#   schema = <<EOF
# [
#   {
#     "name": "title",
#     "type": "STRING",
#     "mode": "REQUIRED",
#     "description": "Movie title"
#   },
#   {
#     "name": "date",
#     "type": "TIMESTAMP",
#     "mode": "REQUIRED",
#     "description": "Date when movie was added"
#   }
# ]
# EOF

# }

# resource "google_bigquery_table" "default" {
#   dataset_id = google_bigquery_dataset.default.dataset_id
#   table_id   = "page-view"

#   schema = <<EOF
# [
#   {
#     "name": "path",
#     "type": "STRING",
#     "mode": "REQUIRED",
#     "description": "Path of the accessed page"
#   },
#   {
#     "name": "userAgent",
#     "type": "string",
#     "mode": "REQUIRED",
#     "description": "Device used to access the page"
#   },
#   {
#     "name": "date",
#     "type": "TIMESTAMP",
#     "mode": "REQUIRED",
#     "description": "Timestamp of when the page was accessed"
#   }
# ]
# EOF

# }