// Generated Mastra AI Framework (TypeScript)
// Source: researcher.ttl
// System: Researcher

import { Agent, Workflow } from '@mastra/core';
import { z } from 'zod';

// --- AGENT DEFINITIONS ---

export const entry20point = new Agent({
  name: "entry%20point", 
  instructions: "Execute entry%20point",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});

export const finish20point = new Agent({
  name: "finish%20point", 
  instructions: "Execute finish%20point",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});


// --- WORKFLOW DEFINITION ---
export const researcher_workflow = new Workflow({
  name: "Researcher",
  triggerSchema: z.object({
    task: z.string(),
  }),
  agents: [entry20point, finish20point],
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
    console.log("🚀 Starting Real Mastra Workflow: Researcher");
    const agentsList = [entry20point, finish20point] as any[];
    printStructure("Researcher", agentsList);
    console.log("✅ Workflow constructed successfully.");
  })();
}
