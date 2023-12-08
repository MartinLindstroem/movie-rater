variable "projectID" {
    type = string
    description = "the id of the project"
    sensitive = true
}

variable "region" {
    default = "europe-north1"
}