import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ShieldCheck,
  Zap,
  Activity,
  Lock,
  Clock,
  Radio,
  LogOut,
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';

export const Header: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    selectedCase,
    startPresentation,
    presentation,
    logout,
  } = useInvestigation();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#040817]/95 backdrop-blur-xl border-b border-[#142346] z-10 flex flex-col flex-shrink-0 no-print">
      {/* Tactical Top Intelligence Classification Header */}
      <div className="bg-[#030612] px-4 py-1.5 border-b border-[#101b36] flex items-center justify-between text-[11px] text-slate-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#00f2fe] uppercase tracking-widest">
            <Radio className="w-3 h-3 text-[#00f2fe] animate-pulse" />
            CENTRAL CRIME INTELLIGENCE COMMAND
          </span>
          <span className="text-[#1a2f5e]">|</span>
          <span className="hidden sm:inline font-mono text-[10px] text-cyan-300/70">
            SECURE LINK: ACTIVE FORENSIC TELEMETRY
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
          <span className="hidden md:flex items-center gap-1 text-[#00f2fe]">
            <ShieldCheck className="w-3 h-3" />
            <span>256-BIT ENCLAVE</span>
          </span>
          <span className="text-[#1a2f5e] hidden md:inline">|</span>
          <span className="flex items-center gap-1 text-cyan-300">
            <Clock className="w-3 h-3" />
            <span>{currentTime || '12:00:00 UTC'}</span>
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Active Case Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider hidden md:inline font-mono">
              TARGET DOSSIER:
            </span>
            <div className="relative">
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="appearance-none bg-[#07112a] hover:bg-[#0b1a3d] border border-[#172b57] hover:border-[#00f2fe]/50 text-white text-xs font-bold rounded-xl pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00f2fe] shadow-md font-mono transition-colors"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#00f2fe] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2.5">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono ${
                selectedCase.priority === 'High'
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
              }`}
            >
              {selectedCase.priority} Threat Priority
            </span>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#07112a] text-slate-300 border border-[#172b57]">
              {selectedCase.status}
            </span>
            <span className="text-xs text-slate-300 truncate max-w-xs font-medium">
              {selectedCase.category}
            </span>
          </div>
        </div>

        {/* Right: Lead Officer & Strategic Briefing */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-[#07112a] px-3 py-1.5 rounded-xl border border-[#172b57]">
            <Activity className="w-3.5 h-3.5 text-[#00f2fe] animate-pulse" />
            <span className="text-slate-200 font-mono text-[11px] font-semibold">{selectedCase.leadInvestigator}</span>
          </div>

          <button
            onClick={() => {
              if (!presentation.isActive) startPresentation();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
              presentation.isActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 ring-2 ring-amber-500/30'
                : 'bg-gradient-to-r from-blue-700 via-cyan-600 to-[#00f2fe] hover:from-blue-600 hover:to-cyan-400 text-slate-950 font-black shadow-lg shadow-[#00f2fe]/20 border border-[#00f2fe]/50 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-slate-950" />
            <span>{presentation.isActive ? `Briefing Phase ${presentation.step} Active` : 'Executive Briefing Mode'}</span>
          </button>

          {/* Lock Console / Sign Out */}
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-[#07112a] hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-[#172b57] hover:border-rose-500/50 transition-colors shadow-sm"
            title="Lock Console / Sign Out to Authorization Enclave"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
