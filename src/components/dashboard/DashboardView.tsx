import React, { useState } from 'react';
import {
  FolderLock,
  FileCheck2,
  Users,
  GitBranch,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Radio,
  Zap,
  ExternalLink,
  Activity,
  Layers,
  Search,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const DashboardView: React.FC = () => {
  const {
    cases,
    entities,
    relationships,
    evidence,
    activityLogs,
    setSelectedCaseId,
    setActiveTab,
    startPresentation,
  } = useInvestigation();

  const [activeLogFilter, setActiveLogFilter] = useState<string>('ALL');
  const [liveStreamActive, setLiveStreamActive] = useState<boolean>(true);

  // Actual calculated summary statistics from the dataset
  const totalCases = cases.length;
  const totalEvidence = evidence.length;
  const totalEntities = entities.length;
  const totalRelationships = relationships.filter((r) => r.status === 'approved').length;
  const verifiedEntities = entities.filter((e) => e.verified).length;
  const highRiskEntities = entities.filter((e) => e.riskScore >= 80).length;

  const handleOpenCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('cases');
  };

  const filteredLogs = activityLogs.filter((log) => {
    if (activeLogFilter === 'ALL') return true;
    if (activeLogFilter === 'TRANSACTIONS') return log.badge === 'Transaction';
    if (activeLogFilter === 'NETWORK') return log.badge === 'Network';
    if (activeLogFilter === 'EXTRACTION') return log.badge === 'Extraction';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Intelligence Hero & Status Banner */}
      <div className="bg-gradient-to-r from-[#040817] via-[#07112d] to-[#0d1c44] border border-[#172d5b] rounded-2xl p-6 relative overflow-hidden shadow-2xl glow-neon-cyan">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#071333] border border-[#00f2fe]/40 text-[11px] font-bold text-[#00f2fe] mb-3 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-ping"></span>
              CENTRAL INTELLIGENCE COMMAND GRID • LIVE ENCLAVE
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-mono">
              Criminal Network Analysis System
            </h2>
            <p className="mt-1 text-sm font-semibold text-[#00f2fe] tracking-wide">
              “From Fragmented Evidence to Connected Investigation Intelligence.”
            </p>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-xl">
              Cross-jurisdictional intelligence hub synthesizing banking ledgers, cellular CDR towers, cyber proxy telemetry, and First Information Reports into an algorithmic, traversable investigation graph.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
            <button
              onClick={startPresentation}
              className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#00f2fe] via-cyan-400 to-blue-500 hover:from-[#00f2fe] hover:to-cyan-300 text-slate-950 flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#00f2fe]/20 hover:scale-[1.02] active:scale-[0.98] border border-[#00f2fe]/60 font-mono"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>Launch Strategic Briefing</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className="px-4 py-3 rounded-xl text-xs font-bold bg-[#071333] hover:bg-[#0b1c4a] text-[#00f2fe] border border-[#172d5b] hover:border-[#00f2fe]/50 flex items-center justify-center gap-2 transition-all shadow-md font-mono"
            >
              <GitBranch className="w-4 h-4 text-[#00f2fe]" />
              <span>Open Link Graph</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Statistics with Dynamic Glowing Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Cases */}
        <div className="bg-[#060e24]/90 backdrop-blur-md border border-[#142346] hover:border-[#00f2fe]/50 rounded-xl p-4 shadow-lg transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Active Inquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <FolderLock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalCases}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ACTIVE
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Target criminal rings under surveillance</p>
        </div>

        {/* Evidence Records Ingested */}
        <div className="bg-[#060e24]/90 backdrop-blur-md border border-[#142346] hover:border-emerald-500/50 rounded-xl p-4 shadow-lg transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Evidence Ledger
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalEvidence}</span>
            <span className="text-[11px] font-mono text-[#00f2fe] font-bold">CERTIFIED</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">FIRs, Banking Records & CDR Dockets</p>
        </div>

        {/* Identified Target Entities */}
        <div className="bg-[#060e24]/90 backdrop-blur-md border border-[#142346] hover:border-amber-500/50 rounded-xl p-4 shadow-lg transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Identified Nodes
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalEntities}</span>
            <span className="text-[11px] text-rose-400 font-mono font-bold">
              {highRiskEntities} High Risk
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{verifiedEntities} KYC-confirmed primary subjects</p>
        </div>

        {/* Recorded Relationships */}
        <div className="bg-[#060e24]/90 backdrop-blur-md border border-[#142346] hover:border-[#00f2fe]/50 rounded-xl p-4 shadow-lg transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Verified Links
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f2fe] group-hover:scale-110 transition-transform">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalRelationships}</span>
            <span className="text-[11px] font-mono text-[#00f2fe] font-bold">TRAVERSABLE</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Directional multi-hop edges mapped</p>
        </div>
      </div>

      {/* Main Grid: Active Syndicates & Live Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Inquiries Dossiers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wider uppercase font-mono">
                Active Tactical Dossiers (3 Operations)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Select dossier to load target focus</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {cases.map((c) => {
              const caseEntities = entities.filter((e) => e.caseId === c.id);
              const caseEvidence = evidence.filter((ev) => ev.caseId === c.id);
              const highRisk = caseEntities.filter((e) => e.riskScore >= 80).length;

              return (
                <div
                  key={c.id}
                  onClick={() => handleOpenCase(c.id)}
                  className="bg-[#060e24]/90 hover:bg-[#081330] border border-[#142346] hover:border-[#00f2fe]/60 rounded-xl p-5 transition-all cursor-pointer group shadow-lg hover:shadow-[#00f2fe]/10 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-black text-[#00f2fe] bg-[#071333] px-2.5 py-1 rounded border border-[#00f2fe]/40">
                          {c.id}
                        </span>
                        <h4 className="text-base font-bold text-white group-hover:text-[#00f2fe] transition-colors">
                          {c.title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                            c.priority === 'High'
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {c.priority} Priority
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071333] text-slate-300 border border-[#172b57]">
                          {c.status}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#071333] text-slate-400 group-hover:text-[#00f2fe] group-hover:bg-[#00f2fe]/10 transition-all flex-shrink-0 border border-[#172b57]">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Threat Breakdown Footnote */}
                  <div className="mt-4 pt-3 border-t border-[#142346] flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-5">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <strong className="text-white font-mono">{caseEntities.length}</strong> Nodes
                        <span className="text-rose-400 text-[10px] font-mono">({highRisk} High Risk)</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                        <strong className="text-white font-mono">{caseEvidence.length}</strong> Evidence Items
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#00f2fe] font-bold group-hover:translate-x-1 transition-transform">
                      <span>Open Case Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Live Investigation Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00f2fe]" />
              <h3 className="text-sm font-bold text-white tracking-wider uppercase font-mono">
                Live Intercept Activity
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              STREAMING
            </div>
          </div>

          {/* Activity Filter Chips */}
          <div className="flex items-center gap-1 bg-[#060e24] p-1 rounded-xl border border-[#142346] text-[10px] font-mono">
            {['ALL', 'TRANSACTIONS', 'NETWORK', 'EXTRACTION'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLogFilter(tab)}
                className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all ${
                  activeLogFilter === tab
                    ? 'bg-[#00f2fe] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Feed List */}
          <div className="bg-[#060e24]/90 border border-[#142346] rounded-xl p-4 space-y-3.5 max-h-[460px] overflow-y-auto shadow-inner">
            {filteredLogs.map((log) => {
              let badgeColor = 'bg-blue-500/15 text-blue-300 border-blue-500/40';
              if (log.badge === 'Transaction') badgeColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
              if (log.badge === 'Network') badgeColor = 'bg-purple-500/15 text-purple-300 border-purple-500/40';
              if (log.badge === 'Extraction') badgeColor = 'bg-[#00f2fe]/15 text-[#00f2fe] border-[#00f2fe]/40';
              if (log.badge === 'Verification') badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/40';

              return (
                <div key={log.id} className="text-xs pb-3.5 border-b border-[#142346] last:border-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                      {log.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.timestamp.split(' ')[1]}
                    </span>
                  </div>
                  <p className="text-slate-200 leading-snug font-medium">
                    {log.action}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="text-[#00f2fe] font-semibold">{log.caseId}</span>
                    <span>{log.user}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-[#060e24]/70 border border-[#142346] text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#00f2fe] font-bold uppercase text-[10px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Chain of Custody Notice</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All intelligence logs are cryptographically timestamped and indexed for Section 65B forensic certificate admissibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
