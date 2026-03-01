import networkx as nx

def build_graph(parsed_files):
    """
    Creates a Directed Graph where:
    Nodes = Files / Modules
    Edges = Relationships (A imports B)
    """
    graph = nx.DiGraph()

    for data in parsed_files:
        if not data:
            continue
            
        file_path = data["file"]
        # Add the file as a primary node
        graph.add_node(file_path)
        
        for imp in data["imports"]:
            # We add an edge from the file to the module it imports
            # This represents the 'flow' of the codebase
            graph.add_edge(file_path, imp)

    return graph

