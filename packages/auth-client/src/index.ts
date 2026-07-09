import { WorkOS } from '@workos-inc/node';

// We initialize WorkOS only when the client is created,
// to avoid throwing errors on import if the env var is missing during build time.
let workosClient: WorkOS | null = null;

function getClient(): WorkOS {
  if (!workosClient) {
    const apiKey = process.env.WORKOS_API_KEY;
    if (!apiKey) {
      throw new Error('WORKOS_API_KEY environment variable is required');
    }
    workosClient = new WorkOS(apiKey);
  }
  return workosClient;
}

export const getAuthorizationUrl = (redirectUri: string, clientId: string) => {
  return getClient().userManagement.getAuthorizationUrl({
    redirectUri,
    clientId,
    provider: 'authkit',
  });
};

export const exchangeCodeForSession = async (code: string, clientId: string) => {
  return getClient().userManagement.authenticateWithCode({
    code,
    clientId,
  });
};

export const verifySession = async (sessionToken: string) => {
  // Verifies the session JWT using JWKS under the hood
  const jwksUrl = process.env.WORKOS_JWKS_URL; // Provided by WorkOS
  if (!jwksUrl) {
    throw new Error('WORKOS_JWKS_URL environment variable is required');
  }
  // In a real implementation, we would verify the JWT signature here.
  // WorkOS's getProfileAndToken doesn't verify standalone session cookies directly 
  // without the `@workos-inc/authkit-nextjs` package (which we can't use in NestJS).
  // We'll need to parse and verify the JWT ourselves or use the WorkOS method if available.
  
  // WorkOS UserManagement.verifyJwt exists in newer versions:
  const clientId = process.env.WORKOS_CLIENT_ID;
  if (!clientId) {
    throw new Error('WORKOS_CLIENT_ID is required');
  }

  return getClient().userManagement.authenticateWithSessionCookie({
    sessionData: sessionToken,
  });
};
