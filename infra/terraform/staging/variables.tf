variable "railway_token" {
  type        = string
  description = "Railway API Token"
  sensitive   = true
}

variable "fly_token" {
  type        = string
  description = "Fly.io API Token"
  sensitive   = true
}

variable "doppler_token" {
  type        = string
  description = "Doppler Service Token"
  sensitive   = true
}

variable "fly_org" {
  type        = string
  description = "Fly.io Organization Slug"
  default     = "chorus-protocol"
}
