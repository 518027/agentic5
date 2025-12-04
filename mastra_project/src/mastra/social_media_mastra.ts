// Generated Mastra AI Framework (TypeScript)
// Source: social_media.ttl
// System: SocialMediaManager

import { Agent, Workflow } from '@mastra/core';
import { z } from 'zod';

// --- AGENT DEFINITIONS ---

export const content_planner = new Agent({
  name: "content_planner", 
  instructions: "Execute content_planner",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});

export const post_creator = new Agent({
  name: "post_creator", 
  instructions: "Execute post_creator",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});

export const engagement_monitor = new Agent({
  name: "engagement_monitor", 
  instructions: "Execute engagement_monitor",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4",
    toolChoice: "auto",
  } as any,
});


// --- WORKFLOW DEFINITION ---
export const socialmediamanager_workflow = new Workflow({
  name: "SocialMediaManager",
  triggerSchema: z.object({
    task: z.string(),
  }),
  agents: [content_planner, post_creator, engagement_monitor],
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
    console.log("🚀 Starting Real Mastra Workflow: SocialMediaManager");
    const agentsList = [content_planner, post_creator, engagement_monitor] as any[];
    printStructure("SocialMediaManager", agentsList);
    console.log("✅ Workflow constructed successfully.");
  })();
}
