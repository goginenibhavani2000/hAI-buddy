import { useState, useEffect, useRef } from 'react';
import { Share2, MessageSquare, Download } from 'lucide-react';
import { API_URL } from './config';
import './App.css';

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [logs, setLogs] = useState(["Waiting for repository input..."]);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [graphUrl, setGraphUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  
  const logEndRef = useRef(null);
  const scrollToBottom = () => logEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [logs]);

  const addLog = (msg) => setLogs(prev => [...prev, `> ${msg}`]);

  // --- Real-Time Streaming Exploration Logic ---
  const handleExplore = async () => {
    if (!repoUrl) return addLog("Please enter a repository path or URL.");
    
    setIsAnalysing(true);
    setIsComplete(false);
    setLogs([]); 
    addLog("Initiating exploration request...");

    try {
      const response = await fetch(`${API_URL}/explore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_path: repoUrl, limit: 10 }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              addLog(data.msg);

              if (data.done) {
                // Use the dynamic graph_url from backend with a cache-buster
                setGraphUrl(`${data.graph_url}?t=${Date.now()}`);
                setIsComplete(true);
              }
            } catch (e) {
              console.error("Error parsing log chunk", e);
            }
          }
        });
      }
    } catch (error) {
      addLog("Connection Error: Failed to reach backend.");
    } finally {
      setIsAnalysing(false);
    }
  };

  // --- Q&A Logic ---
  const handleAsk = async () => {
    if (!question) return;
    setIsAnalysing(true);
    try {
      const res = await fetch(`${API_URL}/ask?q=${encodeURIComponent(question)}`);
      const data = await res.json();
      setAnswer(data.answer);
    } catch (error) {
      addLog("Failed to reach Q&A agent.");
    } finally {
      setIsAnalysing(false);
    }
  };

  // --- Graph Download Logic ---
  const handleDownloadGraph = async () => {
    try {
      const response = await fetch(graphUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hAI-buddy-topology-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addLog("Graph downloaded successfully.");
    } catch (error) {
      addLog("Failed to download graph image.");
    }
  };

  return (
    <div className="dashboard">
      <h1 style={{ color: '#60a5fa' }}>hAI-Buddy</h1>

      {/* 1. INPUT BLOCK */}
      <div className="glass-panel">
        <div className="input-group">
          <input 
            value={repoUrl} 
            onChange={(e) => setRepoUrl(e.target.value)} 
            placeholder="Enter GitHub Repository URL or Local Path..." 
          />
          <button onClick={handleExplore} disabled={isAnalysing}>
            {isAnalysing ? "Analysing..." : "Explore"}
          </button>
        </div>

        {/* 2. REAL TIME LOGS */}
        <div className="log-window">
          {logs.map((log, i) => <div key={i}>{log}</div>)}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* 3. RESULTS (Show once analysis is complete) */}
      {isComplete && (
        <div className="grid-layout">
          {/* System Topology Panel */}
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}><Share2 size={18} /> System Topology</h3>
              <button 
                onClick={handleDownloadGraph}
                style={{ 
                  background: '#3b82f6', 
                  padding: '6px 12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '13px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} /> Download
              </button>
            </div>
            <img src={graphUrl} style={{ width: '100%', borderRadius: '8px', border: '1px solid #334155' }} alt="Dependency Graph" />
          </div>

          {/* Architectural Q&A Panel */}
          <div className="glass-panel">
            <h3><MessageSquare size={18} /> Architectural Q&A</h3>
            <textarea 
              style={{ 
                width: '100%', 
                minHeight: '100px',
                background: '#1e293b', 
                color: 'white', 
                borderRadius: '8px', 
                padding: '12px',
                border: '1px solid #334155',
                resize: 'none'
              }}
              placeholder="Example: 'How does the data flow between modules?'"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button 
              onClick={handleAsk} 
              disabled={isAnalysing}
              style={{ width: '100%', marginTop: '10px', padding: '10px' }}
            >
              {isAnalysing ? "Agent Thinking..." : "Ask Agent"}
            </button>
            
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: '#020617', 
              borderRadius: '8px', 
              fontSize: '14px', 
              textAlign: 'left',
              borderLeft: '4px solid #60a5fa'
            }}>
              <strong style={{ color: '#94a3b8' }}>Agent Answer:</strong>
              <p style={{ marginTop: '8px', lineHeight: '1.6' }}>
                {answer || "Analysis complete. Ask a question to begin."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;