// Generated Mastra AI Framework (TypeScript)
// Source: executor.ttl
// System: Executor

import { Agent, Workflow } from '@mastra/core';
import { z } from 'zod';

// --- AGENT DEFINITIONS ---

export const executor_node = new Agent({
  name: "executor_node", 
  instructions: "Execute executor_node",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});

export const executorr_node = new Agent({
  name: "executorr_node", 
  instructions: "Execute executorr_node",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});


// --- WORKFLOW DEFINITION ---
export const executor_workflow = new Workflow({
  name: "Executor",
  triggerSchema: z.object({
    task: z.string(),
  }),
  agents: [executor_node, executorr_node],
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
    console.log("🚀 Starting Real Mastra Workflow: Executor");
    const agentsList = [executor_node, executorr_node] as any[];
    printStructure("Executor", agentsList);
    console.log("✅ Workflow constructed successfully.");
  })();
}
