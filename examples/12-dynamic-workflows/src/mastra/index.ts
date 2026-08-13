import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';

import { greetingTool, shoutTool } from './tools/greeting-tools';
import { reverseTextTool, shoutTextTool, whisperTextTool, wordStatsTool } from './tools/text-tools';
import {
  classifyPriorityTool,
  countDownTool,
  normalReplyTool,
  urgentReplyTool,
} from './tools/support-tools';

// The only code-defined components in this project are tools. There are
// ZERO code-defined workflows — every workflow is created at runtime over
// HTTP as JSON (see workflows/ and scripts/).
export const mastra = new Mastra({
  tools: {
    // Dynamic workflow `tool` entries reference these keys via `toolId`.
    'create-greeting': greetingTool,
    shout: shoutTool,
    'word-stats': wordStatsTool,
    'shout-text': shoutTextTool,
    'whisper-text': whisperTextTool,
    'reverse-text': reverseTextTool,
    'classify-priority': classifyPriorityTool,
    'urgent-reply': urgentReplyTool,
    'normal-reply': normalReplyTool,
    'count-down': countDownTool,
  },
  storage: new LibSQLStore({
    id: 'mastra-storage',
    // Dynamic workflow definitions persist here (workflowDefinitions domain),
    // which is why they survive a server restart.
    url: 'file:./mastra.db',
  }),
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
});
