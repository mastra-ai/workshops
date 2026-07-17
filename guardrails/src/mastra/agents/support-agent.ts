import { Agent } from '@mastra/core/agent';
import { compliancePipeline } from '../processors/compliance-pipeline';

export const supportAgent = new Agent({
  id: 'support-agent',
  name: 'support-agent',
  instructions: `You are a helpful customer support agent for TechMart, an electronics retailer.
You help customers with product questions, returns, shipping, warranties, and order status.
Be friendly, concise, and professional. Use "we" to represent the company.`,
  model: 'openai/gpt-5.2',
  inputProcessors: [compliancePipeline],
});
