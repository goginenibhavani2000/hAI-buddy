import { useState, useEffect, useRef } from 'react';
import {Share2, MessageSquare } from 'lucide-react';
import './App.css';
import { API_URL } from './config';

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
      addLog(`Exploration successful: ${data.repo}`);
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

  // Helper to format answer as points and highlight file/folder names
  const formatAnswer = (text) => {
    if (!text) return "";
    // Split into points by numbered/bulleted lists, newlines, or sentences
    const points = text.split(/\n|(?<=\.)\s+(?=[A-Z0-9])|(?<=\])\s+/).filter(Boolean);
    return (
      <ul style={{ paddingLeft: '18px', margin: 0 }}>
        {points.map((pt, idx) => {
          // Highlight any file/folder/path/code
          const highlighted = pt.replace(/([\w\-/]+\.(py|js|ts|md|json|txt|csv|yml|yaml|sh|ipynb))|([\w\-/]+\/)|(`[^`]+`)/g, match => {
            return `<span style=\"color:#2563eb;font-weight:500\">${match}</span>`;
          });
          return <li key={idx} dangerouslySetInnerHTML={{ __html: highlighted }} />;
        })}
      </ul>
    );
  };

  return (
    <div className="dashboard" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', minHeight: '100vh', boxSizing: 'border-box' }}>
      <h1 style={{ color: '#60a5fa', textAlign: 'center', marginTop: '32px' }}>hAI-Buddy</h1>

      {/* 1. INPUT BLOCK */}
      {!isComplete ? (
        <div className="glass-panel" style={{ width: '100%', marginBottom: '24px' }}>
          <div className="input-group">
            <input 
              value={repoUrl} 
              onChange={(e) => setRepoUrl(e.target.value)} 
              placeholder="Enter GitHub Repository URL..." 
            />
            <button onClick={handleExplore} disabled={isAnalysing}>
              {isAnalysing ? (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 50 50" style={{ marginRight: 6 }}>
                    <circle cx="25" cy="25" r="20" fill="none" stroke="#60a5fa" strokeWidth="5" strokeDasharray="31.4 31.4" strokeDashoffset="0">
                      <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                  Analysing...
                </span>
              ) : "Explore"}
            </button>
          </div>
          {/* 2. REAL TIME LOGS */}
          <div className="log-window">
            {logs.map((log, i) => <div key={i}>{log}</div>)}
            <div ref={logEndRef} />
          </div>
        </div>
      ) : (
        <div className="results-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '18px', alignItems: 'stretch', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
            <div className="glass-panel" style={{ marginBottom: 0 }}>
              <div className="input-group">
                <input 
                  value={repoUrl} 
                  onChange={(e) => setRepoUrl(e.target.value)} 
                  placeholder="Enter GitHub Repository URL..." 
                  disabled
                />
                <button disabled>{isAnalysing ? "Analysing..." : "Explore"}</button>
              </div>
              <div className="log-window">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
                <div ref={logEndRef} />
              </div>
            </div>
            <div className="glass-panel" style={{ flex: 1 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span><Share2 size={18} /> System Topology</span>
                {graphUrl && (
                  <a
                    href={graphUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-block' }}
                    title="Download Graph"
                  >
                    <svg width="22" height="22" fill="#60a5fa" viewBox="0 0 24 24">
                      <path d="M12 16v-8m0 8l-4-4m4 4l4-4M4 20h16" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </h3>
              <img src={graphUrl} style={{ width: '100%', borderRadius: '8px' }} alt="Dependency Graph" />
            </div>
          </div>
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
            <h3 style={{ color: 'black' }}><MessageSquare size={18} /> Architectural Q&A</h3>
            <textarea 
              style={{ flex: 1, width: '100%', background: '#FFEFF1', color: 'black', borderRadius: '8px', padding: '10px', resize: 'vertical', minHeight: '120px', border: '1px solid #e5e7eb' }}
              placeholder="Ask: 'How are tests structured?'"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={handleAsk} style={{ width: '100%', marginTop: '10px', background: '#60a5fa', color: 'white', borderRadius: '8px', border: 'none', padding: '10px' }}>Ask Agent</button>
            <div style={{ marginTop: '20px', padding: '10px', background: '#FFEFF1', borderRadius: '8px', fontSize: '14px', textAlign: 'left', flex: 1, color: '#1e293b' }}>
              <strong>Agent Answer:</strong>
              {formatAnswer(answer)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
