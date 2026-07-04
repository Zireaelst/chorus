describe('Registry Contract', () => {
  const OWNER_ADDRESS = "0xOwnerAdmin";
  let registryState: Map<string, string>;

  beforeEach(() => {
    registryState = new Map();
  });

  // Mock simulation of the Compact contract
  function simulateUpdateRoute(caller_address: string, contract_name: string, contract_address: string) {
    if (caller_address !== OWNER_ADDRESS) {
      throw new Error("Unauthorized: only owner can update routes");
    }

    registryState.set(contract_name, contract_address);
    return { success: true };
  }

  it('should allow the owner to update a contract route', () => {
    const result = simulateUpdateRoute(OWNER_ADDRESS, "eligibility_record", "0xNewEligibilityContract");
    expect(result.success).toBe(true);
    expect(registryState.get("eligibility_record")).toBe("0xNewEligibilityContract");
  });

  it('should reject a route update from a non-owner', () => {
    expect(() => {
      simulateUpdateRoute("0xRogueActor", "eligibility_record", "0xMaliciousContract");
    }).toThrow("Unauthorized: only owner can update routes");
  });
});
