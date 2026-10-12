import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  InvestigationCase,
  Entity,
  Relationship,
  CandidateRelationship,
  EvidenceItem,
  FinancialTransaction,
  CallRecord,
  ActivityLog,
} from '../types';
import {
  INITIAL_CASES,
  INITIAL_ENTITIES,
  INITIAL_RELATIONSHIPS,
  INITIAL_CANDIDATES,
  INITIAL_EVIDENCE,
  INITIAL_TRANSACTIONS,
  INITIAL_CALL_RECORDS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/initialData';

export type ActiveTab = 'dashboard' | 'cases' | 'network' | 'financial' | 'reports';

interface PresentationState {
  isActive: boolean;
  step: number; // 1 to 7
  title: string;
  note: string;
}

interface InvestigationContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  selectedCase: InvestigationCase;
  
  cases: InvestigationCase[];
  entities: Entity[];
  relationships: Relationship[];
  candidates: CandidateRelationship[];
  evidence: EvidenceItem[];
  transactions: FinancialTransaction[];
  callRecords: CallRecord[];
  activityLogs: ActivityLog[];

  // Candidate Actions
  approveCandidate: (candidateId: string) => void;
  rejectCandidate: (candidateId: string) => void;
  
  // Cases & Evidence interaction state
  casesSubTab: 'cases' | 'evidence';
  setCasesSubTab: (subTab: 'cases' | 'evidence') => void;
  selectedEvidenceId: string | null;
  setSelectedEvidenceId: (id: string | null) => void;
  isAnalyzingEvidence: boolean;
  setIsAnalyzingEvidence: (val: boolean) => void;

  // Network interaction state
  networkSelectedNodeId: string | null;
  setNetworkSelectedNodeId: (id: string | null) => void;
  networkHopCount: number;
  setNetworkHopCount: (hops: number) => void;

  // Authentication State
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  // Presentation Mode
  presentation: PresentationState;
  startPresentation: () => void;
  stopPresentation: () => void;
  nextPresentationStep: () => void;
  prevPresentationStep: () => void;

  // Reset
  resetDemoData: () => void;
}

const PRESENTATION_STEPS: { step: number; title: string; tab: ActiveTab; note: string }[] = [
  {
    step: 1,
    title: 'Phase 1: National Intelligence Grid Command Center',
    tab: 'dashboard',
    note: 'System-wide intelligence overview aggregating evidentiary records, biometric/KYC verified profiles, active threat tracking, and real-time operational feeds across 3 priority commands.',
  },
  {
    step: 2,
    title: 'Phase 2: Target Dossier — Operation Blue Ledger',
    tab: 'cases',
    note: 'Inspecting Primary Dossier (Financial Crimes Wing). Review executive case synopsis, working hypotheses, assigned supervisory officers, and catalog of high-risk suspect entities.',
  },
  {
    step: 3,
    title: 'Phase 3: Source Evidence Ingestion & FIR Audit',
    tab: 'cases',
    note: 'Reviewing First Information Report FIR-DEL-881. Verifying certified bank ledger statements showing suspicious ₹5,00,000 disbursement between primary targets Rahul Sharma and Amit Kumar.',
  },
  {
    step: 4,
    title: 'Phase 4: AI Neural Entity & Link Extraction Engine',
    tab: 'cases',
    note: 'Neural knowledge extraction parsing suspects, proxy bank accounts, SIM cards, IMEI numbers, and inferred relationships with algorithmic confidence scoring and direct evidentiary corroboration.',
  },
  {
    step: 5,
    title: 'Phase 5: Multi-Hop Network Graph & Syndicate Traversal',
    tab: 'network',
    note: 'Interactive topological link analysis. Execute 1 to 4 Hop BFS traversals and algorithmic shortest-path finding to uncover obscured intermediary mules and conduit nodes.',
  },
  {
    step: 6,
    title: 'Phase 6: Directional Financial Money Trail Tracking',
    tab: 'financial',
    note: 'Tracing the complete money laundering cycle: ₹5,00,000 disbursement → ₹3,00,000 intermediary layering → split payouts of ₹1,80,000 and ₹1,20,000 across beneficiary terminal accounts.',
  },
  {
    step: 7,
    title: 'Phase 7: Court-Admissible Intelligence Dossier & Export',
    tab: 'reports',
    note: 'Generating certified departmental briefing complete with evidentiary chain of custody, entity directories, transactional ledgers, and digital forensic audit stamps ready for PDF/CSV dispatch.',
  },
];

const LOCAL_STORAGE_KEY = 'criminal_network_intel_v2';

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('DEMO-001');

  const [cases] = useState<InvestigationCase[]>(INITIAL_CASES);
  const [entities, setEntities] = useState<Entity[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_entities`);
    return saved ? JSON.parse(saved) : INITIAL_ENTITIES;
  });
  const [relationships, setRelationships] = useState<Relationship[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_relationships`);
    return saved ? JSON.parse(saved) : INITIAL_RELATIONSHIPS;
  });
  const [candidates, setCandidates] = useState<CandidateRelationship[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_candidates`);
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });
  const [evidence] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [transactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [callRecords] = useState<CallRecord[]>(INITIAL_CALL_RECORDS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // UI interaction states
  const [casesSubTab, setCasesSubTab] = useState<'cases' | 'evidence'>('cases');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>('FIR-DEMO-001');
  const [isAnalyzingEvidence, setIsAnalyzingEvidence] = useState<boolean>(false);
  const [networkSelectedNodeId, setNetworkSelectedNodeId] = useState<string | null>('PER-001');
  const [networkHopCount, setNetworkHopCount] = useState<number>(4);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('crime_intel_auth') === 'true';
  });

  const login = () => {
    sessionStorage.setItem('crime_intel_auth', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('crime_intel_auth');
    setIsAuthenticated(false);
  };

  // Presentation Mode
  const [presentation, setPresentation] = useState<PresentationState>({
    isActive: false,
    step: 1,
    title: PRESENTATION_STEPS[0].title,
    note: PRESENTATION_STEPS[0].note,
  });

  // Persist modifications
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_entities`, JSON.stringify(entities));
  }, [entities]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_relationships`, JSON.stringify(relationships));
  }, [relationships]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_candidates`, JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_logs`, JSON.stringify(activityLogs));
  }, [activityLogs]);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const approveCandidate = (candidateId: string) => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    // Update candidate status
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'approved' } : c))
    );

    // If not already in relationships, add as approved relationship
    setRelationships((prev) => {
      const exists = prev.some((r) => r.id === candidateId);
      if (exists) {
        return prev.map((r) => (r.id === candidateId ? { ...r, status: 'approved' } : r));
      }
      const newRel: Relationship = {
        id: cand.id,
        sourceId: cand.sourceId,
        targetId: cand.targetId,
        type: cand.type,
        label: cand.label,
        evidenceId: cand.evidenceId,
        confidence: cand.confidence,
        status: 'approved',
        caseId: cand.caseId,
        details: cand.details,
      };
      return [...prev, newRel];
    });

    // Add activity log
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      caseId: cand.caseId,
      action: `Approved candidate link (${cand.label}) into active network graph.`,
      entityName: cand.label,
      user: 'Lead Investigator',
      badge: 'Verification',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const rejectCandidate = (candidateId: string) => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'rejected' } : c))
    );

    // Ensure it's removed from or marked rejected in relationships
    setRelationships((prev) => prev.filter((r) => r.id !== candidateId));

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      caseId: cand.caseId,
      action: `Dismissed candidate link (${cand.label}) based on analyst review.`,
      entityName: cand.label,
      user: 'Lead Investigator',
      badge: 'Verification',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const applyStepUI = (stepIndex: number) => {
    const stepConfig = PRESENTATION_STEPS[stepIndex - 1];
    if (!stepConfig) return;

    setPresentation({
      isActive: true,
      step: stepIndex,
      title: stepConfig.title,
      note: stepConfig.note,
    });

    setActiveTab(stepConfig.tab);

    if (stepIndex === 1) {
      // Dashboard
    } else if (stepIndex === 2) {
      setSelectedCaseId('DEMO-001');
      setCasesSubTab('cases');
    } else if (stepIndex === 3) {
      setSelectedCaseId('DEMO-001');
      setCasesSubTab('evidence');
      setSelectedEvidenceId('FIR-DEMO-001');
      setIsAnalyzingEvidence(false);
    } else if (stepIndex === 4) {
      setSelectedCaseId('DEMO-001');
      setCasesSubTab('evidence');
      setSelectedEvidenceId('FIR-DEMO-001');
      setIsAnalyzingEvidence(true);
    } else if (stepIndex === 5) {
      setSelectedCaseId('DEMO-001');
      setNetworkSelectedNodeId('PER-001');
      setNetworkHopCount(4);
    } else if (stepIndex === 6) {
      setSelectedCaseId('DEMO-001');
    } else if (stepIndex === 7) {
      setSelectedCaseId('DEMO-001');
    }
  };

  const startPresentation = () => {
    applyStepUI(1);
  };

  const stopPresentation = () => {
    setPresentation((prev) => ({ ...prev, isActive: false }));
  };

  const nextPresentationStep = () => {
    if (presentation.step < PRESENTATION_STEPS.length) {
      applyStepUI(presentation.step + 1);
    } else {
      stopPresentation();
    }
  };

  const prevPresentationStep = () => {
    if (presentation.step > 1) {
      applyStepUI(presentation.step - 1);
    }
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_entities`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_relationships`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_candidates`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_logs`);

    setEntities(INITIAL_ENTITIES);
    setRelationships(INITIAL_RELATIONSHIPS);
    setCandidates(INITIAL_CANDIDATES);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setSelectedCaseId('DEMO-001');
    setSelectedEvidenceId('FIR-DEMO-001');
    setIsAnalyzingEvidence(false);
    setNetworkSelectedNodeId('PER-001');
    setNetworkHopCount(4);
    setActiveTab('dashboard');
    stopPresentation();
  };

  return (
    <InvestigationContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCaseId,
        setSelectedCaseId,
        selectedCase,
        cases,
        entities,
        relationships,
        candidates,
        evidence,
        transactions,
        callRecords,
        activityLogs,
        approveCandidate,
        rejectCandidate,
        casesSubTab,
        setCasesSubTab,
        selectedEvidenceId,
        setSelectedEvidenceId,
        isAnalyzingEvidence,
        setIsAnalyzingEvidence,
        networkSelectedNodeId,
        setNetworkSelectedNodeId,
        networkHopCount,
        setNetworkHopCount,
        presentation,
        startPresentation,
        stopPresentation,
        nextPresentationStep,
        prevPresentationStep,
        resetDemoData,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
