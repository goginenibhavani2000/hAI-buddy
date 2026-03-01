from git import Repo
import os
import shutil

def clone_repo(repo_url, dest="repo"):
    """
    Clones a GitHub repository. 
    If it already exists, it skips cloning to save time/bandwidth.
    """
    if os.path.exists(dest):
        print(f"Repo already exists at {dest}. Skipping clone.")
        return os.path.abspath(dest)
    
    print(f"git cloning {repo_url} into {dest}...")
    try:
        Repo.clone_from(repo_url, dest, depth=1) # depth=1 for a "shallow" fast clone
        print("Clone complete.")
        return os.path.abspath(dest)
    except Exception as e:
        print(f"Error cloning repo: {e}")
        return None