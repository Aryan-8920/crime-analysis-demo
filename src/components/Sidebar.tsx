import React from 'react';
import {
  LayoutDashboard,
  FolderLock,
  Share2,
  CircleDollarSign,
  FileText,
  RotateCcw,
  ShieldCheck,
  Radio,
  Zap,
  Terminal,
} from 'lucide-react';
import { useInvestigation, ActiveTab } from '../context/InvestigationContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, resetDemoData, startPresentation, presentation, selectedCase } = useInvestigation();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Command Center',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'cases',
      label: 'Cases & Dossiers',
      icon: <FolderLock className="w-4 h-4" />,
      badge: '3 Active',
    },
    {
      id: 'network',
      label: 'Network Analysis',
      icon: <Share2 className="w-4 h-4" />,
      badge: '4-Hop BFS',
    },
    {
      id: 'financial',
      label: 'Financial Trail',
      icon: <CircleDollarSign className="w-4 h-4" />,
      badge: '₹11.0L',
    },
    {
      id: 'reports',
      label: 'Intelligence Reports',
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-[#040816]/95 border-r border-[#142346] flex flex-col flex-shrink-0 select-none z-20 no-print shadow-2xl">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#142346] bg-gradient-to-b from-[#08122c] to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f2fe]/20 via-blue-600/30 to-indigo-900 flex items-center justify-center text-white shadow-lg shadow-[#00f2fe]/10 border border-[#00f2fe]/40 relative">
            <Share2 className="w-5 h-5 text-[#00f2fe]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00f2fe] ring-2 ring-[#040816] animate-ping"></span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xs font-black text-white tracking-wider leading-tight uppercase font-mono">
              CRIMINAL NETWORK
            </h1>
            <p className="text-[11px] text-[#00f2fe] font-semibold tracking-tight truncate flex items-center gap-1">
              <span>Forensic Intelligence Grid</span>
            </p>
          </div>
        </div>

        {/* Live Grid Status Pill */}
        <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-[#07112a] border border-[#172b57] text-[10px] flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium text-[#00f2fe]">
            <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span>
            ACTIVE FORENSIC NODE
          </span>
          <span className="font-mono text-[9px] text-cyan-300/70 uppercase tracking-wider">LIVE 24/7</span>
        </div>
      </div>

      {/* Strategic Briefing Launcher */}
      <div className="p-3">
        <button
          onClick={() => {
            if (presentation.isActive) return;
            startPresentation();
          }}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
            presentation.isActive
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 ring-2 ring-amber-500/20 animate-pulse'
              : 'bg-gradient-to-r from-blue-700 via-cyan-600 to-[#00f2fe] hover:from-blue-600 hover:to-cyan-400 text-slate-950 font-black shadow-lg shadow-[#00f2fe]/15 border border-[#00f2fe]/50 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          <Zap className="w-4 h-4 text-slate-950" />
          <span>{presentation.isActive ? `Briefing: Phase ${presentation.step}/7` : 'Executive Strategic Briefing'}</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-2 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono flex items-center justify-between">
          <span>OPERATIONAL MODULES</span>
          <Terminal className="w-3 h-3 text-[#00f2fe]" />
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/40 shadow-[0_0_15px_-3px_rgba(0,242,254,0.25)] font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-[#091534]/70 border border-transparent hover:border-[#172b57]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#00f2fe]' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="font-semibold">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40 font-bold'
                      : 'bg-[#091534] text-slate-400 border border-[#142346]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Tactical Selected Target Widget */}
        <div className="mt-4 pt-3 border-t border-[#142346] px-2 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
            <span>CURRENT TARGET FOCUS</span>
            <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
          </div>
          <div className="p-2.5 rounded-xl bg-[#07112a] border border-[#172b57] space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#00f2fe] block truncate">
              {selectedCase.id}
            </span>
            <p className="text-xs font-bold text-white truncate">{selectedCase.title}</p>
            <p className="text-[10px] text-slate-400 truncate">{selectedCase.leadInvestigator}</p>
          </div>
        </div>
      </nav>

      {/* Footer / Database Sync */}
      <div className="p-3 border-t border-[#142346] bg-[#030612] space-y-2">
        <button
          onClick={resetDemoData}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-[#00f2fe] hover:bg-[#07112a] transition-colors border border-[#142346] hover:border-[#00f2fe]/30"
          title="Synchronize threat matrix and restore baseline verification records"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Synchronize Intel Database</span>
        </button>

        <div className="p-2 rounded-lg bg-[#07112a]/80 border border-[#172b57] text-[10px] text-slate-400 leading-tight flex items-start gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00f2fe] flex-shrink-0 mt-0.5" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-300">
            ENCLAVE ENCRYPTED • LEVEL 4 CLEARANCE
          </span>
        </div>
      </div>
    </aside>
  );
};
