variable "projectID" {
    type = string
    description = "the id of the project"
    sensitive = true
}

variable "region" {
    default = "europe-north1"
}

variable "github_sha" {
    type = string
    description = "github sha for image tag"
    sensitive = true
}

variable "jwt_secret" {
  type = string
  description = "jwt secret for signing tokens"
  sensitive = true
}