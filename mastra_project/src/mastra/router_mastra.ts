// Generated Mastra AI Framework (TypeScript)
// Source: router.ttl
// System: Router

import { Agent, Workflow } from '@mastra/core';
import { z } from 'zod';

// --- AGENT DEFINITIONS ---

export const router_node = new Agent({
  name: "router_node", 
  instructions: "Execute router_node",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});


// --- WORKFLOW DEFINITION ---
export const router_workflow = new Workflow({
  name: "Router",
  triggerSchema: z.object({
    task: z.string(),
  }),
  agents: [router_node],
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
    console.log("🚀 Starting Real Mastra Workflow: Router");
    const agentsList = [router_node] as any[];
    printStructure("Router", agentsList);
    console.log("✅ Workflow constructed successfully.");
  })();
}
