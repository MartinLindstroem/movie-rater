terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      Version = "~>5.8.0"
    }
  }
}

provider "google" {
  project = var.projectId
  region = var.region
  access_token = var.oidcToken
}

# Create cloud run instance
resource "google_cloud_run_service" "run_service" {
  name = "cloudrun-maze-backend"
  location = var.region

  template {
    spec {
      containers {
        image = "europe-north1-docker.pkg.dev/the-maze-go/the-maze-go/backend:latest"
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