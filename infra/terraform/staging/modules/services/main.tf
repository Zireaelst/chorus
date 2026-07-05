terraform {
  required_providers {
    railway = {
      source  = "terraform-community-providers/railway"
      version = "~> 0.3.0"
    }
    fly = {
      source  = "fly-apps/fly"
      version = "~> 0.1.0"
    }
  }
}

resource "railway_project" "staging" {
  name = "chorus-staging"
}

resource "railway_environment" "staging" {
  project_id = railway_project.staging.id
  name       = "staging"
}

resource "railway_service" "api" {
  project_id = railway_project.staging.id
  name       = "chorus-api"
}

resource "railway_service" "proof_worker" {
  project_id = railway_project.staging.id
  name       = "chorus-proof-worker"
}

resource "railway_service" "aggregator" {
  project_id = railway_project.staging.id
  name       = "chorus-aggregator"
}

resource "railway_service" "notifications" {
  project_id = railway_project.staging.id
  name       = "chorus-notifications"
}

resource "fly_app" "ai" {
  name = "chorus-ai-staging"
  org  = var.fly_org
}
