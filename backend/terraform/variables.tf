variable "projectId" {
    type = string
    description = "the id of the project"
    sensitive = true
}

variable "region" {
    default = "europe-north1"
}

# variable "oidcToken" {
#     type = string
#     description = "OIDC token to authenticate with GCP"
#     sensitive = true
# }