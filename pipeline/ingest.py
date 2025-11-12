from rdflib import Graph

def load_graph(path):
    g = Graph()
    if path.endswith(".ttl"):
        g.parse(path, format="turtle")
    elif path.endswith(".jsonld") or path.endswith(".json"):
        g.parse(path, format="json-ld")
    else:
        try:
            g.parse(path)
        except Exception:
            g.parse(path, format="turtle")
    return g

if __name__ == "__main__":
    import sys
    g = load_graph(sys.argv[1])
    print("Loaded triples:", len(g))
