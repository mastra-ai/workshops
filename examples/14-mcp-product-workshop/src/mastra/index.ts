import { Mastra } from '@mastra/core/mastra';
import { returnsRoutes } from './api/returns.js';

export const mastra = new Mastra({ server: { port: Number(process.env.PORT ?? 4111), apiRoutes: returnsRoutes } });
