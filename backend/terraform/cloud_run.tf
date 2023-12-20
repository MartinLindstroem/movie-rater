
# Create backend cloud run instance
resource "google_cloud_run_service" "run_service" {
    name = "cloudrun-maze-backend"
    location = var.region

    template {
        spec {
            containers {
                image = "europe-north1-docker.pkg.dev/the-maze-go/the-maze-go/backend:${var.github_sha}"
                env {
                    name = "PROJECT_ID"
                    value = var.projectID
                }
                env {
                    name = "JWT_SECRET"
                    value = var.jwt_secret
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
