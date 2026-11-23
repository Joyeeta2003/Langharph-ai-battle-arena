import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, SparklesIcon, BoltIcon } from './Icons';
import { PRESET_PROMPTS } from '../data/mockData';

export default function PromptInputBar({
  onSendMessage,
  isLoading,
  sidebarCollapsed
}) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [prompt]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSendMessage(prompt.trim());
    setPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSelectPreset = (preset) => {
    setPrompt(preset);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div 
      className={`fixed bottom-0 right-0 z-30 transition-all duration-300 pointer-events-none p-4 pb-6 ${
        sidebarCollapsed ? 'left-16' : 'left-72'
      }`}
    >
      <div className="max-w-5xl mx-auto w-full pointer-events-auto space-y-2.5">
        {/* Suggestion Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-1">
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold shrink-0">
            Presets:
          </span>
          {PRESET_PROMPTS.map((preset, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSelectPreset(preset)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-indigo-50/80 text-slate-700 hover:text-indigo-700 text-xs transition-colors border border-slate-200/80 shadow-2xs"
            >
              <SparklesIcon className="w-3 h-3 text-indigo-500" />
              <span className="truncate max-w-xs">{preset}</span>
            </button>
          ))}
        </div>

        {/* Floating Input Dock */}
        <form 
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-xl border border-slate-300/80 rounded-2xl shadow-xl p-3.5 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/10"
        >
          <div className="flex flex-col gap-2.5">
            {/* Input Textarea */}
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              placeholder="Ask a coding problem or technical prompt for dual model evaluation..."
              className="w-full bg-transparent resize-none font-normal text-sm md:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none leading-relaxed max-h-48"
            />

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              {/* Left Tags / Model Telemetry */}
              <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>Model A (Sonnet/Gemini)</span>
                  <span className="text-slate-400">/</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>Model B (GPT-4o/Cohere)</span>
                </div>
                <span className="hidden md:inline text-slate-400">• Automated Judge Recommendation</span>
              </div>

              {/* Right Controls: Token counter & Send button */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  {prompt.length} chars • Enter ↵
                </span>

                <button
                  type="submit"
                  disabled={!prompt.trim() || isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all shadow-xs ${
                    prompt.trim() && !isLoading
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                      <span>Evaluating Arena...</span>
                    </>
                  ) : (
                    <>
                      <span>Prompt Arena</span>
                      <SendIcon className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
