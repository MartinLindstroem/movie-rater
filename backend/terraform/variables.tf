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