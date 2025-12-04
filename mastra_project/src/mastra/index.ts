
import { Mastra } from '@mastra/core';

// Ini adalah entry point utama untuk Cloud Build
export const mastra = new Mastra({
  name: 'agentic-converter-framework',
  agents: {}, 
  workflows: {},
});

// Logging status
console.log("✅ Mastra Cloud Instance initialized.");
console.log("   Generated workflows are located in ./src/mastra/");
