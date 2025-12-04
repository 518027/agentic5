import re

def sanitize_identifier(name):
    if not name: return "unknown_node"
    clean = re.sub(r'[ \-\./:\\]', '_', str(name))
    clean = re.sub(r'[^a-zA-Z0-9_]', '', clean)
    clean = clean.lower()
    if clean and clean[0].isdigit():
        clean = "n_" + clean
    return clean

def generate_mastra_code(data):
    agent_defs = ""
    agent_names = []
    
    for el in data["elements"]:
        safe_id = sanitize_identifier(el['id'])
        agent_names.append(safe_id)
        clean_instr = el['logic'].replace("\n", " ").replace('"', "'")
        
        # PERUBAHAN: Menambahkan kata kunci 'export'
        agent_defs += f"""
export const {safe_id} = new Agent({{
  name: "{el['id']}", 
  instructions: "{clean_instr}",
  model: {{
    provider: "OPEN_AI",
    name: "{el['model']}",
    toolChoice: "auto",
  }} as any,
}});
"""

    agent_list_str = ", ".join(agent_names)
    
    sys_name = sanitize_identifier(data['system_name'])
    if not sys_name: sys_name = "agentic_system"

    # PERUBAHAN: Menambahkan 'export' pada workflow
    return f"""// Generated Mastra AI Framework (TypeScript)
// Source: {data['filename']}
// System: {data['system_name']}

import {{ Agent, Workflow }} from '@mastra/core';
import {{ z }} from 'zod';

// --- AGENT DEFINITIONS ---
{agent_defs}

// --- WORKFLOW DEFINITION ---
export const {sys_name}_workflow = new Workflow({{
  name: "{data['system_name']}",
  triggerSchema: z.object({{
    task: z.string(),
  }}),
  agents: [{agent_list_str}],
}} as any);

// --- VISUALIZATION HELPER ---
function printStructure(systemName: string, agents: any[]) {{
    console.log("\\n📊 MASTRA SYSTEM TOPOLOGY");
    console.log(`└── 📦 ${{systemName}}`);
    
    if(agents.length === 0) {{
        console.log("    └── (No Agents Found)");
        return;
    }}

    agents.forEach((agent, index) => {{
        const isLast = index === agents.length - 1;
        const branch = isLast ? "└──" : "├──";
        console.log(`    ${{branch}} 🤖 ${{agent.name}}`);
    }});
    console.log("\\n");
}}

// --- EXECUTION BLOCK (Only runs if directly executed via CLI) ---
// This check prevents auto-execution when imported by index.ts
if (require.main === module) {{
  (async () => {{
    console.log("🚀 Starting Real Mastra Workflow: {data['system_name']}");
    const agentsList = [{agent_list_str}] as any[];
    printStructure("{data['system_name']}", agentsList);
    console.log("✅ Workflow constructed successfully.");
  }})();
}}
"""

def generate_langgraph_code(data):
    node_funcs = ""
    graph_add = ""
    elements = data["elements"]
    
    id_map = {}
    for el in elements:
        base_id = sanitize_identifier(el['id'])
        if base_id.endswith("_node"):
            final_id = base_id
        else:
            final_id = base_id + "_node"
        id_map[el['id']] = final_id

    # --- Node Functions ---
    for el in elements:
        safe_id = id_map[el['id']]
        logic_comment = f"# Original Logic: {el['logic']}"
        node_funcs += f"""
def {safe_id}(state: GraphState):
    {logic_comment}
    print(f"   [ACT] Node '{el['id']}' is working...")
    return {{"messages": ["Processed by {safe_id}"]}}
"""
        graph_add += f"workflow.add_node('{safe_id}', {safe_id})\n"

    # --- Edges ---
    for i in range(len(elements) - 1):
        curr_safe = id_map[elements[i]['id']]
        next_safe = id_map[elements[i+1]['id']]
        graph_add += f"workflow.add_edge('{curr_safe}', '{next_safe}')\n"

    # --- Start Edge ---
    start_node_id = data.get("explicit_start")
    start_safe = None
    if start_node_id and start_node_id in id_map:
        start_safe = id_map[start_node_id]
    elif elements:
        start_safe = id_map[elements[0]['id']]
        
    if start_safe:
        graph_add += f"workflow.add_edge(START, '{start_safe}')\n"
    else:
        graph_add += "# No start node connected\n"

    # --- End Edge ---
    end_node_id = data.get("explicit_end")
    if end_node_id and end_node_id in id_map:
         end_safe = id_map[end_node_id]
         should_add = True
         if len(elements) > 1 and id_map[elements[-1]['id']] == end_safe and not data.get("explicit_start"):
             should_add = False
         
         if should_add:
             graph_add += f"workflow.add_edge('{end_safe}', END)\n"
    elif elements:
        last_safe = id_map[elements[-1]['id']]
        graph_add += f"workflow.add_edge('{last_safe}', END)\n"

    # --- PERBAIKAN: Hapus Save PNG, hanya Print Mermaid Code ---
    
    execution_block = f"""
if __name__ == "__main__":
    try:
        print("Build success. Generating Mermaid Graph...")
        
        # 1. Print Mermaid Code (Text) - Tetap berguna untuk debugging/copy-paste
        try:
            mermaid_code = app.get_graph().draw_mermaid()
            print("\\n--- MERMAID CODE (Copy to mermaid.live) ---")
            print(mermaid_code)
            print("-------------------------------------------\\n")
        except Exception:
            print("[Info] Mermaid code generation failed (Graph might be empty).")

        # Catatan: Image generation sekarang ditangani oleh 'visualize_batch.py'

        print("\\n--- Starting Simulation ---")
        initial_state = {{"messages": ["START_SIGNAL"]}}
        result = app.invoke(initial_state)
        print("\\n--- Final State Content ---")
        print(result)
    except Exception as e:
        print(f"Runtime Error: {{e}}")
"""

    return f"""# Generated LangGraph Framework
# Source: {data['filename']}
# System: {data['system_name']}

from langgraph.graph import StateGraph, START, END
from typing import Dict, List, Annotated
import operator

class GraphState(Dict):
    messages: Annotated[List[str], operator.add]

# --- NODE FUNCTIONS ---
{node_funcs}

# --- GRAPH CONSTRUCTION ---
workflow = StateGraph(GraphState)

{graph_add}
app = workflow.compile()
print(f"LangGraph '{data['system_name']}' compiled.")

{execution_block}
"""