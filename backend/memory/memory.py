# The memory store is a simple dictionary: { "file_path": "detailed_summary" }
memory_store = {}

def store_summary(file_path, summary):
    """
    Saves the AI-generated summary for a specific file into memory.
    """
    memory_store[file_path] = summary
    print(f"🧠 Memory Updated: {file_path}")

def get_all_knowledge():
    """
    Retrieves everything the agent has learned so far.
    This will be used as 'Context' for Gemini when the user asks a question.
    """
    return memory_store

def clear_memory():
    """Resets the agent's knowledge (useful for switching repositories)."""
    global memory_store
    memory_store = {}
