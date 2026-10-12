import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';

export const PresentationGuide: React.FC = () => {
  const {
    presentation,
    nextPresentationStep,
    prevPresentationStep,
    stopPresentation,
  } = useInvestigation();

  if (!presentation.isActive) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 no-print">
      <div className="bg-[#060e24]/95 backdrop-blur-xl border border-[#00f2fe]/40 rounded-2xl p-4 shadow-2xl glow-neon-cyan ring-1 ring-[#00f2fe]/20 text-slate-100">
        <div className="flex items-start justify-between gap-4">
          {/* Step header & icon */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00f2fe]/15 border border-[#00f2fe]/40 flex items-center justify-center text-[#00f2fe] flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#071333] text-[#00f2fe] border border-[#172d5b]">
                  STRATEGIC BRIEFING • PHASE {presentation.step} OF 7
                </span>
                <h3 className="text-sm font-black text-white tracking-tight font-mono">
                  {presentation.title}
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed font-normal flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#00f2fe] flex-shrink-0 mt-0.5" />
                <span>{presentation.note}</span>
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={stopPresentation}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#0c1a3f] transition-colors"
            title="Exit Presentation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step dots & navigation actions */}
        <div className="mt-3 pt-3 border-t border-[#142346] flex items-center justify-between gap-4">
          {/* Step indicator dots */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div
                key={num}
                className={`h-1.5 rounded-full transition-all ${
                  num === presentation.step
                    ? 'w-6 bg-[#00f2fe] shadow-[0_0_8px_rgba(0,242,254,0.6)]'
                    : num < presentation.step
                    ? 'w-2 bg-blue-500'
                    : 'w-2 bg-[#172b57]'
                }`}
                title={`Phase ${num}`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={prevPresentationStep}
              disabled={presentation.step === 1}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                presentation.step === 1
                  ? 'text-slate-600 bg-slate-900/40 cursor-not-allowed'
                  : 'text-slate-300 bg-[#091538] hover:bg-[#0e2154] hover:text-white border border-[#142346]'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextPresentationStep}
              className="px-4 py-1.5 rounded-lg text-xs font-black bg-[#00f2fe] hover:bg-cyan-300 text-slate-950 flex items-center gap-1.5 transition-all shadow-md shadow-[#00f2fe]/30"
            >
              <span>{presentation.step === 7 ? 'Complete Briefing' : 'Next Phase'}</span>
              {presentation.step === 7 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={stopPresentation}
              className="px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
