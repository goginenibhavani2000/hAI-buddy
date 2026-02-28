import ast

def parse_python_file(path):
    """
    Analyzes a Python file to extract function names and imports.
    This forms the basis of our dependency graph.
    """
    try:
        with open(path, "r", errors="ignore") as f:
            node = ast.parse(f.read())
        
        functions = []  
        imports = []

        for sub_node in ast.walk(node):
            # Capture defined functions (Method names)
            if isinstance(sub_node, ast.FunctionDef):
                functions.append(sub_node.name)
            
            # Capture standard imports (e.g., import os)
            elif isinstance(sub_node, ast.Import):
                for alias in sub_node.names:
                    imports.append(alias.name)
            
            # Capture 'from' imports (e.g., from math import sqrt)
            elif isinstance(sub_node, ast.ImportFrom):
                if sub_node.module:
                    imports.append(sub_node.module)

        return {
            "file": path,
            "functions": functions,
            "imports": list(set(imports)) # Unique imports only
        }
    except Exception as e:
        # If a file is corrupted or not valid Python, we skip it
        print(f"Could not parse {path}: {e}")
        return None