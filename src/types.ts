export type EntityType = 'person' | 'bank_account' | 'phone' | 'device' | 'ip_address' | 'vehicle';

export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type CaseStatus = 'Under Investigation' | 'Active Surveillance' | 'Forensic Audit' | 'Closed';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  identifier: string; // Account number, phone number, MAC, IP, etc.
  riskScore: number; // 0-100
  caseId: string;
  role?: string;
  details?: Record<string, string | number>;
  verified: boolean;
}

export type RelationshipType = 
  | 'TRANSACTED_TO'
  | 'CALL_RECORD'
  | 'HOLDS_ACCOUNT'
  | 'USED_DEVICE'
  | 'ACCESSED_IP'
  | 'ASSOCIATED_WITH'
  | 'REGISTERED_OWNER'
  | 'SHARED_LOCATION';

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  label: string;
  evidenceId: string;
  confidence: number; // 0.0 - 1.0
  status: 'approved' | 'pending' | 'rejected';
  caseId: string;
  details?: {
    amount?: number;
    callCount?: number;
    duration?: string;
    timestamp?: string;
    protocol?: string;
    notes?: string;
  };
}

export interface CandidateRelationship extends Relationship {
  suggestedReason: string;
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  title: string;
  type: 'FIR' | 'Bank Statement' | 'CDR' | 'IP Access Log' | 'Forensic Report';
  sourceAgency: string;
  timestamp: string;
  content: string;
  relatedEntityIds: string[];
  extractedCandidatesCount: number;
}

export interface FinancialTransaction {
  id: string;
  caseId: string;
  sourceAccountId: string; // references Entity id (e.g. ACC-DEMO-1001)
  destinationAccountId: string; // references Entity id (e.g. ACC-DEMO-2002)
  sourceAccountNum: string;
  destAccountNum: string;
  sourceHolder: string;
  destHolder: string;
  amount: number;
  timestamp: string;
  evidenceId: string;
  transferType: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI';
  referenceNo: string;
  notes: string;
}

export interface CallRecord {
  id: string;
  caseId: string;
  callerPhoneId: string;
  receiverPhoneId: string;
  callerNumber: string;
  receiverNumber: string;
  callerName: string;
  receiverName: string;
  timestamp: string;
  durationSeconds: number;
  cellTowerLocation: string;
  evidenceId: string;
}

export interface InvestigationCase {
  id: string;
  title: string;
  category: string;
  priority: PriorityLevel;
  status: CaseStatus;
  description: string;
  leadInvestigator: string;
  openedDate: string;
  lastUpdated: string;
  entityCount: number;
  evidenceCount: number;
  keyHypothesis: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  caseId: string;
  action: string;
  entityName?: string;
  user: string;
  badge: 'Extraction' | 'Verification' | 'Transaction' | 'Network' | 'Evidence';
}
