import os

# NOW you can do your imports
from graph.dependency_graph import build_graph
from agent.summarizer import summarize_code
from memory.memory import store_summary, get_all_knowledge

def start_exploration(graph, files_data, limit=10):
    """
    1. Ranks files by importance using the graph.
    2. Reads the actual content of the top files.
    3. Sends them to Gemini for summarization.
    4. Saves the insights to memory.
    """
    # Rank nodes by degree (how many connections they have)
    ranked_nodes = sorted(graph.degree, key=lambda x: x[1], reverse=True)
    
    # We only care about actual files in our repo, not external libraries like 'os'
    local_files = [node for node, degree in ranked_nodes if os.path.exists(node)]
    
    print(f"Agent starting exploration of top {min(limit, len(local_files))} files...")

    for file_path in local_files[:limit]:
        try:
            with open(file_path, "r", errors="ignore") as f:
                content = f.read()
            
            print(f"Analyzing: {file_path}")
            summary = summarize_code(file_path, content)
            
            # Store in our Step 7 Memory
            store_summary(file_path, summary)
            
        except Exception as e:
            print(f"Failed to read {file_path}: {e}")

    print("Exploration complete. Memory populated.")

