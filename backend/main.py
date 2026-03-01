from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import os

# Import your custom modules
from parser.file_indexer import index_files
from parser.code_parser import parse_python_file
from graph.dependency_graph import build_graph
from graph.visualize import save_graph_image
from agent.agent import start_exploration
from agent.qa import answer_question

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExploreRequest(BaseModel):
    repo_path: str
    limit: int = 10

app.mount("/static", StaticFiles(directory="static"), name="static")

import urllib.parse
import subprocess

@app.post("/explore")
async def explore_endpoint(request: ExploreRequest):
    # 1. Decode the URL encoding 
    decoded_path = urllib.parse.unquote(request.repo_path)
    
    # 2. If the user provides a URL, we clone it into a temporary 'downloads' folder
    if decoded_path.startswith("http"):
        repo_name = decoded_path.split("/")[-1].replace(".git", "")
        target_dir = os.path.join("downloads", repo_name)
        
        if not os.path.exists(target_dir):
            print(f"📡 Cloning remote repository: {decoded_path}...")
            os.makedirs("downloads", exist_ok=True)
            subprocess.run(["git", "clone", decoded_path, target_dir])
        
        final_path = target_dir
    else:
        final_path = decoded_path

    # 3. Standard Validation
    if not os.path.exists(final_path):
        raise HTTPException(status_code=404, detail=f"Path '{final_path}' not found on server.")

    print(f"Starting exploration for: {final_path}")

    # Proceed with your existing index_files(final_path)
    files = index_files(final_path)
    parsed_data = [parse_python_file(f) for f in files if f.endswith('.py')]
    
    G = build_graph(parsed_data)
    save_graph_image(G, "static/graph.png")
    start_exploration(G, parsed_data, limit=10)
    
    return {
        "status": "success", 
        "files_indexed": len(files),
        "graph_url": "http://localhost:8000/static/graph.png"
    }
@app.get("/ask")
async def ask_endpoint(q: str = Query(..., description="User's architectural question")):
    """Answers using the semantic memory built during /explore."""
    answer = answer_question(q)
    return {"answer": answer}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
