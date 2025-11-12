// Auto-generated Mastra assistant for pattern {{ pattern.id }}
export const {{ pattern.id.split('/')[-1].replace('-', '_') }} = {
  name: "{{ pattern.title or pattern.id.split('/')[-1] }}",
  instruction: `Auto-generated assistant from KG pattern {{ pattern.id }}`,
  workflows: [
    {
      id: "workflow_{{ pattern.id.split('/')[-1] }}",
      steps: [
        {% for s in pattern.steps %}
        {
          id: "step_{{ loop.index }}",
          title: "{{ s.task.split('/')[-1] if s.task else 'step_' ~ loop.index|string }}",
          run: async (ctx) => {
            // TODO: implement step performed by {{ s.agent.split('/')[-1] if s.agent else 'unknown' }}
            // TODO: integrate tool {{ s.tool.split('/')[-1] if s.tool else 'none' }}
            return { ok: true };
          }
        }{% if not loop.last %},{% endif %}
        {% endfor %}
      ]
    }
  ]
};
