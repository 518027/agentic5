from rdflib import Namespace
from rdflib.namespace import RDF, RDFS
from ingest import load_graph

AG = Namespace("http://www.w3id.org/agentic-ai/onto#")

def find_workflow_patterns(g):
    q = """
    PREFIX : <http://www.w3id.org/agentic-ai/onto#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    SELECT DISTINCT ?pattern ?title ?step ?stepOrder ?agent ?task ?tool
    WHERE {
      ?pattern a :WorkflowPattern .
      OPTIONAL { ?pattern dcterms:title ?title. }
      OPTIONAL {
         ?pattern :hasWorkflowStep ?step .
         ?step :stepOrder ?stepOrder ;
               :performedBy ?agent ;
               :hasAssociatedTask ?task .
         OPTIONAL { ?agent :usesTool ?tool. }
      }
    } ORDER BY ?pattern ?stepOrder
    """
    res = g.query(q)
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
    return list(patterns.values())

if __name__ == "__main__":
    import sys, json
    g = load_graph(sys.argv[1])
    patterns = find_workflow_patterns(g)
    print(json.dumps(patterns, indent=2))
