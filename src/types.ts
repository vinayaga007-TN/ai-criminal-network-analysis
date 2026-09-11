export type ToolType = 
  | 'copilot'
  | 'network'
  | 'evidence-lab'
  | 'timeline'
  | 'anomalies'
  | 'key-entities'
  | 'reports'
  | 'audit-trail'
  | 'provenance';

export type EntityType = 'person' | 'organization' | 'phone' | 'location' | 'transaction' | 'event';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  alias?: string;
  role: string;
  investigationPriority: number; // 0 - 100
  priorityLevel: 'High' | 'Medium' | 'Low';
  degree: number;
  betweenness: number;
  pagerank: number;
  connectionsCount: number;
  organizationsCount: number;
  transactionsCount: number;
  potentialLeads: string[];
  requiresVerification: boolean;
  avatarUrl?: string;
  details: {
    aadhaarOrReg?: string;
    financialVolume?: string;
    lastSeenLocation?: string;
    notes?: string;
  };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'financial' | 'telephony' | 'associative' | 'location' | 'intermediary';
  detail: string;
  amount?: string;
  callsCount?: number;
  verified: boolean;
}

export interface EvidenceItem {
  id: string;
  title: string;
  documentNumber: string;
  type: 'FIR' | 'Seizure Memo' | 'Bank Ledger' | 'CDR Log' | 'CCTV' | 'Forensic Report';
  date: string;
  sha256: string;
  confidence: number;
  ocrStatus: 'decoded' | 'ocr_failed' | 'image_failed';
  source: string;
  processing: string;
  provenance: string;
  rawSnippet: string;
  extractedEntities: {
    name: string;
    type: EntityType;
    confidence: number;
    role: string;
  }[];
}

export interface AnomalyItem {
  id: string;
  title: string;
  entityName: string;
  entityId: string;
  severity: 'High' | 'Medium' | 'Low';
  detectionMethod: 'Rule-based' | 'Isolation Forest' | 'Telephony Heuristic' | 'Benford Analysis' | 'Spatiotemporal';
  description: string;
  requiresVerification: boolean;
  detectedAt: string;
  evidenceRef: string;
}

export interface TimelineItem {
  id: string;
  date: string;
  time: string;
  title: string;
  category: 'FIR' | 'Evidence' | 'Transaction' | 'Network' | 'Anomaly' | 'Hardware';
  description: string;
  evidenceId?: string;
  entityId?: string;
  requiresVerification?: boolean;
}

export interface ReportItem {
  id: string;
  title: string;
  category: string;
  dateGenerated: string;
  status: 'Ready' | 'Draft';
  summary: string;
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messagesCount: number;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  hash: string;
  details: string;
  blockNumber?: string;
  blockHash?: string;
  user?: string;
}

export type AuditLogItem = AuditRecord;

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  timestamp: string;
  text: string;
  keyConnections?: {
    entity: string;
    type: string;
    detail: string;
  }[];
  investigationLeads?: string[];
  evidenceSources?: {
    id: string;
    title: string;
    hash?: string;
  }[];
  confidence?: number;
  targetEntityId?: string;
  evidenceId?: string;
}
