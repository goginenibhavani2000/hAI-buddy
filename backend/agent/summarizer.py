import google.generativeai as genai
import dotenv
import os

# Load environment variables from .env file
dotenv.load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# We use gemini-x.5-flash for speed and efficiency
model = genai.GenerativeModel(gemini_model=os.getenv("GEMINI_MODEL"))

def summarize_code(file_path, content):
    """
    Sends file content to Gemini and returns a 2-3 sentence summary
    of its role in the architecture.
    """
    # We truncate content to 4000 chars to save tokens and stay snappy
    snippet = content[:4000]
    
    prompt = f"""
    You are an AI Code Explorer. Analyze this file from a repository.
    File Path: {file_path}
    
    Provide a concise (2-3 sentences) summary of:
    1. The main purpose of this file.
    2. Key functions or classes it provides.
    3. Whether it's a core utility, an entry point, or a specific feature.
    
    Code:
    {snippet}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error analyzing {file_path}: {str(e)}"