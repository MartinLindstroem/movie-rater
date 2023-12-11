terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~>5.8.0"
    }
  }

  backend "gcs" {
    bucket = "the-maze-terraform-state-bucket"
    prefix = "frontend"
  }
}

provider "google" {
  project = var.projectID
  region = var.region
}

# Create frontend cloud run instance
resource "google_cloud_run_service" "run_service" {
  name = "cloudrun-maze-frontend"
  location = var.region

  template {
    spec {
      containers {
        image = "europe-north1-docker.pkg.dev/the-maze-go/the-maze-go/frontend:latest"
        env {
          name = PROJECT_ID
          value = var.projectID
        }
        env {
          name = "ENVIRONMENT"
          value = "prod"
        }
      }
    }
  }

  traffic {
    percent = 100
    latest_revision = true
  }
}

# Allow unauthenticated users to invoke the service
resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.run_service.name
  location = google_cloud_run_service.run_service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}