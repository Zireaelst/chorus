terraform {
  backend "remote" {
    organization = "chorus-protocol"
    workspaces {
      name = "staging-infra"
    }
  }
  required_providers {
    railway = {
      source  = "terraform-community-providers/railway"
      version = "~> 0.3.0"
    }
    fly = {
      source  = "fly-apps/fly"
      version = "~> 0.1.0"
    }
    doppler = {
      source  = "DopplerHQ/doppler"
      version = "~> 1.3.0"
    }
  }
}

provider "railway" {
  token = var.railway_token
}

provider "fly" {
  fly_api_token = var.fly_token
}

provider "doppler" {
  doppler_token = var.doppler_token
}

module "services" {
  source        = "./modules/services"
  fly_org       = var.fly_org
  doppler_token = var.doppler_token
}

module "data" {
  source         = "./modules/data"
  project_id     = module.services.railway_project_id
  environment_id = module.services.railway_environment_id
}

module "secrets" {
  source = "./modules/secrets"
}
