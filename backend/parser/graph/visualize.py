import matplotlib.pyplot as plt
import networkx as nx
import os

def save_graph_image(graph, output="graph.png"):
    # 1. PRE-PROCESS: We only take nodes that have at least 2 connections
    important_nodes = [node for node, degree in graph.degree() if degree > 1]
    subgraph = graph.subgraph(important_nodes)

    plt.figure(figsize=(16, 10))
    
    # 2. LAYOUT: 'k' increases distance between nodes
    pos = nx.spring_layout(subgraph, k=0.3, iterations=50)

    # 3. DRAW NODES: Size them by how important they are
    node_sizes = [subgraph.degree(n) * 100 for n in subgraph.nodes]
    
    nx.draw_networkx_nodes(subgraph, pos, node_size=node_sizes, node_color="#61afef", alpha=0.8)
    
    # 4. DRAW EDGES: Thin and light so they don't crowd the text
    nx.draw_networkx_edges(subgraph, pos, width=0.5, edge_color="#ced4da", arrows=True, arrowsize=10)

    # 5. DRAW LABELS: Only the filename, not the full path
    labels = {node: os.path.basename(node) for node in subgraph.nodes}
    nx.draw_networkx_labels(subgraph, pos, labels=labels, font_size=8, font_family="sans-serif")

    plt.title("Codebase Core Architecture (Topological Map)", fontsize=15, pad=20)
    plt.axis('off') # Hide the axis box
    plt.savefig(output, bbox_inches='tight', dpi=300)
    plt.close()
    print(f"leaned visualization saved to {output}")