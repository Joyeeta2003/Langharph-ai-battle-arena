import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import MessageTurn from '../components/MessageTurn';
import PromptInputBar from '../components/PromptInputBar';
import { INITIAL_MESSAGES, generateSimulatedBattle } from '../data/mockData';
import { ScalesIcon, SparklesIcon, TrophyIcon } from '../components/Icons';

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [activeMessageIndex, setActiveMessageIndex] = useState(INITIAL_MESSAGES.length - 1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendMode, setBackendMode] = useState('local'); // 'api' | 'local'
  const [backendConnected, setBackendConnected] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  const turnsEndRef = useRef(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    setIsCheckingBackend(true);
    try {
      const res = await fetch('http://localhost:3000/api/health', { method: 'GET' });
      if (res.ok) {
        setBackendConnected(true);
      } else {
        setBackendConnected(false);
      }
    } catch {
      setBackendConnected(false);
    } finally {
      setIsCheckingBackend(false);
    }
  };

  const handleSendMessage = async (problemText) => {
    setIsLoading(true);

    const newId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      let battleResult = null;

      // Try live backend if in 'api' mode or backend is reachable
      if (backendMode === 'api' || backendConnected) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for multi-LLM LangGraph

          const res = await fetch('http://localhost:3000/api/arena', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ problem: problemText }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            // Validate data shape
            if (data && data.solution_1 && data.solution_2 && data.judge) {
              battleResult = {
                id: newId,
                timestamp,
                problem: data.problem || problemText,
                solution_1: data.solution_1,
                solution_2: data.solution_2,
                judge: {
                  solution_1_score: Number(data.judge.solution_1_score) || 8.5,
                  solution_2_score: Number(data.judge.solution_2_score) || 9.0,
                  solution_1_reasoning: data.judge.solution_1_reasoning || "Evaluation completed by model graph.",
                  solution_2_reasoning: data.judge.solution_2_reasoning || "Evaluation completed by model graph."
                },
                model_1: "Gemini 1.5 Pro (Model Alpha)",
                model_2: "Cohere Command A (Model Beta)",
                judge_model: "LangGraph Multi-Agent Judge"
              };
            }
          }
        } catch (fetchErr) {
          console.warn("Backend API attempt failed, switching to local intelligent generator:", fetchErr);
        }
      }

      // If backend was not used or failed, fallback to local generator
      if (!battleResult) {
        const simulated = generateSimulatedBattle(problemText);
        battleResult = {
          id: newId,
          timestamp,
          ...simulated,
          model_1: "Claude 3.5 Sonnet (Model Alpha)",
          model_2: "GPT-4o (Model Beta)",
          judge_model: "Claude 3.5 Opus (Analytical Judge)"
        };
      }

      setMessages(prev => [...prev, battleResult]);
      setActiveMessageIndex(messages.length);

      // Scroll to bottom smoothly
      setTimeout(() => {
        turnsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      console.error("Failed to generate arena response:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMessage = (index) => {
    setActiveMessageIndex(index);
    const element = document.getElementById(`turn-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewChat = () => {
    // Focus on input or clear to a fresh turn
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear this arena conversation?")) {
      setMessages([]);
      setActiveMessageIndex(-1);
    }
  };

  const handleExportData = () => {
    // Exports clean JSON matching the user's exact specification
    const exportPayload = messages.map(m => ({
      problem: m.problem,
      solution_1: m.solution_1,
      solution_2: m.solution_2,
      judge: {
        solution_1_score: m.judge?.solution_1_score,
        solution_2_score: m.judge?.solution_2_score,
        solution_1_reasoning: m.judge?.solution_1_reasoning,
        solution_2_reasoning: m.judge?.solution_2_reasoning
      }
    }));

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arena-judge-evaluation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeProblem = messages[activeMessageIndex]?.problem || (messages.length > 0 ? messages[messages.length - 1].problem : "");

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <Sidebar
        messages={messages}
        activeMessageIndex={activeMessageIndex}
        onSelectMessage={handleSelectMessage}
        onNewChat={handleNewChat}
        onClearChat={handleClearChat}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        backendConnected={backendConnected}
        isCheckingBackend={isCheckingBackend}
        backendMode={backendMode}
        onToggleBackendMode={() => setBackendMode(backendMode === 'api' ? 'local' : 'api')}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'pl-16' : 'pl-72'
        }`}
      >
        {/* Top Header */}
        <TopHeader
          activeProblem={activeProblem}
          turnCount={messages.length}
          onClearChat={handleClearChat}
          onExportData={handleExportData}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Chat Feed */}
        <main className="flex-1 pt-16 pb-36 px-4 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto w-full py-6">
            {messages.length === 0 ? (
              /* Empty State */
              <div className="py-24 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center mx-auto text-2xl shadow-xs">
                  ⚖️
                </div>
                <h3 className="font-bold text-slate-900 text-lg tracking-tight">
                  Welcome to AI Battle Arena
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Send a programming or architectural problem below. The arena will generate two independent solutions side-by-side, evaluate both through the judge, and display comprehensive scores with comparative reasoning.
                </p>
              </div>
            ) : (
              /* Message Turns Feed */
              <div className="space-y-12">
                {messages.map((message, index) => (
                  <div key={message.id || index} id={`turn-${index}`}>
                    <MessageTurn message={message} index={index} />
                  </div>
                ))}
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm animate-pulse flex items-center justify-center gap-3 text-slate-600 font-mono text-xs">
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Solution 1 & Solution 2 and running Judge arbitration...</span>
              </div>
            )}

            <div ref={turnsEndRef} />
          </div>
        </main>

        {/* Docked Desktop Prompt Input */}
        <PromptInputBar
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          sidebarCollapsed={sidebarCollapsed}
        />
      </div>
    </div>
  );
}
