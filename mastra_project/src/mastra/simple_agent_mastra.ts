// Generated Mastra AI Framework (TypeScript)
// Source: simple_agent.ttl
// System: SimpleAgent

import { Agent, Workflow } from '@mastra/core';
import { z } from 'zod';

// --- AGENT DEFINITIONS ---

export const assistant = new Agent({
  name: "assistant", 
  instructions: "Execute assistant",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});


// --- WORKFLOW DEFINITION ---
export const simpleagent_workflow = new Workflow({
  name: "SimpleAgent",
  triggerSchema: z.object({
    task: z.string(),
  }),
  agents: [assistant],
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
    console.log("🚀 Starting Real Mastra Workflow: SimpleAgent");
    const agentsList = [assistant] as any[];
    printStructure("SimpleAgent", agentsList);
    console.log("✅ Workflow constructed successfully.");
  })();
}
