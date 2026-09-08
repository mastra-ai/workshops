import { expect, test } from 'vitest';
import { mastra } from '../src/mastra/index.js';

test('registers the Returns Desk application', () => {
  expect(mastra).toBeDefined();
});
