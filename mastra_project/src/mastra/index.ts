
import { Mastra } from '@mastra/core';

// Ini adalah entry point utama untuk Cloud Build
export const mastra = new Mastra({
  name: 'agentic-converter-framework',
  agents: {}, 
  workflows: {},
});

console.log("✅ Mastra Cloud Instance initialized.");
