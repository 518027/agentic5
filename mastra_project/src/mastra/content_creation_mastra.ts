// Generated Mastra AI Framework (TypeScript)
// Source: content_creation.ttl
// System: ContentCreationPipeline

import { Agent, Workflow } from '@mastra/core';
import { z } from 'zod';

// --- AGENT DEFINITIONS ---

export const ideator = new Agent({
  name: "ideator", 
  instructions: "Execute ideator",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});

export const writer = new Agent({
  name: "writer", 
  instructions: "Execute writer",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});

export const editor = new Agent({
  name: "editor", 
  instructions: "Execute editor",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});


// --- WORKFLOW DEFINITION ---
export const contentcreationpipeline_workflow = new Workflow({
  name: "ContentCreationPipeline",
  triggerSchema: z.object({
    task: z.string(),
  }),
  agents: [ideator, writer, editor],
} as any);

// --- VISUALIZATION HELPER ---
function printStructure(systemName: string, agents: any[]) {
    console.log("\n📊 MASTRA SYSTEM TOPOLOGY");
    console.log(`└── 📦 ${systemName}`);
    
    if(agents.length === 0) {
        console.log("    └── (No Agents Found)");
        return;
    }

    agents.forEach((agent, index) => {
        const isLast = index === agents.length - 1;
        const branch = isLast ? "└──" : "├──";
        console.log(`    ${branch} 🤖 ${agent.name}`);
    });
    console.log("\n");
}

// --- EXECUTION BLOCK (Only runs if directly executed via CLI) ---
// This check prevents auto-execution when imported by index.ts
if (require.main === module) {
  (async () => {
    console.log("🚀 Starting Real Mastra Workflow: ContentCreationPipeline");
    const agentsList = [ideator, writer, editor] as any[];
    printStructure("ContentCreationPipeline", agentsList);
    console.log("✅ Workflow constructed successfully.");
  })();
}
