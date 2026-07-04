# Chorus — Product specification

This document is the constitution of the product. Every feature decision, every roadmap trade-off, and every "should we build this" conversation should be traceable back to something written here. If a proposed feature doesn't serve a persona or principle in this document, that's a reason to question the feature, not a reason to add a new principle after the fact.

## Mission

Let institutions prove things about their data to each other — eligibility, quality, compliance — without ever showing each other the data itself, and pay them automatically and transparently for doing it.

## Vision

In three years, a hospital joining Chorus should feel less like signing up for a new vendor and more like plugging into infrastructure that was obviously always going to exist — the way joining Stripe as a merchant in 2012 felt inevitable in retrospect. In ten years, we want a majority of rare-disease and precision-medicine models with genuine multi-institutional provenance to have been trained, at some point in their lineage, through Chorus's proof pipeline.

## Problem statement

Rare disease diagnosis takes five to seven years on average. The limiting factor is not the absence of relevant clinical cases — it's that those cases are distributed across institutions that cannot legally or practically pool them. Federated learning addresses the legal constraint but not the trust constraint: no participant can prove another trained honestly, no participant is compensated for the risk of contributing high-value data, and gradient sharing itself leaks more than most institutions realize. The EU's Health Data Space, in force since March 2026, opens a regulatory path for secondary use of health data in algorithm development — but no product exists today that lets an institution use that path with cryptographic, rather than contractual, guarantees.

## Target users

1. **Hospitals and biobanks** — institutions that hold patient data and want to contribute to multi-institutional models without giving up custody of that data.
2. **Research sponsors and CROs** — organizations running clinical trials that need to find eligible patient cohorts across institutions faster and more cheaply than manual outreach allows.
3. **Regulators and auditors** — bodies that need to verify compliance (HIPAA, GDPR, EHDS) without needing access to the underlying patient data to do it.
4. **AI teams and model licensees** (from v1.5) — organizations that want to license a model whose training provenance is independently verifiable, for use in regulatory submissions or internal validation.

## User personas

**Dr. Amara Osei — hospital compliance officer**
Runs data governance for a 600-bed academic medical center. Wants to say yes to research collaborations more often, but every federated learning pitch she's evaluated in the past two years has failed her institution's risk review because no vendor could show her, technically rather than contractually, what would happen if a peer institution acted in bad faith. She is Chorus's most important early adopter: if the compliance officer doesn't trust the disclosure model, nothing else in the sales cycle matters.

**Raj Patel — hospital IT/technical administrator**
Reports to Dr. Osei and will actually deploy and operate Chorus Node inside the hospital's infrastructure. Cares about deployment friction, about whether Chorus Node can run inside an existing VPC without new firewall exceptions, and about who he calls at 2am if a verification job stalls. If onboarding takes more than an afternoon, he escalates back to compliance with a recommendation to wait.

**Elena Vasquez — CRO clinical operations lead**
Spends a meaningful fraction of a trial's budget on patient recruitment, and the rarer the indication, the worse that math gets. She doesn't care about zero-knowledge proofs as a concept — she cares that a cohort search returns a real, verifiable number of eligible patients instead of an estimate she can't act on, and that requesting access doesn't require a six-month legal negotiation with each hospital.

**Marcus Lindqvist — national health data regulator**
Needs to verify that a cross-border, multi-institutional AI training effort complied with EHDS secondary-use provisions, without needing standing access to any patient's record to do it. He is not a customer in the commercial sense, but a regulator who is satisfied by Chorus's disclosure model becomes a reference other institutions' compliance officers will ask for by name.

## Existing alternatives

- **In-house federated learning consortiums** — technically capable but institutionally fragile; trust is rebuilt from scratch for every new consortium and rarely survives a change in leadership at any one member institution.
- **Federated learning platforms (Owkin, Rhino Health, NVIDIA FLARE)** — solve the orchestration and infrastructure problem well, but none combine cryptographic verification of honest local training with a native, transparent payment rail; contribution incentives are handled contractually, off-platform.
- **Traditional CRO-led patient recruitment** — effective but slow and expensive, and structurally incapable of the kind of cross-border, privacy-preserving cohort search Chorus enables.
- **General-purpose confidential computing (TEEs)** — technically capable of hiding data during computation, but the trust model still depends on hardware vendor attestation rather than cryptographic proof, and TEEs offer no native settlement or disclosure primitive.

## Pain points

- Compliance officers cannot get a risk review approved without a technical, not contractual, answer to "what if a peer institution lies."
- IT administrators are asked to deploy federated learning tooling that either wants unrestricted network access or offers no clear operational boundary.
- Institutions that do contribute high-value data to a consortium are rarely compensated in proportion to the value of what they contributed, which quietly discourages future participation.
- Sponsors sourcing rare-disease cohorts get size estimates, not actionable, verifiable matches, and still negotiate access hospital-by-hospital.
- Regulators reviewing cross-border health AI training have no standard way to audit compliance without requesting access to underlying data.

## Value proposition

For hospitals: contribute to research and get paid for it, with a technical guarantee — not a promise — that patient data never leaves your infrastructure. For sponsors: search and access real, verified cohorts in days, not the months a manual recruitment process takes. For regulators: get exactly the audit evidence a query requires, and nothing else, on demand rather than by request.

## Product principles

1. **Privacy is the default, not a configuration option.** Nothing about using Chorus correctly requires an institution to opt into privacy — the architecture makes the unsafe path unavailable.
2. **Disclosure is explicit, scoped, and reviewable.** Every point at which data or a derived fact becomes visible to another party is a named, auditable event, never an implicit side effect.
3. **Raw data never transits our infrastructure.** If a design requires patient data to touch a Chorus-operated server, even briefly, that design is wrong and gets redone.
4. **Compensation is automatic and proportional.** An institution that contributes should never have to invoice, negotiate, or chase payment for a verified contribution.
5. **Regulation is a design input, not an afterthought.** HIPAA, GDPR, and EHDS requirements are modeled into the architecture before a feature ships, not retrofitted after a compliance review flags a gap.
6. **AI assists; it does not decide.** Anywhere AI touches a workflow involving patient eligibility, compliance, or payment, a human is the accountable decision-maker of record.

## Success metrics

| Category | Metric | Why it matters |
|---|---|---|
| Activation | Time from signed agreement to first verified proof from a new hospital | The real measure of onboarding friction, more honest than signup counts |
| Engagement | Verified proofs processed per active institution per month | Distinguishes institutions that signed up from institutions that actually contribute |
| Trust | Percentage of submitted proofs that pass verification on first attempt | A proxy for whether Chorus Node is genuinely easy to operate correctly |
| Retention | Institutions still actively contributing 6 months after their first verified proof | Federated learning platforms typically lose participants after an initial pilot; this is the metric that would prove Chorus doesn't |
| Revenue | Contribution-linked payout volume settled on-chain | The clearest signal that the incentive loop is real, not theoretical |
| Regulatory | Number of institutions whose compliance team approves Chorus without an escalated legal review | A leading indicator for sales cycle length |

## Business model

Three revenue lines, each tied to a different persona: a subscription fee for hospitals and biobanks covering platform access and Chorus Node support; a per-transaction fee charged to sponsors and CROs for cohort discovery and matched access; and, from v1.5, a usage-based royalty on licensed models trained through Chorus, split automatically among contributing institutions in proportion to their verified contribution. The royalty line is the one most likely to compound — it turns every previously trained model into a recurring revenue source rather than a one-time engagement.

## Competitive advantages

- **A dual moat.** The cryptographic verification approach (adapted from academic ZK-federated-learning work) can in principle be copied; the hospital compliance approvals, BAAs, and regulator relationships that make it deployable in a real hospital cannot be copied on the same timeline.
- **Genuine two-sided network effects.** Every new hospital increases the value of the cohort search product for sponsors, and every new sponsor increases the payout opportunity for hospitals — this is not true of single-institution AI tooling.
- **A Midnight-specific technical moat.** Reproducing Chorus's guarantees on another chain would require stitching together a privacy layer, a separate off-chain federated learning system, and a separate payment rail from three different vendors — which breaks exactly the unified trust model that makes Chorus's disclosure story credible in the first place.

## Long-term vision

By v2.0, Chorus is not a single-vertical product but a general-purpose confidential collaboration network for healthcare AI, spanning multiple disease verticals, operating under a compliance engine that can express country-specific disclosure rules without forking the underlying contract code, and growing through pull from institutions who've seen the network's value rather than through outbound sales effort.

## Out of scope

Chorus does not build, and has no roadmap to build: a general-purpose electronic health record system, a patient-facing wallet or consumer health app, an insurance claims product, a health data marketplace that sells access to raw or aggregated patient data, or a general-purpose (non-healthcare) federated learning platform. Each of these was considered and explicitly rejected during ideation because it either duplicates a well-served existing market or conflicts with the trust model Chorus depends on (see the venture-scale idea screen in the accompanying strategy documentation for the full reasoning). Genomic data collaboration is on the long-term roadmap but explicitly out of scope for the MVP, because EHDS's genomic-specific secondary-use safeguards phase in on a slower regulatory timeline than the rest of the product.

## Future expansion

- **Genomic research vertical** (targeted for alignment with EHDS's genomic data timeline, not before).
- **Multi-jurisdiction compliance engine** — expressing country-specific disclosure rules as contract configuration rather than contract forks.
- **AI model marketplace** — licensing of Chorus-certified models with automatic, verifiable royalty distribution to contributing institutions.
- **Companion mobile app** for clinicians — notification and lightweight approval flows only, never a primary data-entry surface.
