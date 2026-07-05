terraform {
  required_providers {
    doppler = {
      source  = "DopplerHQ/doppler"
      version = "~> 1.3.0"
    }
  }
}

resource "doppler_project" "chorus" {
  name        = "chorus"
  description = "Chorus Protocol Secrets"
}

resource "doppler_environment" "staging" {
  project = doppler_project.chorus.name
  slug    = "stg"
  name    = "Staging"
}

resource "doppler_config" "staging_api" {
  project     = doppler_project.chorus.name
  environment = doppler_environment.staging.slug
  name        = "stg_api"
}

resource "doppler_config" "staging_ai" {
  project     = doppler_project.chorus.name
  environment = doppler_environment.staging.slug
  name        = "stg_ai"
}
