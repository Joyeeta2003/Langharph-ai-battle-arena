import React from 'react';
import { 
  CompareArrowsIcon, 
  PlusIcon, 
  TrashIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  SettingsIcon,
  SparklesIcon
} from './Icons';

export default function Sidebar({
  messages,
  activeMessageIndex,
  onSelectMessage,
  onNewChat,
  onClearChat,
  isCollapsed,
  onToggleCollapse,
  backendConnected,
  isCheckingBackend,
  backendMode,
  onToggleBackendMode
}) {
  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-[#f8fafc] border-r border-slate-200/80 z-50 flex flex-col justify-between transition-all duration-300 shadow-[1px_0_12px_rgba(0,0,0,0.02)] ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand / Logo Top Bar */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/70 shrink-0 bg-white">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                ⚔️
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 tracking-tight text-sm">
                  Arena Judge
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Desktop Battlefeed
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm">
              ⚔️
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors ml-auto"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
          </button>
        </div>

        {/* New Prompt Button */}
        <div className="p-3.5 shrink-0">
          <button
            onClick={onNewChat}
            className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.99] py-2.5 rounded-xl font-medium text-xs md:text-sm shadow-xs transition-all ${
              isCollapsed ? 'px-0' : 'px-4'
            }`}
            title="Start New Arena Comparison"
          >
            <PlusIcon className="w-4 h-4" />
            {!isCollapsed && <span>New Arena Prompt</span>}
          </button>
        </div>

        {/* Conversation Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <div>
            {!isCollapsed && (
              <div className="px-2 pb-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Arena Turns ({messages.length})
              </div>
            )}

            <div className="space-y-1">
              {messages.map((msg, idx) => {
                const isActive = activeMessageIndex === idx;
                return (
                  <button
                    key={msg.id || idx}
                    onClick={() => onSelectMessage(idx)}
                    className={`w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-indigo-50/90 text-indigo-900 font-semibold border border-indigo-200/80 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 border border-transparent'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={msg.problem}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono shrink-0 ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {idx + 1}
                    </div>

                    {!isCollapsed && (
                      <div className="truncate flex-1">
                        <p className="truncate text-xs">{msg.problem}</p>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">
                          Scores: {msg.judge?.solution_1_score} vs {msg.judge?.solution_2_score}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer Area: Backend Status & Controls */}
        <div className="p-3.5 bg-slate-100/60 border-t border-slate-200/80 shrink-0 space-y-2.5">
          {/* Backend Mode Pill */}
          {!isCollapsed && (
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Backend Engine</span>
                <button
                  onClick={onToggleBackendMode}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                    backendMode === 'api' 
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                      : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                  }`}
                  title="Click to toggle between LangGraph backend and Local mode"
                >
                  {backendMode === 'api' ? 'LangGraph API' : 'Simulated AI'}
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <span className={`w-2 h-2 rounded-full ${
                  backendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`} />
                <span>
                  {backendConnected 
                    ? 'Connected (:3000)' 
                    : isCheckingBackend 
                      ? 'Checking API...' 
                      : 'API Offline (Local active)'}
                </span>
              </div>
            </div>
          )}

          {/* Quick Clear Chat */}
          <button
            onClick={onClearChat}
            className={`w-full flex items-center gap-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Clear all messages"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            {!isCollapsed && <span>Reset Conversation</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
