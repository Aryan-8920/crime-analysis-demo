import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  ShieldAlert,
  Calendar,
  User,
  CreditCard,
  Phone,
  Laptop,
  Globe,
  Car,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  exportEntitiesToCSV,
  exportRelationshipsToCSV,
  exportTransactionsToCSV,
  formatINR,
} from '../../utils/exportUtils';

export const ReportsView: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    selectedCase,
    entities,
    relationships,
    candidates,
    evidence,
    transactions,
  } = useInvestigation();

  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Active case data
  const caseEntities = entities.filter((e) => e.caseId === selectedCaseId);
  const caseRelationships = relationships.filter(
    (r) => r.caseId === selectedCaseId && r.status === 'approved'
  );
  const caseCandidates = candidates.filter((c) => c.caseId === selectedCaseId);
  const caseEvidence = evidence.filter((ev) => ev.caseId === selectedCaseId);
  const caseTransactions = transactions.filter((t) => t.caseId === selectedCaseId);

  // Financial summary
  const totalFinancialVolume = caseTransactions.reduce((acc, t) => acc + t.amount, 0);

  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    exportEntitiesToCSV(caseEntities, `${selectedCase.id}_Entities`);
  };

  const handleDownloadRelationshipsCSV = () => {
    exportRelationshipsToCSV(caseRelationships, `${selectedCase.id}_Relationships`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Investigation Intelligence Briefing & Reports
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate verifiable intelligence dossiers distinguishing recorded facts from candidate leads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-[#030612] border border-[#172b57] text-slate-100 text-xs font-semibold rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00f2fe]"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setPreviewModalOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-[#00f2fe] border border-blue-500/40 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full Screen Preview</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#060e24] hover:bg-[#091535] text-slate-200 border border-[#142346] flex items-center gap-1.5 transition-colors"
            title="Download Entities CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#00f2fe] hover:bg-cyan-300 text-slate-950 flex items-center gap-1.5 transition-all shadow-md shadow-[#00f2fe]/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main Official Intelligence Document Container */}
      <div className="bg-[#060e24]/95 border border-[#142346] rounded-xl p-8 space-y-8 shadow-2xl max-w-5xl mx-auto print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-[#142346] pb-6 flex flex-col md:flex-row md:items-start justify-between gap-6 print:border-black">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#071333] text-[#00f2fe] border border-[#00f2fe]/40 text-[10px] font-mono font-bold tracking-wider uppercase mb-2 print:bg-gray-100 print:text-black print:border-gray-400">
              Confidential Investigation Briefing
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase print:text-black">
              AI-Powered Criminal Network Analysis System
            </h1>
            <p className="text-xs text-[#00f2fe] font-semibold tracking-wide print:text-gray-700">
              “From Fragmented Evidence to Connected Investigation Intelligence.”
            </p>
          </div>

          <div className="text-right text-xs space-y-1 print:text-black font-mono">
            <div>
              <span className="text-slate-400 print:text-gray-600">Case ID: </span>
              <strong className="text-[#00f2fe] font-bold print:text-black">{selectedCase.id}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-600">Generated: </span>
              <strong className="text-slate-200 print:text-black">{reportDate}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-600">Investigator: </span>
              <strong className="text-slate-200 print:text-black">{selectedCase.leadInvestigator}</strong>
            </div>
          </div>
        </div>

        {/* Case Meta Box */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#030612] border border-[#142346] print:bg-gray-50 print:border-gray-300 print:text-black text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-500 block">Case Title</span>
            <strong className="text-white print:text-black mt-0.5 block">{selectedCase.title}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-500 block">Category</span>
            <span className="text-slate-200 print:text-black mt-0.5 block">{selectedCase.category}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-500 block">Priority & Status</span>
            <span className="text-amber-400 print:text-black font-bold mt-0.5 block">
              {selectedCase.priority} / {selectedCase.status}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-500 block">Identified Entities</span>
            <span className="text-[#00f2fe] print:text-black font-bold mt-0.5 block">
              {caseEntities.length} Entities ({caseRelationships.length} Links)
            </span>
          </div>
        </div>

        {/* 1. Case Summary & Core Hypothesis */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black border-b border-[#142346] print:border-gray-300 pb-1 flex items-center gap-2">
            <span className="font-mono text-[#00f2fe]">1.0</span> Case Summary & Working Hypothesis
          </h3>
          <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
            {selectedCase.description}
          </p>
          <div className="p-3 rounded-lg bg-[#030612]/70 border border-[#142346] print:bg-gray-100 print:border-gray-300 text-xs">
            <strong className="text-[#00f2fe] print:text-black">Investigation Lead Hypothesis: </strong>
            <span className="text-slate-300 print:text-gray-800">{selectedCase.keyHypothesis}</span>
          </div>
        </div>

        {/* 2. Evidence Reviewed Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black border-b border-slate-800 print:border-gray-300 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400">2.0</span> Evidence Items Reviewed ({caseEvidence.length})
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-800 print:border-gray-300 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-gray-700 text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">Evidence ID</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Title & Source Agency</th>
                  <th className="py-2 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-300">
                {caseEvidence.map((ev) => (
                  <tr key={ev.id}>
                    <td className="py-2 px-3 font-mono font-bold text-cyan-300 print:text-black">
                      {ev.id}
                    </td>
                    <td className="py-2 px-3 text-slate-300 print:text-black">{ev.type}</td>
                    <td className="py-2 px-3">
                      <strong className="text-white print:text-black block">{ev.title}</strong>
                      <span className="text-[10px] text-slate-400 print:text-gray-600">{ev.sourceAgency}</span>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-400 print:text-black">
                      {ev.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Identified Entities Directory */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black border-b border-slate-800 print:border-gray-300 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400">3.0</span> Identified Entities Directory ({caseEntities.length})
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-800 print:border-gray-300 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-gray-700 text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">Entity ID</th>
                  <th className="py-2 px-3">Name / Entity</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Identifier</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3 text-right">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-300 font-medium">
                {caseEntities.map((ent) => (
                  <tr key={ent.id}>
                    <td className="py-2 px-3 font-mono text-slate-400 print:text-gray-700">{ent.id}</td>
                    <td className="py-2 px-3 font-bold text-white print:text-black">{ent.name}</td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-300 print:text-black capitalize">
                      {ent.type.replace('_', ' ')}
                    </td>
                    <td className="py-2 px-3 font-mono text-cyan-300 print:text-black text-[11px]">
                      {ent.identifier}
                    </td>
                    <td className="py-2 px-3 text-slate-400 print:text-gray-700 text-[11px]">
                      {ent.role || 'Subject'}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-rose-400 print:text-black">
                      {ent.riskScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Distinction: Recorded Facts vs Candidate Leads */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black border-b border-slate-800 print:border-gray-300 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400">4.0</span> Recorded Facts vs Candidate Leads
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Approved Facts */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-300 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 print:text-black text-xs font-bold uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-black" />
                <span>Approved Recorded Facts ({caseRelationships.length})</span>
              </div>
              <p className="text-[11px] text-slate-400 print:text-gray-600">
                Relationships substantiated by verified banking vouchers, certified CDR towers, or signed FIRs.
              </p>
              <div className="space-y-1 text-xs">
                {caseRelationships.slice(0, 5).map((r) => (
                  <div key={r.id} className="font-mono text-[11px] text-slate-300 print:text-black flex justify-between">
                    <span>{r.label || r.type}</span>
                    <span className="text-slate-400 print:text-gray-500">{r.evidenceId}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Relationships */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-300 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 print:text-black text-xs font-bold uppercase">
                <AlertTriangle className="w-4 h-4 text-amber-400 print:text-black" />
                <span>AI-Assisted Candidate Leads ({caseCandidates.length})</span>
              </div>
              <p className="text-[11px] text-slate-400 print:text-gray-600">
                Rule-based candidate extractions awaiting corroborative investigator verification.
              </p>
              <div className="space-y-1 text-xs">
                {caseCandidates.map((c) => (
                  <div key={c.id} className="text-[11px] text-slate-300 print:text-black flex justify-between">
                    <span className="truncate pr-2 font-medium">{c.label} ({c.type})</span>
                    <span className="font-mono text-cyan-300 print:text-black flex-shrink-0">
                      {(c.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Financial Trail Summary (if applicable) */}
        {caseTransactions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black border-b border-slate-800 print:border-gray-300 pb-1 flex items-center gap-2">
              <span className="font-mono text-cyan-400">5.0</span> Financial Trail Summary (Total: {formatINR(totalFinancialVolume)})
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-800 print:border-gray-300 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-gray-700 text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Txn ID</th>
                    <th className="py-2 px-3">Source Account</th>
                    <th className="py-2 px-3">Destination Account</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                    <th className="py-2 px-3">Mode</th>
                    <th className="py-2 px-3 text-right">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-gray-300 font-mono">
                  {caseTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-2 px-3 text-slate-400 print:text-black">{tx.id}</td>
                      <td className="py-2 px-3 text-white print:text-black">{tx.sourceAccountNum}</td>
                      <td className="py-2 px-3 text-white print:text-black">{tx.destAccountNum}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-400 print:text-black">
                        {formatINR(tx.amount)}
                      </td>
                      <td className="py-2 px-3 text-slate-300 print:text-black">{tx.transferType}</td>
                      <td className="py-2 px-3 text-right text-cyan-300 print:text-black">{tx.evidenceId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Key Investigation Leads & Recommendations */}
        <div className="space-y-2 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black border-b border-slate-800 print:border-gray-300 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400">6.0</span> Key Investigation Leads
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-300 print:text-gray-800 leading-relaxed">
            <li>
              Follow 4-hop intermediary links between primary source targets and recipient accounts.
            </li>
            <li>
              Submit formal Section 91 notices for unverified telecom cells and IP egress proxies.
            </li>
            <li>
              Conduct forensic audit on intermediate split terminals (ACC-DEMO-3003) for undisclosed beneficial ownerships.
            </li>
          </ul>
        </div>

        {/* 7. Data Limitations & Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 print:bg-gray-100 print:border-gray-400 print:text-gray-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-400 print:text-black uppercase text-[10px]">
            <ShieldAlert className="w-4 h-4 text-amber-400 print:text-black" />
            <span>Operational Caveats & Data Limitations</span>
          </div>
          <p className="leading-relaxed">
            All people, cases, accounts, communications, and relationships shown in this demonstration are fictional. Network connections are analytical leads and do not prove criminal activity. The system supports investigation and evidence review; it does not establish guilt.
          </p>
        </div>

        {/* Signatures for Court / Departmental Filing */}
        <div className="pt-8 border-t border-slate-800 print:border-black flex justify-between items-end text-xs text-slate-400 print:text-black">
          <div>
            <p className="font-mono text-[10px]">DIGITAL FORENSIC AUDIT STAMP</p>
            <p className="text-cyan-400 print:text-black font-semibold mt-1 font-mono">
              CERT-SHA256: 8F2A-99B1-E37C-0044-A789
            </p>
          </div>
          <div className="text-right">
            <div className="w-48 border-b border-slate-600 print:border-black mb-1"></div>
            <p className="font-bold text-slate-200 print:text-black">{selectedCase.leadInvestigator}</p>
            <p className="text-[10px] text-slate-400 print:text-gray-600">Supervisory Investigating Officer</p>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-bold uppercase">
                  Dossier Preview Mode
                </span>
                <h3 className="text-lg font-black text-white uppercase font-mono mt-1">
                  {selectedCase.id}: {selectedCase.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-3 font-mono">
              <p className="text-cyan-300 font-bold">CASE STATUS: {selectedCase.status} • PRIORITY: {selectedCase.priority}</p>
              <p>{selectedCase.description}</p>
              <p className="text-slate-400">Total Entities Mapped: {caseEntities.length} | Evidence Items: {caseEvidence.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
