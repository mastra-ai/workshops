import { registerApiRoute } from '@mastra/core/server';
import { DomainError, publicError, type Identity } from '../../domain/schemas.js';
import { returnsService } from '../../domain/service.js';

// Local teaching credentials only; replace with OAuth for a public multi-user service.
export function authenticate(header: string | undefined): Identity {
  if (header === 'Bearer workshop-north') return { tenantId: 'north', userId: 'support-north' };
  if (header === 'Bearer workshop-south') return { tenantId: 'south', userId: 'support-south' };
  throw new DomainError('UNAUTHORIZED', 'Authentication required.');
}
function status(error: unknown) {
  if (!(error instanceof DomainError)) return 500;
  if (error.code === 'UNAUTHORIZED') return 401;
  if (error.code === 'FORBIDDEN') return 403;
  if (error.code === 'INVALID_INPUT') return 400;
  return 409;
}
export const returnsRoutes = [
  registerApiRoute('/returns/orders/:orderId', {
    method: 'GET',
    handler: async c => {
      try { return c.json(returnsService.getOrder(authenticate(c.req.header('authorization')), c.req.param('orderId'))); }
      catch (error) { return c.json(publicError(error), status(error)); }
    },
  }),
  registerApiRoute('/returns', {
    method: 'POST',
    handler: async c => {
      try {
        const identity = authenticate(c.req.header('authorization'));
        const body = await c.req.json().catch(() => { throw new DomainError('INVALID_INPUT', 'Expected a JSON request body.'); });
        return c.json(returnsService.createReturn(identity, body));
      } catch (error) { return c.json(publicError(error), status(error)); }
    },
  }),
];
