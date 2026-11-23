import React from 'react';
import { TrashIcon, DownloadIcon, SparklesIcon } from './Icons';

export default function TopHeader({
  activeProblem,
  turnCount,
  onClearChat,
  onExportData,
  sidebarCollapsed
}) {
  return (
    <header 
      className={`fixed top-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 z-40 flex items-center justify-between px-6 lg:px-8 transition-all duration-300 shadow-2xs ${
        sidebarCollapsed ? 'left-16' : 'left-72'
      }`}
    >
      {/* Left: Active Problem Context */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-900 truncate max-w-sm lg:max-w-md xl:max-w-lg text-sm">
            {activeProblem || "Dual Solution Battlefeed"}
          </span>
          {turnCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px] font-medium hidden md:inline">
              {turnCount} {turnCount === 1 ? 'Turn' : 'Turns'}
            </span>
          )}
        </div>

        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 font-mono text-[11px] text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
          <span>Alpha vs Beta</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-700 font-semibold">Judge Evaluated</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onExportData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors text-xs font-medium border border-slate-200/60"
          title="Export conversation in JSON schema"
        >
          <DownloadIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export JSON</span>
        </button>

        <button
          onClick={onClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors text-xs font-medium"
          title="Clear all messages"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>
    </header>
  );
}
