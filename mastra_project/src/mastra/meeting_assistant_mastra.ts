// Generated Mastra AI Framework (TypeScript)
// Source: meeting_assistant.ttl
// System: MeetingAssistant

import { Agent, Workflow } from '@mastra/core';
import { z } from 'zod';

// --- AGENT DEFINITIONS ---

export const scheduler = new Agent({
  name: "scheduler", 
  instructions: "Execute scheduler",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});

export const note_taker = new Agent({
  name: "note_taker", 
  instructions: "Execute note_taker",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});


// --- WORKFLOW DEFINITION ---
export const meetingassistant_workflow = new Workflow({
  name: "MeetingAssistant",
  triggerSchema: z.object({
    task: z.string(),
  }),
  agents: [scheduler, note_taker],
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
    console.log("🚀 Starting Real Mastra Workflow: MeetingAssistant");
    const agentsList = [scheduler, note_taker] as any[];
    printStructure("MeetingAssistant", agentsList);
    console.log("✅ Workflow constructed successfully.");
  })();
}
