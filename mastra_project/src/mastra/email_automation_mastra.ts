// Generated Mastra AI Framework (TypeScript)
// Source: email_automation.ttl
// System: EmailAutomation

import { Agent, Workflow } from '@mastra/core';
import { z } from 'zod';

// --- AGENT DEFINITIONS ---

export const email_classifier = new Agent({
  name: "email_classifier", 
  instructions: "Execute email_classifier",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});

export const responder = new Agent({
  name: "responder", 
  instructions: "Execute responder",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});


// --- WORKFLOW DEFINITION ---
export const emailautomation_workflow = new Workflow({
  name: "EmailAutomation",
  triggerSchema: z.object({
    task: z.string(),
  }),
  agents: [email_classifier, responder],
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
    console.log("🚀 Starting Real Mastra Workflow: EmailAutomation");
    const agentsList = [email_classifier, responder] as any[];
    printStructure("EmailAutomation", agentsList);
    console.log("✅ Workflow constructed successfully.");
  })();
}
