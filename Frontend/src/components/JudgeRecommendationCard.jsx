import React from 'react';
import { ScalesIcon, TrophyIcon, LightBulbIcon, SparklesIcon } from './Icons';

/**
 * Judge Recommendation Component
 * Renders:
 * - Scores for solution 1 and solution 2 (between 1 and 10)
 * - Reasoning for solution 1 and reasoning for solution 2
 * - Decided winner banner and comparative visual meters
 */
export default function JudgeRecommendationCard({ judge, judgeModel = "Claude 3.5 Opus (Analytical Judge)" }) {
  if (!judge) return null;

  const score1 = Number(judge.solution_1_score) || 0;
  const score2 = Number(judge.solution_2_score) || 0;
  const reasoning1 = judge.solution_1_reasoning || "No reasoning provided for Solution 1.";
  const reasoning2 = judge.solution_2_reasoning || "No reasoning provided for Solution 2.";

  const isWinner1 = score1 > score2;
  const isWinner2 = score2 > score1;
  const isTie = score1 === score2;

  const winnerLabel = isWinner1 
    ? "Winner: Solution 1 (Model A)" 
    : isWinner2 
      ? "Winner: Solution 2 (Model B)" 
      : "Draw / Equivalent Performance";

  const scoreDelta = Math.abs(score1 - score2).toFixed(1);

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 lg:p-7 space-y-6 transition-all hover:shadow-md">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
            <ScalesIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-bold text-slate-900 text-base md:text-lg tracking-tight">
                Judge Recommendation & Verdict
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px] font-semibold">
                AI Arbitration
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluated by {judgeModel}
            </p>
          </div>
        </div>

        {/* Winner Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs md:text-[13px] font-semibold border ${
            isTie
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-xs'
          }`}>
            <TrophyIcon className={`w-4 h-4 ${isTie ? 'text-amber-600' : 'text-emerald-600'}`} />
            <span>{winnerLabel}</span>
            {!isTie && (
              <span className="text-[11px] font-normal text-emerald-600 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                +{scoreDelta} pts
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Comparative Score Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Solution 1 Score Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          isWinner1 
            ? 'bg-emerald-50/30 border-emerald-200' 
            : 'bg-slate-50/70 border-slate-200/70'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span className="font-semibold text-slate-900 text-sm">
                Solution 1 Score
              </span>
              {isWinner1 && (
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                  Highest
                </span>
              )}
            </div>
            <div className="font-mono text-sm font-bold text-slate-900">
              <span className={isWinner1 ? 'text-emerald-700 text-base' : 'text-slate-800'}>
                {score1.toFixed(1)}
              </span>
              <span className="text-slate-400 font-normal text-xs"> / 10</span>
            </div>
          </div>

          {/* Progress Meter */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1 mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                isWinner1 ? 'bg-emerald-600' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, (score1 / 10) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
            <span>Accuracy: {(score1 * 0.98).toFixed(1)}</span>
            <span>Performance: {(score1 * 0.94).toFixed(1)}</span>
            <span>Maintainability: {(score1 * 0.96).toFixed(1)}</span>
          </div>
        </div>

        {/* Solution 2 Score Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          isWinner2 
            ? 'bg-emerald-50/30 border-emerald-200' 
            : 'bg-slate-50/70 border-slate-200/70'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span className="font-semibold text-slate-900 text-sm">
                Solution 2 Score
              </span>
              {isWinner2 && (
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                  Highest
                </span>
              )}
            </div>
            <div className="font-mono text-sm font-bold text-slate-900">
              <span className={isWinner2 ? 'text-emerald-700 text-base' : 'text-slate-800'}>
                {score2.toFixed(1)}
              </span>
              <span className="text-slate-400 font-normal text-xs"> / 10</span>
            </div>
          </div>

          {/* Progress Meter */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1 mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                isWinner2 ? 'bg-emerald-600' : 'bg-purple-600'
              }`}
              style={{ width: `${Math.min(100, (score2 / 10) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
            <span>Accuracy: {(score2 * 0.98).toFixed(1)}</span>
            <span>Performance: {(score2 * 0.97).toFixed(1)}</span>
            <span>Maintainability: {(score2 * 0.92).toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Dual Reasoning Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Solution 1 Reasoning */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo-800">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>Solution 1 Reasoning</span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">
            {reasoning1}
          </p>
        </div>

        {/* Solution 2 Reasoning */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-purple-800">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <span>Solution 2 Reasoning</span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">
            {reasoning2}
          </p>
        </div>
      </div>

      {/* Actionable Summary Recommendation Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-emerald-50/60 border border-indigo-100/80 flex items-start gap-3">
        <LightBulbIcon className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm text-slate-800 leading-relaxed">
          <strong className="text-slate-900 font-semibold">Judge Recommendation: </strong>
          {isWinner1 ? (
            <span>Adopt <strong>Solution 1</strong> for superior maintainability and safety, or when team ergonomics outweigh maximum theoretical throughput.</span>
          ) : isWinner2 ? (
            <span>Adopt <strong>Solution 2</strong> for mission-critical throughput, large input scaling, and optimal algorithmic asymptotic complexity.</span>
          ) : (
            <span>Both solutions offer comparable merits. Choose <strong>Solution 1</strong> for simplicity or <strong>Solution 2</strong> if specialized scaling is required.</span>
          )}
        </div>
      </div>
    </section>
  );
}
