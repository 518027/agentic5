# pipeline/codegen.py
import os, json
from jinja2 import Environment, FileSystemLoader, select_autoescape

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")

env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR),
    autoescape=select_autoescape()
)

def render_template(template_path, context):
    tpl = env.get_template(template_path)
    return tpl.render(context)

def gen_for_pattern(pattern, out_base):
    # mastra
    mastra_dir = os.path.join(out_base, "mastra", pattern['id'].split('/')[-1])
    langgraph_dir = os.path.join(out_base, "langgraph", pattern['id'].split('/')[-1])
    os.makedirs(mastra_dir, exist_ok=True)
    os.makedirs(langgraph_dir, exist_ok=True)

    mastra_content = render_template("mastra/assistant.j2.ts", {"pattern": pattern})
    with open(os.path.join(mastra_dir, "assistant.ts"), "w", encoding="utf-8") as f:
        f.write(mastra_content)

    langgraph_content = render_template("langgraph/graph.j2.json", {"pattern": pattern})
    with open(os.path.join(langgraph_dir, "graph.json"), "w", encoding="utf-8") as f:
        f.write(langgraph_content)

    return mastra_dir, langgraph_dir

def gen_all(patterns_json_path, out_base="examples/generated"):
    with open(patterns_json_path, "r", encoding="utf-8") as f:
        patterns = json.load(f)
    generated = []
    for p in patterns:
        md, ld = gen_for_pattern(p, out_base)
        generated.append({"pattern": p["id"], "mastra": md, "langgraph": ld})
    print(f"Generated {len(generated)} pattern(s) into {out_base}")
    return generated

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python codegen.py <patterns.json> [out_base]")
        sys.exit(1)
    gen_all(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "examples/generated")
