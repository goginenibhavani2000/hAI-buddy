# Inspiration
Developers spend 70% of their time trying to understand code, not writing it. When you join a new project or try to contribute to an open-source project, it’s hard to know where to start. We envisioned a platform that acts like a "GPS" for code, helping you navigate a new project instantly. Our goal was to reduce dependency on a human buddy during the onboarding process of any new repository or project and to empower developers to confidently contribute to open source without spending days just figuring out where things live or how they connect.

# What It Does
hAI-buddy is an AI assistant that reads any GitHub project for you and helps you with below features:

- **Heuristic Centrality Detection:**
Automatically identifies the "Core Logic" (the brain) by analyzing file connectivity and reference frequency.

- **Topological Dependency Mapping:**
Generates a visual directed graph of the project’s internal architecture, highlighting how modules interact.

- **Semantic Code Explanation:**
Leverages LLMs to perform Static Analysis and provide human-readable summaries of complex logic blocks.

- **Natural Language Querying:**
Ask high-level architectural questions (e.g., "Where is the authentication middleware?") and receive precise file-level pointers.

# How We Built It
We combined cutting-edge technologies to deliver a robust and user-friendly platform:

- **Frontend Development:**  
  - Built with **React**, ensuring a responsive and intuitive user interface that works seamlessly across devices.
  
- **Backend Processing:**  
  - Powered by **FastAPI**, which provides a fast, reliable framework for managing user requests, processing data, and interfacing with the AI components.
  
- **Agent Component:**  
  - Leverages a fine-tuned, ultra-fast AI model from Google’s Gemini Flash family, purpose-built for conversational interactions, to intelligently read and summarize code.
  - Optimized to deliver natural, context-aware reasoning, it explains complex codebases in simple, human-like language; making it feel less like documentation and more like a conversation with a knowledgeable teammate.
  
- **Graph Generation:**  
  - Integrated the open-source Python library NetworkX to generate an interactive “web” of file relationships, visually mapping how different parts of the codebase connect. This creates an intuitive and engaging experience that mirrors real dependency flows within the project, making complex architectures easier to explore and understand.

# Challenges We Encountered
Developing hAI-buddy.tech involved overcoming several complex challenges:
- **Context Window Management:**
  - Large-scale repositories often exceed standard LLM token limits. We implemented Context Pruning to strip noise (boilerplate, non-functional assets) and focus the model on the most important parts so it wouldn't get confused.

- **Data Sanitization:**
  - To prevent parsing failures, we built a robust pre-processing pipeline to handle non-UTF-8 characters and corrupted artifacts, ensuring Zero-Discrepancy Parsing.

- **Latency Reduction:**
  - By fetching only necessary metadata, we reduced repository mapping time for mid-sized projects to under 30 seconds.
  
- **Technical Integration:**  
  -  Combining various technologies (React, FastAPI, GeminiAPI, and NetworkX) into a cohesive system presented its own set of integration challenges.

# Accomplishments We’re Proud Of
- **Optimized and Scalable Platform:**  
  Developed a system that not only is optimized but also scales efficiently to serve a growing number of users.
  
- **User-Centric Design:**  
  Successfully created an interface that is both accessible and intuitive, ensuring that users can easily engage with the platform.
  
- **Advanced AI Capabilities:**  
  Leveraged Google’s advanced LLM models to build an intelligent agent capable of understanding and responding to complex queries in natural language. This achievement enabled a seamless, conversational experience; providing users with clear, context-aware guidance that feels intuitive and supportive.
  
- **Visual Proof of Concept:**  
   Transforms the codebase into more than just a tangled “hairball” of connections. The result is a structured, navigable visualization that makes even complex architectures feel organized and approachable.

- **High-Performance Repository Exploration:**
 Engineered metadata extraction pipeline that selectively retrieves only the most essential information, dramatically reducing processing overhead. This combination enabled fast, efficient repository analysis while maintaining high-quality, context-rich insights.

# What We Learned
This project has been an invaluable learning experience, enhancing our expertise in several key areas:

- **Graph Theory Matters:**
 We learned that "In-Degree" centrality is the best way to find a project's core utilities, while "Out-Degree" helps identify complex business logic controllers.

- **LLM Context Management:**
 We discovered that feeding an LLM a graph's structure before the code helps it answer architectural questions with much higher accuracy and fewer hallucinations.
  
- **Technical Integration:**  
  Learned how to seamlessly integrate diverse technologies into a unified platform, ensuring reliability and performance.

# What’s Next for hAI-buddy.tech
Looking forward, we are excited to expand and enhance the platform:

- **Interactive D3.js Graphs:**
 Moving from static images to a fully interactive, zoomable, and clickable node map in the browser.

- **Multi-Language Support:**
 Expanding our AST parsers beyond Python to include TypeScript, Go, and Rust.

- **Auto-Refactor Suggestions:**
 Using the dependency map to identify "circular dependencies" or "spaghetti code" and suggesting architectural improvements.

- **PR Reviews:**
 Integrating hAI-buddy into GitHub Actions to explain to reviewers how a specific PR changes the system's overall topology.

Our goal is to remove the "fear of the unknown" when opening a new project, and we remain committed to expanding hAI-buddy to support every developer's journey.

- Demo Video Link : 
- Devpost Link : 
