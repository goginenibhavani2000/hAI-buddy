from memory.memory import get_all_knowledge
from agent.summarizer import model

def answer_question(question):
    """
    Combines stored knowledge and uses Gemini to answer 
    specific questions about the codebase with citations.
    """
    # Retrieve the summaries the agent built in Step 9
    memory = get_all_knowledge()
    
    if not memory:
        return "I haven't explored the codebase yet. Please run the exploration loop first!"

    # Format memory into a context block the LLM can understand
    context_list = []
    for path, summary in memory.items():
        # We use just the filename for cleaner context, but keep the full path if needed
        context_list.append(f"FILE: {path}\nSUMMARY: {summary}")
    
    context_text = "\n\n".join(context_list)

    prompt = f"""
    You are a Senior Software Architect. Use the provided context (summaries of files) 
    to answer the user's question about the codebase. 
    
    IMPORTANT:
    1. If the context doesn't have the answer, say you don't know based on current exploration.
    2. ALWAYS cite the specific files you are referring to.
    3. Be concise and technical.

    CONTEXT FROM EXPLORATION:
    {context_text}

    USER QUESTION:
    {question}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating answer: {e}"
    

