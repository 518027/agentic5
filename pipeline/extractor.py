import json
from rdflib import Namespace
from rdflib.namespace import RDF
from ingest import load_graph

AG = Namespace("http://www.w3id.org/agentic-ai/onto#")
DCT = Namespace("http://purl.org/dc/terms/")
EX = Namespace("http://example.org/")

def uri_local_name(uri):
    return uri.split('/')[-1] if isinstance(uri, str) else str(uri)

def find_workflow_patterns(graph):
    q = """
    PREFIX : <http://www.w3id.org/agentic-ai/onto#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    SELECT DISTINCT ?pattern ?title ?step ?stepOrder ?agent ?task ?tool
    WHERE {
      ?pattern a :WorkflowPattern .
      OPTIONAL { ?pattern dcterms:title ?title. }
      OPTIONAL {
         ?pattern :hasWorkflowStep ?step .
         OPTIONAL { ?step :stepOrder ?stepOrder. }
         OPTIONAL { ?step :performedBy ?agent. }
         OPTIONAL { ?step :hasAssociatedTask ?task. }
         OPTIONAL { ?agent :usesTool ?tool. }
      }
    } ORDER BY ?pattern ?stepOrder
    """
    res = graph.query(q)
    patterns = {}
    for row in res:
        pid = str(row.pattern)
        if pid not in patterns:
            patterns[pid] = {"id": pid, "title": str(row.title) if row.title else "", "steps": []}
        if row.step:
            patterns[pid]["steps"].append({
                "step": str(row.step),
                "order": int(row.stepOrder) if row.stepOrder else None,
                "agent": str(row.agent) if row.agent else None,
                "task": str(row.task) if row.task else None,
                "tool": str(row.tool) if row.tool else None
            })
    for p in patterns.values():
        p["steps"].sort(key=lambda s: (s["order"] if s["order"] is not None else 999))
    return list(patterns.values())

def extract_to_json(input_path, output_path):
    g = load_graph(input_path)
    patterns = find_workflow_patterns(g)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(patterns, f, indent=2)
    print(f"Wrote {len(patterns)} pattern(s) to {output_path}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python extractor.py <input.ttl> <out.json>")
        sys.exit(1)
    extract_to_json(sys.argv[1], sys.argv[2])
