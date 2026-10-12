import React, { useState, useMemo, useEffect } from 'react';
import {
  CircleDollarSign,
  ArrowRight,
  TrendingUp,
  Download,
  Filter,
  AlertCircle,
  FileText,
  Landmark,
  Eye,
  RotateCcw,
  Play,
  Pause,
  Zap,
  Layers,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { FinancialTransaction } from '../../types';
import { formatINR, exportTransactionsToCSV } from '../../utils/exportUtils';

export const FinancialTrailView: React.FC = () => {
  const {
    selectedCaseId,
    setSelectedCaseId,
    selectedCase,
    cases,
    transactions,
    entities,
    setSelectedEvidenceId,
    setCasesSubTab,
    setActiveTab,
  } = useInvestigation();

  // Selected account for filtering/highlighting
  const [selectedAccountNum, setSelectedAccountNum] = useState<string>('ALL');
  const [highlightTrailActive, setHighlightTrailActive] = useState<boolean>(false);
  const [selectedTxn, setSelectedTxn] = useState<FinancialTransaction | null>(null);

  // Dynamic Flow Playback Stepper
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [playbackStage, setPlaybackStage] = useState<number>(0);

  // Filter transactions by active case
  const caseTransactions = useMemo(
    () => transactions.filter((t) => t.caseId === selectedCaseId),
    [transactions, selectedCaseId]
  );

  // Distinct accounts in active case transactions
  const accountsInCase = useMemo(() => {
    const accSet = new Set<string>();
    caseTransactions.forEach((t) => {
      accSet.add(t.sourceAccountNum);
      accSet.add(t.destAccountNum);
    });
    return Array.from(accSet);
  }, [caseTransactions]);

  // Dynamic calculations from actual transactions:
  // Outgoing, Incoming, Net, Connected Accounts
  const accountStats = useMemo(() => {
    const stats: Record<
      string,
      {
        totalOutgoing: number;
        totalIncoming: number;
        outgoingCount: number;
        incomingCount: number;
        connectedAccounts: Set<string>;
      }
    > = {};

    accountsInCase.forEach((acc) => {
      stats[acc] = {
        totalOutgoing: 0,
        totalIncoming: 0,
        outgoingCount: 0,
        incomingCount: 0,
        connectedAccounts: new Set<string>(),
      };
    });

    caseTransactions.forEach((t) => {
      if (stats[t.sourceAccountNum]) {
        stats[t.sourceAccountNum].totalOutgoing += t.amount;
        stats[t.sourceAccountNum].outgoingCount += 1;
        stats[t.sourceAccountNum].connectedAccounts.add(t.destAccountNum);
      }
      if (stats[t.destAccountNum]) {
        stats[t.destAccountNum].totalIncoming += t.amount;
        stats[t.destAccountNum].incomingCount += 1;
        stats[t.destAccountNum].connectedAccounts.add(t.sourceAccountNum);
      }
    });

    return stats;
  }, [accountsInCase, caseTransactions]);

  // Overall totals
  const totalVolume = useMemo(
    () => caseTransactions.reduce((acc, t) => acc + t.amount, 0),
    [caseTransactions]
  );

  // Highlighted transactions logic:
  const filteredTransactions = useMemo(() => {
    if (selectedAccountNum === 'ALL') return caseTransactions;
    if (highlightTrailActive) {
      return caseTransactions.filter(
        (t) => t.sourceAccountNum === selectedAccountNum || t.destAccountNum === selectedAccountNum
      );
    }
    return caseTransactions.filter(
      (t) => t.sourceAccountNum === selectedAccountNum || t.destAccountNum === selectedAccountNum
    );
  }, [caseTransactions, selectedAccountNum, highlightTrailActive]);

  // Flow Playback sequence timer
  useEffect(() => {
    if (!isPlayingSequence) return;
    const stages = ['ACC-DEMO-1001', 'ACC-DEMO-2002', 'ACC-DEMO-3003', 'ACC-DEMO-4004'];
    const timer = setInterval(() => {
      setPlaybackStage((prev) => {
        const next = (prev + 1) % stages.length;
        setSelectedAccountNum(stages[next]);
        setHighlightTrailActive(true);
        return next;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [isPlayingSequence]);

  const handleClearSelection = () => {
    setSelectedAccountNum('ALL');
    setHighlightTrailActive(false);
    setSelectedTxn(null);
    setIsPlayingSequence(false);
  };

  const handleExportCSV = () => {
    exportTransactionsToCSV(caseTransactions, selectedCase.title);
  };

  const hasNoPath = selectedAccountNum !== 'ALL' && filteredTransactions.length === 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header and Case Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white tracking-tight uppercase font-mono">
              Directional Financial Trail & Fund Flow
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking inter-bank wire transfers across placement, layering, and integration accounts.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedCaseId !== 'DEMO-001' && (
            <button
              onClick={() => setSelectedCaseId('DEMO-001')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Load Operation Blue Ledger</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg glow-emerald">
          <span className="text-xs text-slate-400 font-bold uppercase font-mono">Recorded Transfers</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {caseTransactions.length}
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">VERIFIED</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">FIU-IND certified transactions</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 font-bold uppercase font-mono">Total Audited Volume</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {formatINR(totalVolume)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cumulative transacted volume</p>
        </div>

        <div className="bg-[#060e24]/90 border border-[#142346] rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 font-bold uppercase font-mono">Identified Accounts</span>
          <div className="mt-2">
            <span className="text-3xl font-black text-white font-mono">
              {accountsInCase.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Inter-bank clearing endpoints</p>
        </div>

        <div className="bg-[#060e24]/90 border border-[#142346] rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 font-bold uppercase font-mono">Layering Stages</span>
          <div className="mt-2">
            <span className="text-3xl font-black text-[#00f2fe] font-mono">3 Stages</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Origin → Conduit → Split Terminal</p>
        </div>
      </div>

      {/* Account Selector & Flow Playback Toolbar */}
      <div className="bg-[#060e24]/90 border border-[#142346] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Filter className="w-3.5 h-3.5 text-[#00f2fe]" />
            Inspect Flow:
          </span>

          <select
            value={selectedAccountNum}
            onChange={(e) => {
              setSelectedAccountNum(e.target.value);
              setIsPlayingSequence(false);
            }}
            className="bg-[#030612] border border-[#172b57] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#00f2fe] font-semibold"
          >
            <option value="ALL">All Accounts (Complete Trail)</option>
            {accountsInCase.map((acc) => {
              const ent = entities.find((e) => e.identifier === acc);
              return (
                <option key={acc} value={acc}>
                  {acc} {ent ? `(${ent.name})` : ''}
                </option>
              );
            })}
          </select>

          <button
            onClick={() => {
              setHighlightTrailActive(true);
              setIsPlayingSequence(false);
            }}
            disabled={selectedAccountNum === 'ALL'}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
              selectedAccountNum === 'ALL'
                ? 'bg-slate-800/40 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Highlight Trail</span>
          </button>

          {/* Dynamic Fund Movement Playback Button */}
          <button
            onClick={() => setIsPlayingSequence(!isPlayingSequence)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all border ${
              isPlayingSequence
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 ring-1 ring-amber-500/30 animate-pulse'
                : 'bg-[#030612] hover:bg-[#071333] text-cyan-300 border-[#172b57]'
            }`}
          >
            {isPlayingSequence ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlayingSequence ? 'Pause Trail Playback' : 'Simulate Money Flow'}</span>
          </button>

          <button
            onClick={handleClearSelection}
            className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-[#071333] transition-colors flex items-center gap-1 font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Displaying {filteredTransactions.length} of {caseTransactions.length} wire transfers
        </div>
      </div>

      {/* If No Path Exists Notification */}
      {hasNoPath && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>No recorded path found in the current evidence.</span>
        </div>
      )}

      {/* Visual Directional Flow Sequence (Operation Blue Ledger) */}
      {selectedCaseId === 'DEMO-001' && (
        <div className="bg-[#040817]/95 border border-[#142346] rounded-2xl p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Directional Flow Pathway (Operation Blue Ledger)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#00f2fe] bg-[#071333] px-2.5 py-0.5 rounded border border-[#00f2fe]/40 font-bold">
              4 Audited Transfers
            </span>
          </div>

          {/* Interactive Flow Pathway */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 relative">
            {/* Step 1: ACC-DEMO-1001 */}
            <div
              onClick={() => {
                setSelectedAccountNum('ACC-DEMO-1001');
                setHighlightTrailActive(true);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedAccountNum === 'ACC-DEMO-1001'
                  ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl'
                  : 'bg-[#060e24]/90 border-[#142346] hover:border-[#1e3a75]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-emerald-400 font-black">STAGE 1: ORIGIN</span>
                <span className="text-slate-300">PAN-9012A</span>
              </div>
              <h4 className="mt-1.5 font-bold text-white text-xs font-mono">ACC-DEMO-1001</h4>
              <p className="text-[11px] text-cyan-300 font-semibold">Rahul Sharma</p>
              <div className="mt-2.5 pt-2 border-t border-[#142346] text-[10px] text-slate-300 flex justify-between font-mono">
                <span>Outflow:</span>
                <strong className="text-rose-400 font-bold">₹5,00,000</strong>
              </div>
            </div>

            {/* Step 2: ACC-DEMO-2002 */}
            <div
              onClick={() => {
                setSelectedAccountNum('ACC-DEMO-2002');
                setHighlightTrailActive(true);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedAccountNum === 'ACC-DEMO-2002'
                  ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl'
                  : 'bg-[#060e24]/90 border-[#142346] hover:border-[#1e3a75]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-[#00f2fe] font-black">STAGE 2: CONDUIT</span>
                <span>RTGS</span>
              </div>
              <h4 className="mt-1.5 font-bold text-white text-xs font-mono">ACC-DEMO-2002</h4>
              <p className="text-[11px] text-cyan-300 font-semibold">Amit Kumar</p>
              <div className="mt-2.5 pt-2 border-t border-[#142346] text-[10px] text-slate-300 flex justify-between font-mono">
                <span>In: ₹5,00,000</span>
                <span>Out: ₹3,00,000</span>
              </div>
            </div>

            {/* Step 3: ACC-DEMO-3003 */}
            <div
              onClick={() => {
                setSelectedAccountNum('ACC-DEMO-3003');
                setHighlightTrailActive(true);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedAccountNum === 'ACC-DEMO-3003'
                  ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl'
                  : 'bg-[#060e24]/90 border-[#142346] hover:border-[#1e3a75]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-amber-400 font-black">STAGE 3: SPLITTER</span>
                <span>NEFT</span>
              </div>
              <h4 className="mt-1.5 font-bold text-white text-xs font-mono">ACC-DEMO-3003</h4>
              <p className="text-[11px] text-cyan-300 font-semibold">Rohit Verma</p>
              <div className="mt-2.5 pt-2 border-t border-[#142346] text-[10px] text-slate-300 flex justify-between font-mono">
                <span>In: ₹3,00,000</span>
                <span>Split: ₹3,00,000</span>
              </div>
            </div>

            {/* Step 4: Split Beneficiaries */}
            <div className="space-y-2">
              <div
                onClick={() => {
                  setSelectedAccountNum('ACC-DEMO-4004');
                  setHighlightTrailActive(true);
                }}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                  selectedAccountNum === 'ACC-DEMO-4004'
                    ? 'bg-emerald-950/70 border-emerald-400 ring-1 ring-emerald-400/30'
                    : 'bg-[#060e24]/90 border-[#142346] hover:border-[#1e3a75]'
                }`}
              >
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span className="font-bold text-[#00f2fe]">BENEFICIARY A</span>
                  <span className="text-emerald-400 font-bold">₹1,80,000</span>
                </div>
                <div className="font-bold text-white text-xs mt-0.5">ACC-DEMO-4004 (Vikas Singh)</div>
              </div>

              <div
                onClick={() => {
                  setSelectedAccountNum('ACC-DEMO-5005');
                  setHighlightTrailActive(true);
                }}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                  selectedAccountNum === 'ACC-DEMO-5005'
                    ? 'bg-emerald-950/70 border-emerald-400 ring-1 ring-emerald-400/30'
                    : 'bg-[#060e24]/90 border-[#142346] hover:border-[#1e3a75]'
                }`}
              >
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span className="font-bold text-[#00f2fe]">BENEFICIARY B</span>
                  <span className="text-emerald-400 font-bold">₹1,20,000</span>
                </div>
                <div className="font-bold text-white text-xs mt-0.5">ACC-DEMO-5005 (Neeraj Gupta)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Account Ledger Table */}
      <div className="bg-[#060e24]/90 border border-[#142346] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#142346] flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Certified Wire Transfers Ledger ({filteredTransactions.length})
          </h3>
          <span className="text-xs text-slate-400">Click any row to inspect certified audit statement</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#030612] text-slate-400 text-[10px] uppercase font-mono tracking-wider border-b border-[#142346]">
              <tr>
                <th className="py-3 px-4">Txn Ref</th>
                <th className="py-3 px-4">Source Account & Holder</th>
                <th className="py-3 px-4">Beneficiary Account & Holder</th>
                <th className="py-3 px-4">Transfer Mode</th>
                <th className="py-3 px-4 text-right">Amount (INR)</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Evidence Citation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTxn(tx)}
                  className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-cyan-300">{tx.id}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{tx.referenceNo}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-white">{tx.sourceAccountNum}</span>
                    <span className="block text-[11px] text-slate-400">{tx.sourceHolder}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-white">{tx.destAccountNum}</span>
                    <span className="block text-[11px] text-slate-400">{tx.destHolder}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {tx.transferType}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      {formatINR(tx.amount)}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {tx.timestamp}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="font-mono text-cyan-400 text-[11px] bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800 font-bold">
                      {tx.evidenceId}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Transaction Detail Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  Core Banking Voucher
                </span>
                <h3 className="mt-1.5 text-base font-black text-white font-mono">{selectedTxn.id}</h3>
                <p className="text-xs font-mono text-slate-400">Ref: {selectedTxn.referenceNo}</p>
              </div>
              <span className="text-xl font-black font-mono text-emerald-400">
                {formatINR(selectedTxn.amount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block font-mono">Originating Account</span>
                <p className="font-mono font-bold text-white mt-1">{selectedTxn.sourceAccountNum}</p>
                <p className="text-slate-400 text-[11px]">{selectedTxn.sourceHolder}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block font-mono">Beneficiary Account</span>
                <p className="font-mono font-bold text-white mt-1">{selectedTxn.destAccountNum}</p>
                <p className="text-slate-400 text-[11px]">{selectedTxn.destHolder}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Auditor Notes</span>
              <p className="text-slate-300 leading-relaxed">{selectedTxn.notes}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setSelectedEvidenceId(selectedTxn.evidenceId);
                  setCasesSubTab('evidence');
                  setActiveTab('cases');
                  setSelectedTxn(null);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors font-mono"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Inspect Evidence ({selectedTxn.evidenceId})</span>
              </button>

              <button
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
