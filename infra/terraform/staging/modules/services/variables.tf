variable "fly_org" {
  type        = string
  description = "Fly.io organization name"
}

variable "doppler_token" {
  type        = string
  description = "Doppler token for secrets injection"
  sensitive   = true
}
