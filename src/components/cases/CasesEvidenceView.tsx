import React, { useState } from 'react';
import {
  FolderLock,
  FileText,
  Search,
  CheckCircle,
  XCircle,
  Cpu,
  ArrowRight,
  ShieldAlert,
  User,
  CreditCard,
  Phone,
  Laptop,
  Globe,
  Car,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Scan,
  CheckCircle2,
  FileSearch,
  Zap,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { EntityType } from '../../types';

export const CasesEvidenceView: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    selectedCase,
    entities,
    evidence,
    candidates,
    approveCandidate,
    rejectCandidate,
    casesSubTab,
    setCasesSubTab,
    selectedEvidenceId,
    setSelectedEvidenceId,
    isAnalyzingEvidence,
    setIsAnalyzingEvidence,
    setActiveTab,
  } = useInvestigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Filter cases
  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Evidence items for the active case
  const activeCaseEvidence = evidence.filter((e) => e.caseId === selectedCaseId);
  const activeEvidence =
    evidence.find((e) => e.id === selectedEvidenceId) || activeCaseEvidence[0] || evidence[0];

  // Candidates for active case & evidence
  const relevantCandidates = candidates.filter(
    (c) => c.caseId === selectedCaseId && (c.evidenceId === activeEvidence?.id || !c.evidenceId)
  );

  // Associated entities for selected case
  const caseEntities = entities.filter((e) => e.caseId === selectedCaseId);

  const handleStartAnalysis = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsAnalyzingEvidence(true);
    }, 400);
  };

  const renderEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'person':
        return <User className="w-3.5 h-3.5 text-blue-400" />;
      case 'bank_account':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-400" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5 text-amber-400" />;
      case 'device':
        return <Laptop className="w-3.5 h-3.5 text-purple-400" />;
      case 'ip_address':
        return <Globe className="w-3.5 h-3.5 text-teal-400" />;
      case 'vehicle':
        return <Car className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header and Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 uppercase font-mono">
            <FolderLock className="w-5 h-5 text-cyan-400" />
            Cases & Evidentiary Dossiers
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse targeted case registers or analyze evidentiary records using automated entity extraction.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#060e24]/90 p-1 rounded-xl border border-[#142346] shadow-md">
          <button
            onClick={() => setCasesSubTab('cases')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono flex items-center gap-2 transition-all ${
              casesSubTab === 'cases'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-[#091538]'
            }`}
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>Target Cases ({cases.length})</span>
          </button>
          <button
            onClick={() => setCasesSubTab('evidence')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono flex items-center gap-2 transition-all ${
              casesSubTab === 'evidence'
                ? 'bg-[#00f2fe] text-slate-950 shadow-md shadow-[#00f2fe]/30 font-black'
                : 'text-slate-400 hover:text-white hover:bg-[#091538]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Evidence Ledger ({evidence.length})</span>
          </button>
        </div>
      </div>

      {/* CASES SUB-TAB */}
      {casesSubTab === 'cases' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Case List & Search */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search cases by ID, title, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono shadow-inner"
              />
            </div>

            <div className="space-y-3">
              {filteredCases.map((c) => {
                const isSelected = c.id === selectedCaseId;
                const cEntities = entities.filter((e) => e.caseId === c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-850/90 border-cyan-400 shadow-xl shadow-cyan-950/50 ring-2 ring-cyan-500/30'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                        {c.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                          c.priority === 'High'
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {c.priority} Priority
                      </span>
                    </div>

                    <h3 className="mt-2 text-sm font-bold text-white">{c.title}</h3>
                    <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">{c.description}</p>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{c.category}</span>
                      <span className="text-cyan-400 font-bold">{cEntities.length} Nodes</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Case Detail Panel */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-950 px-3 py-1 rounded border border-cyan-800">
                    {selectedCase.id}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {selectedCase.status}
                  </span>
                </div>
                <h2 className="mt-2.5 text-xl font-black text-white uppercase font-mono">{selectedCase.title}</h2>
                <p className="text-xs text-cyan-400 mt-0.5 font-semibold">{selectedCase.category}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCasesSubTab('evidence');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Evidence</span>
                </button>
                <button
                  onClick={() => setActiveTab('network')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-950/40"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Link Graph</span>
                </button>
              </div>
            </div>

            {/* Case Meta Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Lead Investigator</span>
                <p className="mt-1 text-xs font-bold text-white">{selectedCase.leadInvestigator}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Opened Date</span>
                <p className="mt-1 text-xs font-mono text-cyan-300 font-bold">{selectedCase.openedDate}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Working Hypothesis</span>
                <p className="mt-1 text-xs text-slate-200 line-clamp-1">{selectedCase.keyHypothesis}</p>
              </div>
            </div>

            {/* Case Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Executive Case Synopsis
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {selectedCase.description} {selectedCase.keyHypothesis}
              </p>
            </div>

            {/* Associated Entities Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Identified Entity Records ({caseEntities.length})
                </h4>
                <span className="text-[11px] text-cyan-400 font-mono">KYC / Telemetry Verified</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-mono tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3.5">Entity / Subject</th>
                      <th className="py-3 px-3.5">Classification</th>
                      <th className="py-3 px-3.5">Identifier</th>
                      <th className="py-3 px-3.5">Operational Role</th>
                      <th className="py-3 px-3.5 text-right">Threat Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {caseEntities.map((ent) => (
                      <tr key={ent.id} className="hover:bg-slate-850/60 transition-colors">
                        <td className="py-3 px-3.5 font-bold text-white flex items-center gap-2">
                          {renderEntityIcon(ent.type)}
                          <span>{ent.name}</span>
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="capitalize text-slate-300 font-mono text-[11px]">
                            {ent.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-mono text-cyan-300 text-[11px] font-semibold">
                          {ent.identifier}
                        </td>
                        <td className="py-3 px-3.5 text-slate-300 text-[11px]">
                          {ent.role || 'Subject'}
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <span
                            className={`font-mono font-bold text-xs ${
                              ent.riskScore >= 80
                                ? 'text-rose-400'
                                : ent.riskScore >= 60
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {ent.riskScore}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EVIDENCE SUB-TAB */}
      {casesSubTab === 'evidence' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Preloaded Evidence List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Evidentiary Dockets ({selectedCase.id})
              </span>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">
                {activeCaseEvidence.length} Ingested
              </span>
            </div>

            <div className="space-y-3">
              {activeCaseEvidence.map((ev) => {
                const isSelected = ev.id === activeEvidence.id;
                return (
                  <div
                    key={ev.id}
                    onClick={() => {
                      setSelectedEvidenceId(ev.id);
                      setIsAnalyzingEvidence(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-850 border-cyan-400 shadow-xl shadow-cyan-950/50 ring-2 ring-cyan-500/30'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        {ev.id}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {ev.type}
                      </span>
                    </div>

                    <h4 className="mt-2 text-xs font-bold text-white">{ev.title}</h4>
                    <p className="mt-1 text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{ev.content}</p>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{ev.timestamp.split(' ')[0]}</span>
                      <span className="text-cyan-400 font-semibold">
                        {ev.relatedEntityIds.length} Linked Nodes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Evidence Inspection & Analysis View */}
          <div className="lg:col-span-2 space-y-6">
            {/* Evidence Document Inspection Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                      {activeEvidence.id}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 font-mono">
                      {activeEvidence.type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Dossier: {activeEvidence.caseId}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-black text-white uppercase font-mono">{activeEvidence.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Agency: {activeEvidence.sourceAgency} • Logged: {activeEvidence.timestamp}
                  </p>
                </div>

                {/* Prominent Analyze Evidence Button with Scanning FX */}
                <button
                  onClick={handleStartAnalysis}
                  disabled={isScanning}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase font-mono flex items-center gap-2 transition-all shadow-lg ${
                    isScanning
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : isAnalyzingEvidence
                      ? 'bg-cyan-400 text-slate-950 ring-2 ring-cyan-400/50'
                      : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-950/50 hover:scale-[1.02]'
                  }`}
                >
                  <Scan className="w-4 h-4 text-slate-950" />
                  <span>{isScanning ? 'Extracting Entities...' : 'Run Neural Entity Extraction'}</span>
                </button>
              </div>

              {/* Certified Evidence Content */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
                  <span className="text-cyan-400 font-bold">CERTIFIED CASE RECORD</span>
                  <span className="text-emerald-400">STATUS: AUTHENTICATED</span>
                </div>
                <p className="whitespace-pre-line text-slate-100 leading-relaxed font-sans text-xs">
                  {activeEvidence.content}
                </p>
              </div>

              {/* Related Entity Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-mono">Referenced Entities:</span>
                {activeEvidence.relatedEntityIds.map((eid) => {
                  const ent = entities.find((e) => e.id === eid);
                  return (
                    <span
                      key={eid}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200"
                    >
                      {ent ? renderEntityIcon(ent.type) : <User className="w-3 h-3" />}
                      <span>{ent ? ent.name : eid}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Neural Extraction Drawer */}
            {isAnalyzingEvidence && (
              <div className="bg-slate-900/95 border border-cyan-500/50 rounded-xl p-6 space-y-5 animate-in fade-in duration-200 ring-1 ring-cyan-500/30 shadow-2xl shadow-cyan-950/40 glow-cyan">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                      <Cpu className="w-5 h-5 animate-spin-slow" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white font-mono uppercase">
                          AI Neural Knowledge Graph Extraction Engine (v4.2)
                        </h4>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          EXTRACTION READY
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Inferred candidates extracted from transcript {activeEvidence.id} with cross-verification.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 font-bold">
                    {relevantCandidates.length} Candidates Identified
                  </span>
                </div>

                {/* Candidate Relationships Review Table */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between font-mono">
                    <span>Candidate Inferences Requiring Investigative Confirmation</span>
                    <span className="text-[11px] text-cyan-300 font-sans font-normal">
                      Approve to inject into Link Graph • Reject to archive
                    </span>
                  </div>

                  <div className="space-y-3">
                    {relevantCandidates.map((cand) => {
                      const srcEnt = entities.find((e) => e.id === cand.sourceId);
                      const tgtEnt = entities.find((e) => e.id === cand.targetId);

                      return (
                        <div
                          key={cand.id}
                          className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            {/* Relationship Source -> Type -> Target */}
                            <div className="flex items-center gap-2 text-xs flex-wrap">
                              <span className="font-bold text-white bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                                {srcEnt && renderEntityIcon(srcEnt.type)}
                                <span>{srcEnt ? srcEnt.name : cand.sourceId}</span>
                              </span>
                              <div className="flex items-center text-cyan-400 font-mono text-[11px] font-bold gap-1 px-1">
                                <ArrowRight className="w-3.5 h-3.5" />
                                <span>[{cand.type}]</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-bold text-white bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                                {tgtEnt && renderEntityIcon(tgtEnt.type)}
                                <span>{tgtEnt ? tgtEnt.name : cand.targetId}</span>
                              </span>
                            </div>

                            {/* Status badge */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-slate-300 font-bold">
                                Algorithmic Confidence: {(cand.confidence * 100).toFixed(0)}%
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full font-mono ${
                                  cand.status === 'approved'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : cand.status === 'rejected'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                {cand.status}
                              </span>
                            </div>
                          </div>

                          {/* Reasoning & Evidence Ref */}
                          <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                            <strong className="text-cyan-300">Extraction Corroboration:</strong> {cand.suggestedReason}
                          </p>

                          {/* Approve / Reject Actions */}
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-400 font-mono">
                              Evidentiary Citation: {cand.evidenceId}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => rejectCandidate(cand.id)}
                                disabled={cand.status === 'rejected'}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                  cand.status === 'rejected'
                                    ? 'bg-rose-950/50 text-rose-400 border border-rose-800/50 cursor-not-allowed'
                                    : 'bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-700'
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Dismiss Lead</span>
                              </button>

                              <button
                                onClick={() => approveCandidate(cand.id)}
                                disabled={cand.status === 'approved'}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                                  cand.status === 'approved'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                                }`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>{cand.status === 'approved' ? 'Verified in Graph' : 'Approve & Link'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveTab('network')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 transition-all shadow-lg shadow-blue-950"
                  >
                    <span>View in Link Graph</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
