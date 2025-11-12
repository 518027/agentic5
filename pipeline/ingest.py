from rdflib import Graph

def load_graph(path):
    g = Graph()
    if path.endswith(".ttl"):
        g.parse(path, format="turtle")
    elif path.endswith(".jsonld"):
        g.parse(path, format="json-ld")
    else:
        g.parse(path)  # autodetect
    return g

if __name__ == "__main__":
    import sys, json
    g = load_graph(sys.argv[1])
    print("Triples:", len(g))
