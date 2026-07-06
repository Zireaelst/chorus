# Security Policy

At Chorus, we take the security of our non-custodial federated data network and our users' data extremely seriously. We appreciate your efforts to responsibly disclose your findings, and we will make every effort to acknowledge your contributions.

## Supported Versions

Currently, Chorus is in pre-production. Security updates are applied to the main branch continuously.

| Version | Supported          |
| ------- | ------------------ |
| Main    | :white_check_mark: |
| < v1.0  | :x:                |

## Reporting a Vulnerability

If you believe you have found a security vulnerability in Chorus, please report it to us immediately through a private disclosure. 

**Do NOT open a public issue or create a public pull request.**

Please report security issues via email to **security@chorus.health** (or by using the GitHub Security Advisories "Report a vulnerability" button on this repository if enabled).

### What to Include
When reporting a vulnerability, please include as much information as possible to help us reproduce and fix the issue:
* A detailed description of the vulnerability and its potential impact.
* Steps to reproduce the issue (including any sample code, payloads, or configurations).
* The environment in which the issue was discovered (e.g., specific versions, browsers, or operating systems).

### Our Response Timeline
- We will acknowledge receipt of your vulnerability report within **48 hours**.
- We will provide an initial assessment and estimated timeline for a fix within **7 days**.
- We will notify you once the vulnerability has been patched and resolved.

## Scope and Exclusions

**In Scope:**
- Organizational identity and authentication bypasses (e.g., WorkOS integration flaws, API key leakage).
- Cryptographic proof integrity bypasses.
- API security flaws (e.g., Broken Object Level Authorization, SSRF).
- Infrastructure configuration missteps accessible from the outside.

**Out of Scope / Exclusions:**
- Social engineering (e.g., phishing, vishing) against Chorus employees or contractors.
- Physical security attacks against Chorus properties or data centers.
- Denial of Service (DoS) attacks.
- Exhaustion of API rate limits purely to incur costs (without accessing sensitive data).
- Vulnerabilities relying on an extremely unlikely user interaction or an already compromised operating system.

**Important Note on Internal Infrastructure:**
Please do not disclose or attempt to exfiltrate internal infrastructure details. If your vulnerability demonstrates remote code execution or internal access, please stop your exploitation immediately upon confirming the flaw and report it.

## Bug Bounty Program

We greatly value the security research community. However, Chorus does not currently operate a public bug bounty program that provides monetary rewards. 

As outlined in our [`SECURITY_MODEL.md`](./SECURITY_MODEL.md), a public bug bounty program is actively planned for the **post-v0.8 milestone**, once our `contracts/` and `packages/sdk` have completed their open-source transition. Until then, we welcome responsible disclosures and will publicly acknowledge researchers who help secure our platform.
