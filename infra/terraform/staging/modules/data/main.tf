terraform {
  required_providers {
    railway = {
      source  = "terraform-community-providers/railway"
      version = "~> 0.3.0"
    }
  }
}

variable "project_id" {
  type        = string
  description = "Railway Project ID"
}

variable "environment_id" {
  type        = string
  description = "Railway Environment ID"
}

resource "railway_plugin" "postgres" {
  project_id = var.project_id
  name       = "postgresql"
}

resource "railway_plugin" "redis" {
  project_id = var.project_id
  name       = "redis"
}
