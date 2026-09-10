export const oauthClientPath = '/oauth-client.json';

export function oauthClientMetadata(resource: string) {
  return {
    client_id: new URL(oauthClientPath, resource).href,
    client_name: 'Returns Desk connection check',
    redirect_uris: ['http://localhost:8090/callback'],
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none' as const,
  };
}
