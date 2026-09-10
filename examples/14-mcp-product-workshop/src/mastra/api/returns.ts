import { registerApiRoute } from '@mastra/core/server';
import { DomainError, publicError } from '../../domain/schemas.js';
import { fixtureIdentity } from '../auth-fixture.js';
import { returnsService } from '../../domain/service.js';
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
      try { return c.json(returnsService.getOrder(await fixtureIdentity(c.req.header('authorization')), c.req.param('orderId'))); }
      catch (error) { return c.json(publicError(error), status(error)); }
    },
  }),
  registerApiRoute('/returns', {
    method: 'POST',
    handler: async c => {
      try {
        const identity = await fixtureIdentity(c.req.header('authorization'));
        const body = await c.req.json().catch(() => { throw new DomainError('INVALID_INPUT', 'Expected a JSON request body.'); });
        return c.json(returnsService.createReturn(identity, body));
      } catch (error) { return c.json(publicError(error), status(error)); }
    },
  }),
];
