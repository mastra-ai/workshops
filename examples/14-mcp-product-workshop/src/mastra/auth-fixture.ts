import { createStaticTokenValidator, extractBearerToken } from '@mastra/mcp';
import { DomainError, type Identity } from '../domain/schemas.js';

const users = new Map<string, Identity>([
  ['workshop-north', { tenantId: 'north', userId: 'support-north' }],
  ['workshop-south', { tenantId: 'south', userId: 'support-south' }],
]);
const validate = createStaticTokenValidator([...users.keys()]);

export async function fixtureIdentity(header: string | undefined) {
  const token = extractBearerToken(header);
  const user = token ? users.get(token) : undefined;
  if (!token || !user || !(await validate?.(token, ''))?.valid) {
    throw new DomainError('UNAUTHORIZED', 'Authentication required.');
  }
  return user;
}
