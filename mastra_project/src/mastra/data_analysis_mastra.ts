// Generated Mastra AI Framework (TypeScript)
// Source: data_analysis.ttl
// System: DataAnalysisTeam

import { Agent, Workflow } from '@mastra/core';
import { z } from 'zod';

// --- AGENT DEFINITIONS ---

export const analyst = new Agent({
  name: "analyst", 
  instructions: "Execute analyst",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});

export const visualizer = new Agent({
  name: "visualizer", 
  instructions: "Execute visualizer",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});


// --- WORKFLOW DEFINITION ---
export const dataanalysisteam_workflow = new Workflow({
  name: "DataAnalysisTeam",
  triggerSchema: z.object({
    task: z.string(),
  }),
  agents: [analyst, visualizer],
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
    console.log("🚀 Starting Real Mastra Workflow: DataAnalysisTeam");
    const agentsList = [analyst, visualizer] as any[];
    printStructure("DataAnalysisTeam", agentsList);
    console.log("✅ Workflow constructed successfully.");
  })();
}
