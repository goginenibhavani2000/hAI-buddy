import { useState, useEffect, useRef } from 'react';
import {Share2, MessageSquare } from 'lucide-react';
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

  const handleExplore = async () => {
  setIsAnalysing(true);
  addLog("Sending exploration request...");

  try {
    const response = await fetch(`${API_URL}/explore`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repo_path: repoUrl, // The raw URL or path from input
        limit: 10
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      addLog(`✅ Exploration successful: ${data.repo}`);
      setGraphUrl(`${data.graph_url}?t=${Date.now()}`);
      setIsComplete(true);
    } else {
      addLog(`Error: ${data.detail}`);
    }
  } catch (error) {
    addLog("Failed to reach backend.");
  } finally {
    setIsAnalysing(false);
  }
};

  const handleAsk = async () => {
    setIsAnalysing(true);
    const res = await fetch(`${API_URL}/ask?q=${encodeURIComponent(question)}`);
    const data = await res.json();
    setAnswer(data.answer);
    setIsAnalysing(false);
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
            placeholder="Enter GitHub Repository URL..." 
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

      {/* 3. RESULTS (Show once everything is analysed) */}
      {isComplete && (
        <div className="grid-layout">
          <div className="glass-panel">
            <h3><Share2 size={18} /> System Topology</h3>
            <img src={graphUrl} style={{ width: '100%', borderRadius: '8px' }} alt="Dependency Graph" />
          </div>

          <div className="glass-panel">
            <h3><MessageSquare size={18} /> Architectural Q&A</h3>
            <textarea 
              style={{ width: '100%', background: '#1e293b', color: 'white', borderRadius: '8px', padding: '10px' }}
              placeholder="Ask: 'How are tests structured?'"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={handleAsk} style={{ width: '100%', marginTop: '10px' }}>Ask Agent</button>
            <div style={{ marginTop: '20px', padding: '10px', background: '#020617', borderRadius: '8px', fontSize: '14px', textAlign: 'left' }}>
              <strong>Agent Answer:</strong>
              <p>{answer || "Ask a question about the map."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
