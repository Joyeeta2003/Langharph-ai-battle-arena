import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { CopyIcon, CheckIcon, BoltIcon, CodeIcon } from './Icons';

export default function DualSolutionGrid({ 
  solution1, 
  solution2, 
  score1, 
  score2, 
  model1Name = "Model Alpha (Gemini / Claude)", 
  model2Name = "Model Beta (GPT-4o / Cohere)" 
}) {
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);

  const isWinner1 = score1 > score2;
  const isWinner2 = score2 > score1;

  const handleCopy1 = () => {
    navigator.clipboard.writeText(solution1);
    setCopied1(true);
    setTimeout(() => setCopied1(false), 2000);
  };

  const handleCopy2 = () => {
    navigator.clipboard.writeText(solution2);
    setCopied2(true);
    setTimeout(() => setCopied2(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 text-sm md:text-base tracking-tight">
            Dual AI Model Generations
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium border border-slate-200/60">
            Side-by-Side Evaluation
          </span>
        </div>
        <div className="text-slate-400 font-mono text-xs hidden sm:block">
          Desktop Comparative Grid • Double-Blind
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Solution 1 Card */}
        <article className={`flex flex-col bg-white rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden ${
          isWinner1 
            ? 'border-emerald-400 ring-2 ring-emerald-500/10' 
            : 'border-slate-200/90 hover:border-slate-300'
        }`}>
          {/* Card Header */}
          <div className="px-5 py-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center font-bold font-mono text-sm shadow-xs">
                A
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm tracking-tight">
                    Solution 1
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-50/80 text-indigo-700 font-medium border border-indigo-100">
                    {model1Name}
                  </span>
                  {isWinner1 && (
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Winner
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <BoltIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>Streamed in 1.4s • Score: <strong>{score1 ?? 'N/A'}/10</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy1}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 text-xs font-medium transition-colors"
                title="Copy Solution 1"
              >
                {copied1 ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card Body with Markdown */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <MarkdownRenderer content={solution1} />
          </div>
        </article>

        {/* Solution 2 Card */}
        <article className={`flex flex-col bg-white rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden ${
          isWinner2 
            ? 'border-emerald-400 ring-2 ring-emerald-500/10' 
            : 'border-slate-200/90 hover:border-slate-300'
        }`}>
          {/* Card Header */}
          <div className="px-5 py-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/80 text-purple-700 flex items-center justify-center font-bold font-mono text-sm shadow-xs">
                B
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm tracking-tight">
                    Solution 2
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-purple-50/80 text-purple-700 font-medium border border-purple-100">
                    {model2Name}
                  </span>
                  {isWinner2 && (
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Winner
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <BoltIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>Streamed in 1.8s • Score: <strong>{score2 ?? 'N/A'}/10</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy2}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 text-xs font-medium transition-colors"
                title="Copy Solution 2"
              >
                {copied2 ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card Body with Markdown */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <MarkdownRenderer content={solution2} />
          </div>
        </article>
      </div>
    </div>
  );
}
