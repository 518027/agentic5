// Generated Mastra AI Framework (TypeScript)
// Source: researcher_workflow.ttl
// System: ResearchWorkflow

import { Agent, Workflow } from '@mastra/core';
import { z } from 'zod';

// --- AGENT DEFINITIONS ---

export const researcher = new Agent({
  name: "researcher", 
  instructions: "Execute researcher",
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


// --- WORKFLOW DEFINITION ---
export const researchworkflow_workflow = new Workflow({
  name: "ResearchWorkflow",
  triggerSchema: z.object({
    task: z.string(),
  }),
  agents: [researcher, writer],
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
    console.log("🚀 Starting Real Mastra Workflow: ResearchWorkflow");
    const agentsList = [researcher, writer] as any[];
    printStructure("ResearchWorkflow", agentsList);
    console.log("✅ Workflow constructed successfully.");
  })();
}
