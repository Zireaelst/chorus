# Infrastructure Runbooks

## Overview
This runbook details the codified topology of the staging environment and the explicitly manual provisioning process for production.

As of Sprint 19 (v1.5+ phase), the `staging` environment's core provider infrastructure is managed via Terraform under `infra/terraform/staging/`.

## Staging Environment (Terraform Managed)
The staging environment provisions:
- **Services**: `api`, `proof-worker`, `aggregator`, `notifications` (via Railway), and `ai` (via Fly.io).
- **Data Stores**: Managed PostgreSQL and Redis plugins (via Railway).
- **Secrets Management**: Doppler project and staging environment scopes.

### Staging Process
Any change to the staging provider infrastructure must be proposed in a PR modifying `infra/terraform/staging/`. 
The CI pipeline `.github/workflows/terraform-plan.yml` will run `terraform plan` and attach the output to the PR. **CI will NEVER apply Terraform.** A designated engineer must run `terraform apply` locally following the guidelines in the [staging README](../../../infra/terraform/staging/README.md).

## Production Environment (Manual / Non-Codified)
> [!WARNING]
> **Production infrastructure remains strictly manual and out-of-scope for Terraform at this time.**

We do not use Terraform to manage production environments due to the inherent drift and destruction risks of importing live critical infrastructure. Production deployments of new data stores or base services are manually provisioned through the provider dashboards (Railway, Fly.io, Doppler).

Production code releases (the continuous deployment of `apps/*`) are handled via Vercel and Railway/Fly.io continuous deployment hooks—these application deployments are decoupled from the infrastructure-as-code scaffolding managed in this repository.

### Manual Production Provisioning Steps
1. Navigate to the target provider (e.g. Railway Dashboard).
2. Manually scaffold the service instance or managed plugin.
3. Propagate the corresponding connection secrets into the `prd` Doppler environment.
4. Manually verify connectivity from the dependent services.
