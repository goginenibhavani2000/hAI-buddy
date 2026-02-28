import os

# Files and folders that provide zero value to code logic exploration
IGNORED = {
    ".git", "node_modules", "venv", "__pycache__", 
    ".pytest_cache", ".vscode", "dist", "build"
}

def index_files(root_dir, extension=".py"):
    """
    Recursively finds all source files while skipping the junk.
    """
    code_files = []
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Modification in-place to skip ignored directories
        dirnames[:] = [d for d in dirnames if d not in IGNORED]
        
        for f in filenames:
            if f.endswith(extension):
                # We store the full path so the agent can open it later
                full_path = os.path.join(dirpath, f)
                code_files.append(full_path)
                
    return code_files

