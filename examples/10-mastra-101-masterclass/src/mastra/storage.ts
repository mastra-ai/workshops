import { LibSQLStore, LibSQLVector } from '@mastra/libsql';

export const storage = new LibSQLStore({
  id: 'mastra-101-storage',
  url: 'file:./mastra-101.db',
});

export const vector = new LibSQLVector({
  id: 'mastra-101-vector',
  url: 'file:./mastra-101.db',
});
