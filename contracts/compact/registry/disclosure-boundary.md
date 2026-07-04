# Registry: Disclosure Boundary

Per `BLOCKCHAIN_ARCHITECTURE.md`, this contract points to the currently active version of each core contract. It is the only contract intended to change rarely and be repointed rather than replaced.

## Disclosure Points

This contract is entirely public state. It manages no private user data or cohort information. Its mappings of contract names (e.g., `eligibility_record`) to contract addresses are fully visible to anyone querying the network.

*This file must match `BLOCKCHAIN_ARCHITECTURE.md` exactly.*
