# Chorus Protocol — Staging Infrastructure

This directory contains the Terraform configuration for the `staging` environment. It manages Railway and Fly.io services, managed data instances (Postgres, Redis), and Doppler secret project boundaries.

## Remote State
Terraform state is stored remotely on Terraform Cloud in the `chorus-protocol` organization under the `staging-infra` workspace.

## Running Terraform Locally

**CRITICAL:** `terraform apply` is strictly a human-triggered action. There is no automated `apply` in the CI pipeline. CI will only ever run `terraform plan`.

### Prerequisites
To run Terraform locally, you must provide valid provider tokens:
- `TF_VAR_railway_token`
- `TF_VAR_fly_token`
- `TF_VAR_doppler_token`
Additionally, you need to be authenticated with Terraform Cloud (`terraform login`).

### Commands

1. **Initialize the workspace:**
   ```bash
   terraform init
   ```

2. **Validate configuration:**
   ```bash
   terraform validate
   terraform fmt -check
   ```

3. **Plan changes (Zero-drift check against live staging):**
   ```bash
   terraform plan
   ```

4. **Apply changes (Human Action Only):**
   ```bash
   terraform apply
   ```
   > You must review the plan output carefully before confirming the apply step.
