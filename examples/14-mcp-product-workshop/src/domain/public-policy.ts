import { policy } from './schemas.js';

let revision = 1;
export const readPublicPolicy = () => ({ ...policy, revision });
// Instructor-controlled fixture change, deliberately not exposed as an MCP tool.
export const advancePublicPolicy = () => { revision += 1; };
export const resetPublicPolicy = () => { revision = 1; };
