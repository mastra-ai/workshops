// The default cfworker validator crashes during import in Studio's blob: iframes.
// Use the SDK's AJV provider without changing server-side MCP behavior.
export { AjvJsonSchemaValidator as DefaultJsonSchemaValidator } from '@modelcontextprotocol/client/validators/ajv';
export const CORS_IS_POSSIBLE = true;
