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