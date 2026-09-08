import { pathToFileURL } from 'node:url';
import { returnsService, type ReturnsService } from './domain/service.js';
import { DomainError, identitySchema, publicError, type Identity } from './domain/schemas.js';

export function runCli(args: string[], identity: Identity, service: ReturnsService = returnsService) {
  const [command, orderId, reason, idempotencyKey] = args;
  if (command === 'get' && orderId) return service.getOrder(identity, orderId);
  if (command === 'eligibility' && orderId) return service.checkEligibility(identity, orderId);
  if (command === 'return') return service.createReturn(identity, { orderId, reason, idempotencyKey });
  throw new DomainError('INVALID_INPUT', 'Usage: get ORDER | eligibility ORDER | return ORDER REASON IDEMPOTENCY_KEY');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const identity = identitySchema.parse({ tenantId: process.env.RETURNS_TENANT, userId: 'local-support' });
    console.log(JSON.stringify(runCli(process.argv.slice(2), identity)));
  } catch (error) { console.error(JSON.stringify(publicError(error))); process.exitCode = 1; }
}
