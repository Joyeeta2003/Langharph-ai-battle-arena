import React from 'react';
import DualSolutionGrid from './DualSolutionGrid';
import JudgeRecommendationCard from './JudgeRecommendationCard';

export default function MessageTurn({ message, index }) {
  const {
    problem,
    solution_1,
    solution_2,
    judge,
    model_1 = "Model Alpha (Gemini / Claude)",
    model_2 = "Model Beta (GPT-4o / Cohere)",
    judge_model = "Claude 3.5 Opus (Analytical Benchmark)",
    timestamp = "Just now"
  } = message;

  return (
    <div className="space-y-6 pt-4 pb-8 border-b border-slate-200/60 last:border-b-0">
      {/* Turn Meta Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="font-semibold text-slate-600">Turn #{index + 1}</span>
          <span>•</span>
          <span>{timestamp}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-400">
          <span>Dual Generation + Automated Arbitration</span>
        </div>
      </div>

      {/* User Problem Card */}
      <div className="flex justify-start">
        <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6 transition-all hover:shadow-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs shadow-xs">
                U
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">
                    Prompt / Problem
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-mono font-medium">
                    Evaluator
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400">
              {timestamp}
            </div>
          </div>

          <div className="pt-3.5">
            <p className="text-slate-800 text-sm md:text-base leading-relaxed font-normal">
              {problem}
            </p>
          </div>
        </div>
      </div>

      {/* Dual Solutions Side-by-Side */}
      <DualSolutionGrid
        solution1={solution_1}
        solution2={solution_2}
        score1={judge?.solution_1_score}
        score2={judge?.solution_2_score}
        model1Name={model_1}
        model2Name={model_2}
      />

      {/* Judge Recommendation & Verdict */}
      <JudgeRecommendationCard
        judge={judge}
        judgeModel={judge_model}
      />
    </div>
  );
}
