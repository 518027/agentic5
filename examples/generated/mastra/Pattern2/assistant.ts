// Auto-generated Mastra assistant for pattern http://example.org/Pattern2
export const Pattern2 = {
  name: "Summarization with Human in Loop",
  instruction: `Auto-generated assistant from KG pattern http://example.org/Pattern2`,
  workflows: [
    {
      id: "workflow_Pattern2",
      steps: [
        
        {
          id: "step_1",
          title: "GenerateSummary",
          run: async (ctx) => {
            // TODO: implement step performed by AgentB
            // TODO: integrate tool none
            return { ok: true };
          }
        },
        
        {
          id: "step_2",
          title: "ApproveSummary",
          run: async (ctx) => {
            // TODO: implement step performed by HumanReviewer
            // TODO: integrate tool none
            return { ok: true };
          }
        }
        
      ]
    }
  ]
};