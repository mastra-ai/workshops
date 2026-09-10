import type { RequestContext } from '@mastra/core/request-context';
import { DomainError, identitySchema } from './schemas.js';

export function identityFromContext(context: RequestContext | undefined) {
  const auth = context?.get('authInfo');
  const user = typeof auth === 'object' && auth !== null && 'extra' in auth && typeof auth.extra === 'object' && auth.extra !== null && 'user' in auth.extra ? auth.extra.user : undefined;
  const parsed = identitySchema.safeParse(context?.get('mastra__user') ?? user ?? context?.get('identity'));
  if (!parsed.success) throw new DomainError('UNAUTHORIZED', 'Authentication required.');
  return parsed.data;
}
