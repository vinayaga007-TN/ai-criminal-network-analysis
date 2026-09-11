import { Entity, NetworkEdge, EvidenceItem, AnomalyItem, TimelineItem, ReportItem, AuditRecord, ChatMessage } from '../types';

export const CASE_METADATA = {
  caseId: 'NX-2047',
  title: 'Urban Chain-Snatching & Gold Fencing Syndicate',
  jurisdiction: 'Crime Branch Special Cell (Delhi HQ)',
  leadAnalyst: 'Inv. Insp. S. Roy',
  status: 'ACTIVE INVESTIGATION',
  clearanceLevel: 'RESTRICTED / LAW ENFORCEMENT ONLY',
  nodeCount: 51,
  edgeCount: 66,
  communityCount: 4,
  anomalyCount: 7,
  density: 0.38,
  modularity: 0.62,
  blockchainBlock: '#1,402',
  securityLevel: 'ENCR-AES256',
};

export const CASE_ENTITIES: Entity[] = [
  {
    id: 'ent-deepak-mehta',
    name: 'Deepak Mehta',
    type: 'person',
    alias: 'D-Bhai / Munna',
    role: 'Suspected Receiver & Intermediary Anchor',
    investigationPriority: 63.2,
    priorityLevel: 'Medium',
    degree: 12,
    betweenness: 0.89,
    pagerank: 0.094,
    connectionsCount: 12,
    organizationsCount: 3,
    transactionsCount: 14,
    potentialLeads: [
      'Multiple incoming transactions totaling ₹18.4L in 6 tranches from Om Enterprises flagged under Rule #402',
      'Cross-community bridge connection between legitimate wholesale front Prakash Traders and street snatchers',
      'Spatiotemporal co-presence: Cell tower hit (Sec-18 Tower ID-449) matches timestamp of FIR-204/2026 within 120m radius',
    ],
    requiresVerification: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    details: {
      aadhaarOrReg: '•••• 8812 (Delhi Central)',
      financialVolume: '₹42.8 Lakh (14 Traces)',
      lastSeenLocation: 'Sector 18 Commercial Market, Basement B-2',
      notes: 'Acts as primary financial conduit. Operates nominal wholesale electronics stall as cover for melted bullion transfers.',
    },
  },
  {
    id: 'ent-suresh-yadav',
    name: 'Suresh Yadav',
    type: 'person',
    alias: 'Rider Cell Lead',
    role: 'Field Operative Handler',
    investigationPriority: 58.4,
    priorityLevel: 'Medium',
    degree: 9,
    betweenness: 0.74,
    pagerank: 0.078,
    connectionsCount: 9,
    organizationsCount: 1,
    transactionsCount: 6,
    potentialLeads: [
      '42 calls over 14 days directly to Deepak Mehta on unregistered burner SIM',
      'Matches witness description of pillion rider in FIR No. 204/2026 at Subhash Chowk',
      'Rapid SIM churn: 3 numbers rotated in 9 days prior to seizure memo',
    ],
    requiresVerification: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    details: {
      aadhaarOrReg: '•••• 3190 (Noida Sec-62)',
      financialVolume: '₹6.2 Lakh (Cash & UPI)',
      lastSeenLocation: 'Subhash Chowk, Sector 18',
      notes: 'Coordinates getaway motorbikes and delivers snatched gold chains directly to melting points.',
    },
  },
  {
    id: 'ent-kavita-nair',
    name: 'Kavita Nair',
    type: 'person',
    alias: 'K-Maam',
    role: 'Account Signatory & Compliance Officer',
    investigationPriority: 48.7,
    priorityLevel: 'Medium',
    degree: 7,
    betweenness: 0.62,
    pagerank: 0.061,
    connectionsCount: 7,
    organizationsCount: 2,
    transactionsCount: 8,
    potentialLeads: [
      'Authorized digital signature holder for Om Enterprises shell entity bank accounts',
      'Transferred ₹3.5L to Prakash Traders 48 hours before the snatching incident series',
      'Shared IP logins with Deepak Mehta on corporate banking portal',
    ],
    requiresVerification: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    details: {
      aadhaarOrReg: '•••• 4419 (South Delhi)',
      financialVolume: '₹28.1 Lakh',
      lastSeenLocation: 'Nehru Place Financial Complex',
      notes: 'Manages ledger compliance and corporate filings. No prior criminal record; potential coerced or paid signatory.',
    },
  },
  {
    id: 'ent-gaurav-g',
    name: 'Gaurav G.',
    type: 'person',
    alias: 'Gold Chhotu',
    role: 'Melter & Metallurgical Craftsman',
    investigationPriority: 52.3,
    priorityLevel: 'Medium',
    degree: 6,
    betweenness: 0.51,
    pagerank: 0.055,
    connectionsCount: 6,
    organizationsCount: 1,
    transactionsCount: 9,
    potentialLeads: [
      'Operates small-scale crucible furnace inside Karol Bagh jewellery basement',
      'Receives unrefined gold chains within 45 minutes of snatching incidents',
      'Converted 420g crude gold ingot seized under Seizure Memo EVD-FIR-2026-0882',
    ],
    requiresVerification: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    details: {
      aadhaarOrReg: '•••• 7012 (Central Delhi)',
      financialVolume: '₹14.5 Lakh',
      lastSeenLocation: 'Karol Bagh Bullion Lane',
      notes: 'Melts ornaments into crude bars to eradicate engraved serial numbers and hallmarks.',
    },
  },
  {
    id: 'ent-prakash-traders',
    name: 'Prakash Traders',
    type: 'organization',
    alias: 'PT Wholesale',
    role: 'Wholesale Shell Entity',
    investigationPriority: 52.1,
    priorityLevel: 'Medium',
    degree: 8,
    betweenness: 0.69,
    pagerank: 0.071,
    connectionsCount: 8,
    organizationsCount: 0,
    transactionsCount: 18,
    potentialLeads: [
      'Zero commercial sales tax filings despite ₹18.4L turnover in single month',
      'Registered director listed as Deepak Mehta in ROC filings ROC-771',
      'Account used for high-velocity cash withdrawals following wire deposits',
    ],
    requiresVerification: true,
    details: {
      aadhaarOrReg: 'GSTIN: 07AAACP9912K1Z9',
      financialVolume: '₹18.4 Lakh (Bank of Baroda #4902)',
      lastSeenLocation: 'Chandni Chowk Wholesale Market, 2nd Floor',
      notes: 'Shell company registered as wholesale paper distributor. No inventory observed during field inspection.',
    },
  },
  {
    id: 'ent-om-enterprises',
    name: 'Om Enterprises',
    type: 'organization',
    alias: 'Om Corp',
    role: 'Financing & Layering Vehicle',
    investigationPriority: 49.0,
    priorityLevel: 'Medium',
    degree: 8,
    betweenness: 0.58,
    pagerank: 0.065,
    connectionsCount: 8,
    organizationsCount: 0,
    transactionsCount: 14,
    potentialLeads: [
      'Transferred ₹18.4L in 6 tranches directly to Prakash Traders over 18-day period',
      'Isolation Forest anomaly detection flagged suspicious velocity spike on 23 Aug',
      'Deepak Mehta and Kavita Nair hold joint administrative authorizations',
    ],
    requiresVerification: true,
    details: {
      aadhaarOrReg: 'CIN: U74999DL2024PTC381902',
      financialVolume: '₹34.6 Lakh',
      lastSeenLocation: 'Okhla Industrial Area Phase II',
      notes: 'Layering vehicle for routing illicit gold liquidation proceeds into formal commercial streams.',
    },
  },
  {
    id: 'ent-golden-star',
    name: 'Golden Star Gang',
    type: 'organization',
    alias: 'GS Syndicate',
    role: 'Street Crime Cluster',
    investigationPriority: 78.5,
    priorityLevel: 'High',
    degree: 11,
    betweenness: 0.82,
    pagerank: 0.088,
    connectionsCount: 11,
    organizationsCount: 2,
    transactionsCount: 5,
    potentialLeads: [
      'Linked to 11 registered chain-snatching FIRs in South & Central Delhi over 30 days',
      'Operatives use Pulsar 220cc bikes with swapped number plates (DL-04-CK-8812)',
      'Direct handoff corridor identified between Lajpat Nagar and Karol Bagh',
    ],
    requiresVerification: true,
    details: {
      financialVolume: 'Estimated ₹65+ Lakh illicit takings',
      lastSeenLocation: 'Lajpat Nagar / Defence Colony / Kalkaji corridor',
      notes: 'Organized street cell utilizing fast-escape routes, coordinated by Suresh Yadav via encrypted VoIP and burner SIMs.',
    },
  },
  {
    id: 'ent-sector18-safehouse',
    name: 'Sector 18 Safehouse',
    type: 'location',
    role: 'Consolidation & Drop-off Point',
    investigationPriority: 44.0,
    priorityLevel: 'Low',
    degree: 5,
    betweenness: 0.38,
    pagerank: 0.042,
    connectionsCount: 5,
    organizationsCount: 1,
    transactionsCount: 2,
    potentialLeads: [
      'Cell Tower ID-449 triangulates within 120m radius during incident hours',
      'CCTV timestamps show black Pulsar motorcycle arriving 12 minutes post-incident',
      'Basement room rented under alias "Munna"',
    ],
    requiresVerification: true,
    details: {
      lastSeenLocation: 'Subhash Chowk, Sector 18, Commercial Block B',
      notes: 'Used for temporary stashing of snatched jewellery before transfer to melting facility.',
    },
  },
  {
    id: 'ent-imei-burner',
    name: 'IMEI 8694020488192',
    type: 'phone',
    role: 'Roaming Burner Device',
    investigationPriority: 44.7,
    priorityLevel: 'Low',
    degree: 6,
    betweenness: 0.45,
    pagerank: 0.048,
    connectionsCount: 6,
    organizationsCount: 0,
    transactionsCount: 0,
    potentialLeads: [
      'Device hosted 4 different SIM cards in 14 days without subscriber registration',
      'Tower pings coincide with snatched incident locations along Outer Ring Road',
      'Active outgoing voice packets to Deepak Mehta landline',
    ],
    requiresVerification: true,
    details: {
      lastSeenLocation: 'Tower: Okhla Phase 1 / Kalkaji',
      notes: 'Seized during raid; UFED forensic extraction completed.',
    },
  },
  {
    id: 'ent-hawala-8821',
    name: 'Hawala Transit #8821',
    type: 'transaction',
    role: 'Liquidation Clearing Channel',
    investigationPriority: 59.1,
    priorityLevel: 'Medium',
    degree: 4,
    betweenness: 0.49,
    pagerank: 0.044,
    connectionsCount: 4,
    organizationsCount: 2,
    transactionsCount: 1,
    potentialLeads: [
      '₹18.5L cash token settlement clearing note recovered inside journal',
      'Code reference "Munna-Karol-77" written on slip',
      'Matches withdrawal dates from Bank of Baroda account #4902',
    ],
    requiresVerification: true,
    details: {
      financialVolume: '₹18.5 Lakh cash route',
      notes: 'Underground hawala book entry connecting gold ingot sales to cash distribution.',
    },
  },
];

export const CASE_EDGES: NetworkEdge[] = [
  {
    id: 'edge-1',
    source: 'ent-deepak-mehta',
    target: 'ent-prakash-traders',
    label: 'Financial Transactions (14)',
    type: 'financial',
    detail: '₹18.4L in 6 tranches via Bank of Baroda #4902',
    amount: '₹18,40,000',
    verified: true,
  },
  {
    id: 'edge-2',
    source: 'ent-deepak-mehta',
    target: 'ent-om-enterprises',
    label: 'Registered Director / Signatory',
    type: 'associative',
    detail: 'Corporate Registry ROC-771 active mandate',
    verified: true,
  },
  {
    id: 'edge-3',
    source: 'ent-deepak-mehta',
    target: 'ent-suresh-yadav',
    label: 'Call Frequency (42 Calls)',
    type: 'telephony',
    detail: '42 calls over 14 days; CDR tower cell 09 dump',
    callsCount: 42,
    verified: true,
  },
  {
    id: 'edge-4',
    source: 'ent-deepak-mehta',
    target: 'ent-imei-burner',
    label: 'Active Subscriber / Intercept',
    type: 'telephony',
    detail: 'Direct roaming call logs and SIM registration anchor',
    verified: true,
  },
  {
    id: 'edge-5',
    source: 'ent-deepak-mehta',
    target: 'ent-golden-star',
    label: 'Indirect Intermediary',
    type: 'intermediary',
    detail: 'Connects street snatching operatives to liquidation channels',
    verified: true,
  },
  {
    id: 'edge-6',
    source: 'ent-deepak-mehta',
    target: 'ent-sector18-safehouse',
    label: 'Cell Tower Co-Location',
    type: 'location',
    detail: 'Tower ID-449 ping matched within 120m radius',
    verified: true,
  },
  {
    id: 'edge-7',
    source: 'ent-deepak-mehta',
    target: 'ent-hawala-8821',
    label: 'Beneficiary / Liquidation',
    type: 'financial',
    detail: '₹18.5L cash route receipt recovered during raid',
    amount: '₹18,50,000',
    verified: true,
  },
  {
    id: 'edge-8',
    source: 'ent-suresh-yadav',
    target: 'ent-golden-star',
    label: 'Rider Cell Commander',
    type: 'associative',
    detail: 'Dispatches two-wheeler teams across snatching corridors',
    verified: true,
  },
  {
    id: 'edge-9',
    source: 'ent-suresh-yadav',
    target: 'ent-sector18-safehouse',
    label: 'Physical Dropoff',
    type: 'location',
    detail: 'CCTV footage matches arrival 12m post-incident',
    verified: true,
  },
  {
    id: 'edge-10',
    source: 'ent-om-enterprises',
    target: 'ent-prakash-traders',
    label: 'Corporate Transfer',
    type: 'financial',
    detail: 'Structured wire transfers with no corresponding invoice trail',
    amount: '₹18,40,000',
    verified: true,
  },
  {
    id: 'edge-11',
    source: 'ent-kavita-nair',
    target: 'ent-om-enterprises',
    label: 'Digital Signatory',
    type: 'associative',
    detail: 'Digital token authorization for net banking transactions',
    verified: true,
  },
  {
    id: 'edge-12',
    source: 'ent-kavita-nair',
    target: 'ent-deepak-mehta',
    label: 'Shared IP / Admin Access',
    type: 'associative',
    detail: 'Identical login IP subnet 103.24.89.x recorded on bank portal',
    verified: true,
  },
  {
    id: 'edge-13',
    source: 'ent-gaurav-g',
    target: 'ent-deepak-mehta',
    label: 'Bullion Ingot Delivery',
    type: 'financial',
    detail: '420g crude gold ingot seized from basement safe',
    verified: true,
  },
  {
    id: 'edge-14',
    source: 'ent-gaurav-g',
    target: 'ent-sector18-safehouse',
    label: 'Collection Point',
    type: 'location',
    detail: 'Daily evening pickup of confiscated jewellery items',
    verified: true,
  },
];

export const CASE_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EV-2047-001',
    title: 'First Information Report No. 204/2026',
    documentNumber: 'FIR-204/2026',
    type: 'FIR',
    date: '22 Aug 2026 14:30 IST',
    sha256: 'a84f982b610c4921de981a54b3017e829fa75e128cb5b328109d7a22491c2',
    confidence: 88,
    ocrStatus: 'decoded',
    source: 'Metro Central Special Crime Police Station Register',
    processing: 'Local IndicTrOCR v2.4 (Police Form Fine-tuned)',
    provenance: 'Cryptographic hash preserved in Block #1,402',
    rawSnippet: 'Complainant states that two individuals approached on a Bajaj Pulsar Black (DL-04-CK-8812) near market square intersection of Subhash Chowk, Sector 18. Confiscated register marks lead directly to known fence receiver named Deepak Mehta operating from basement lockup. At the time of raid, unrecorded sum of ₹45,000 Cash was wrapped inside daily journal alongside 3 stolen gold bangles.',
    extractedEntities: [
      { name: 'Deepak Mehta', type: 'person', confidence: 88, role: 'Suspected Receiver' },
      { name: 'DL-04-CK-8812', type: 'event', confidence: 91, role: 'Bajaj Pulsar Black (Vehicle)' },
      { name: 'Subhash Chowk, Sector 18', type: 'location', confidence: 94, role: 'Incident Intersection' },
      { name: '₹45,000 Cash', type: 'transaction', confidence: 76, role: 'Confiscated Currency' },
    ],
  },
  {
    id: 'EV-2047-002',
    title: 'Seizure Memo & Malkhana Ingot Assay (MK-883)',
    documentNumber: 'SEZ-MEMO-882-OCR',
    type: 'Seizure Memo',
    date: '22 Aug 2026 17:45 IST',
    sha256: '7f8a33d1c920e8b154a01293fe88412acb9201f84e9123891459a01fec431902',
    confidence: 82,
    ocrStatus: 'decoded',
    source: 'IO Sub-Inspector K. Sharma Physical Seizure Register',
    processing: 'Local IndicTrOCR v2.4',
    provenance: 'Preserved & Sealed',
    rawSnippet: 'Seized from premises of Deepak Mehta: One crude gold bar weighing 420 grams, assay purity 87.4%, without official BIS hallmark. 4 Burner handsets without SIM cards and 9 loose SIM cards from Airtel and BSNL. Hand-written notebook detailing daily payments to Suresh Yadav.',
    extractedEntities: [
      { name: 'Deepak Mehta', type: 'person', confidence: 96, role: 'Possessor / Target' },
      { name: 'Suresh Yadav', type: 'person', confidence: 89, role: 'Payee in Notebook' },
      { name: 'Crude Gold Bar (420g)', type: 'event', confidence: 92, role: 'Physical Asset' },
    ],
  },
  {
    id: 'EV-2047-003',
    title: 'Bank of Baroda Statement #4902 (Prakash Traders)',
    documentNumber: 'BNK-BOB-4902-AUG26',
    type: 'Bank Ledger',
    date: '24 Aug 2026 11:20 IST',
    sha256: 'e44b990a88123fa90871b23908c11928019283019283012983019283019283aa',
    confidence: 95,
    ocrStatus: 'decoded',
    source: 'Financial Intelligence Unit (FIU-IND) Ingest',
    processing: 'Digital Parser & Benford Analyzer',
    provenance: 'Preserved & Sealed',
    rawSnippet: 'Account 490200100912 in name of Prakash Traders received 6 RTGS transfers from Om Enterprises totaling ₹18,40,000 between Aug 03 and Aug 21. Each deposit followed by cash counter withdrawals within 3 hours. Signatory: Deepak Mehta.',
    extractedEntities: [
      { name: 'Prakash Traders', type: 'organization', confidence: 98, role: 'Receiving Account' },
      { name: 'Om Enterprises', type: 'organization', confidence: 97, role: 'Remitting Account' },
      { name: '₹18,40,000', type: 'transaction', confidence: 99, role: 'Aggregated Turnover' },
    ],
  },
  {
    id: 'EV-2047-004',
    title: 'Telecom CDR Dump & Tower Analysis Cell #09',
    documentNumber: 'CDR-BSNL-09412-AUG26',
    type: 'CDR Log',
    date: '25 Aug 2026 08:30 IST',
    sha256: '12acbc0944129038491029384910239481029348102934810293841029384012',
    confidence: 93,
    ocrStatus: 'decoded',
    source: 'Nodal Cyber Cell Intercept Gateway',
    processing: 'Automated Graph Extractor',
    provenance: 'Preserved & Sealed',
    rawSnippet: 'IMEI 8694020488192 registered 42 voice calls to landline registered at Deepak Mehta residence. Average call duration 38 seconds. 8 calls occurred within 15 minutes of reported snatching events in South Delhi.',
    extractedEntities: [
      { name: 'IMEI 8694020488192', type: 'phone', confidence: 98, role: 'Originating Handset' },
      { name: 'Deepak Mehta', type: 'person', confidence: 91, role: 'Receiving Party' },
    ],
  },
];

export const CASE_ANOMALIES: AnomalyItem[] = [
  {
    id: 'anom-1',
    title: 'Rapid Sequential Structuring Deposits',
    entityName: 'Deepak Mehta / Prakash Traders',
    entityId: 'ent-deepak-mehta',
    severity: 'Medium',
    detectionMethod: 'Rule-based',
    description: 'Multiple incoming transactions: Rapid sequential deposits totaling ₹18.5L from Om Enterprises flagged under Rule #402 structuring heuristic within 4 hours. Requires verification.',
    requiresVerification: true,
    detectedAt: '23 Aug 2026 10:14 IST',
    evidenceRef: 'EV-2047-003',
  },
  {
    id: 'anom-2',
    title: 'Unusual Transaction Velocity Behavior',
    entityName: 'Om Enterprises',
    entityId: 'ent-om-enterprises',
    severity: 'Medium',
    detectionMethod: 'Isolation Forest',
    description: 'Unusual transaction behavior: 320% spike in fund velocity through intermediary account without inventory or logistics movement. Requires verification.',
    requiresVerification: true,
    detectedAt: '23 Aug 2026 14:02 IST',
    evidenceRef: 'EV-2047-003',
  },
  {
    id: 'anom-3',
    title: 'Burner SIM Rapid Churn & Roaming Telemetry',
    entityName: 'Suresh Yadav / IMEI 869402...',
    entityId: 'ent-suresh-yadav',
    severity: 'High',
    detectionMethod: 'Telephony Heuristic',
    description: 'Burner SIM churn: 3 distinct SIM cards activated in single handset within 9 days, dropping connections after each reported incident. Requires verification.',
    requiresVerification: true,
    detectedAt: '24 Aug 2026 09:15 IST',
    evidenceRef: 'EV-2047-004',
  },
  {
    id: 'anom-4',
    title: 'Zero Commercial Tax Filings with High Turnover',
    entityName: 'Prakash Traders',
    entityId: 'ent-prakash-traders',
    severity: 'High',
    detectionMethod: 'Benford Analysis',
    description: 'Shell account pattern: Bank account turnover exceeded ₹18.4L in single billing period while GST portal records zero outward supplies. Requires verification.',
    requiresVerification: true,
    detectedAt: '24 Aug 2026 16:40 IST',
    evidenceRef: 'EV-2047-003',
  },
  {
    id: 'anom-5',
    title: 'Spatiotemporal Incident Co-Presence',
    entityName: 'Sector 18 Safehouse',
    entityId: 'ent-sector18-safehouse',
    severity: 'Medium',
    detectionMethod: 'Spatiotemporal',
    description: 'Cell tower hit (Sec-18 Tower ID-449) matches timestamp of FIR-204/2026 snatching incident within 120m radius. Requires verification.',
    requiresVerification: true,
    detectedAt: '25 Aug 2026 11:30 IST',
    evidenceRef: 'EV-2047-001',
  },
  {
    id: 'anom-6',
    title: 'High-Frequency ATM Cash Withdrawals Post-Transfer',
    entityName: 'Prakash Traders',
    entityId: 'ent-prakash-traders',
    severity: 'Low',
    detectionMethod: 'Rule-based',
    description: 'Cash withdrawals occurred within an average of 2.8 hours following each wire transfer deposit, leaving minimal overnight balance. Requires verification.',
    requiresVerification: true,
    detectedAt: '25 Aug 2026 18:22 IST',
    evidenceRef: 'EV-2047-003',
  },
  {
    id: 'anom-7',
    title: 'Cross-Community Cluster Bridge Emergence',
    entityName: 'Deepak Mehta',
    entityId: 'ent-deepak-mehta',
    severity: 'Medium',
    detectionMethod: 'Rule-based',
    description: 'Louvain modularity algorithm detected a high-centrality bridge between legitimate commercial wholesale accounts and street crime operatives. Requires verification.',
    requiresVerification: true,
    detectedAt: '26 Aug 2026 08:45 IST',
    evidenceRef: 'EV-2047-001',
  },
];

export const CASE_TIMELINE: TimelineItem[] = [
  {
    id: 'time-1',
    date: '22 AUG',
    time: '14:30 IST',
    title: 'FIR filed',
    category: 'FIR',
    description: 'FIR No. 204/2026 lodged at Metro Central Police Station. Two suspects on black Bajaj Pulsar snatched gold chain at Subhash Chowk, Sector 18.',
    evidenceId: 'EV-2047-001',
    requiresVerification: true,
  },
  {
    id: 'time-2',
    date: '22 AUG',
    time: '17:45 IST',
    title: 'Evidence uploaded',
    category: 'Evidence',
    description: 'Handwritten Seizure Memo EVD-FIR-2026-0882 ingested into AI Evidence Lab. SHA-256 cryptographic hash computed and anchored into Block #1,402.',
    evidenceId: 'EV-2047-002',
    requiresVerification: false,
  },
  {
    id: 'time-3',
    date: '23 AUG',
    time: '11:15 IST',
    title: 'Financial transaction detected',
    category: 'Transaction',
    description: '₹18.4L transfer pattern identified across Bank of Baroda account #4902 in 6 structured wire deposits from Om Enterprises.',
    evidenceId: 'EV-2047-003',
    entityId: 'ent-prakash-traders',
    requiresVerification: true,
  },
  {
    id: 'time-4',
    date: '24 AUG',
    time: '09:40 IST',
    title: 'Network relationship discovered',
    category: 'Network',
    description: 'Cross-evidence entity resolution linked phone call records of Suresh Yadav directly to registered director Deepak Mehta.',
    evidenceId: 'EV-2047-004',
    entityId: 'ent-deepak-mehta',
    requiresVerification: true,
  },
  {
    id: 'time-5',
    date: '25 AUG',
    time: '14:20 IST',
    title: 'Anomaly detected',
    category: 'Anomaly',
    description: 'Isolation Forest algorithm flagged unusual transaction velocity behavior with 0.94 anomaly coefficient.',
    entityId: 'ent-om-enterprises',
    requiresVerification: true,
  },
  {
    id: 'time-6',
    date: '26 AUG',
    time: '16:00 IST',
    title: 'Physical getaway asset impounded',
    category: 'Hardware',
    description: 'Black Bajaj Pulsar 220 with altered registration plate (DL-04-CK-8812) recovered 400m from Sector 18 safehouse.',
    evidenceId: 'EV-2047-001',
    requiresVerification: true,
  },
  {
    id: 'time-7',
    date: '28 AUG',
    time: '10:00 IST',
    title: 'Graph centrality matrix finalized',
    category: 'Network',
    description: 'Louvain modularity identified 4 distinct communities with Deepak Mehta confirmed as primary bridge node (Betweenness: 0.89).',
    entityId: 'ent-deepak-mehta',
    requiresVerification: true,
  },
];

export const CASE_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    title: 'Network Overview & Topology Briefing',
    category: 'Network Intelligence',
    dateGenerated: '28 Aug 2026 14:00 IST',
    status: 'Ready',
    summary: 'Comprehensive analysis of 51 entities and 66 edges detailing the criminal link structure between street cells and liquidation entities.',
    content: `## CASE NX-2047: NETWORK OVERVIEW BRIEFING
**Classification:** RESTRICTED // LAW ENFORCEMENT ONLY
**Lead Analyst:** Inv. Insp. S. Roy

### 1. Executive Summary
Analysis of 51 discovered entities and 66 validated linkages indicates a structured two-tier criminal network:
- **Tier 1 (Field Operatives):** Suresh Yadav and associated riders on modified Pulsar motorcycles executing street snatches.
- **Tier 2 (Liquidation & Layering):** Deepak Mehta acting as intermediary receiver, utilizing Prakash Traders and Om Enterprises as commercial layering vehicles.

### 2. Centrality Analysis
- **Top Bridge Node:** Deepak Mehta (Betweenness: 0.89, PageRank: 0.094)
- **High Degree Operative:** Suresh Yadav (Degree: 9, Direct Calls: 42)
- **Financial Flow Velocity:** Om Enterprises to Prakash Traders (₹18.4 Lakh in 6 tranches)

*Note: AI-generated investigative analysis. Verify against source evidence.*`,
  },
  {
    id: 'rep-2',
    title: 'Financial Relationship Report',
    category: 'Financial Intelligence',
    dateGenerated: '27 Aug 2026 18:30 IST',
    status: 'Ready',
    summary: 'Tracing of ₹18.4L structured wire transfers and ₹45,000 seized cash across Bank of Baroda account #4902 and Hawala transit receipts.',
    content: `## FINANCIAL RELATIONSHIP & STRUCTURING REPORT
**Case Ref:** NX-2047-FIN-08

### Key Findings
1. **Structuring Under Rule #402:**
   Om Enterprises initiated 6 deposits under ₹3,50,000 each to avoid threshold automated reporting triggers.
2. **Rapid Cash Conversion:**
   Average duration between RTGS deposit credit and cash counter debit: 2.8 hours.
3. **Cash Seizure Correlation:**
   ₹45,000 cash in 500-denomination notes recovered from premises matches ledger entry date.

*Potential financial pattern identified. Requires verification.*`,
  },
  {
    id: 'rep-3',
    title: 'Anomaly Intelligence Report',
    category: 'Pattern Detection',
    dateGenerated: '26 Aug 2026 11:15 IST',
    status: 'Ready',
    summary: 'Consolidated report of 7 algorithmic anomalies flagged by Isolation Forest, Benford Law analysis, and Telephony heuristics.',
    content: `## ANOMALY DETECTION DOSSIER
**Case Ref:** NX-2047-ANOM-07

### Summary of Flagged Patterns
- **Anomaly #1 (Medium):** Deepak Mehta - Multiple incoming transactions
- **Anomaly #2 (Medium):** Om Enterprises - Unusual transaction behavior (Isolation Forest)
- **Anomaly #3 (High):** Suresh Yadav - Burner SIM rapid churn (Telephony Heuristic)
- **Anomaly #4 (High):** Prakash Traders - Zero commercial tax filings with ₹18.4L volume
- **Anomaly #5 (Medium):** Sector 18 Safehouse - Spatiotemporal co-presence hit

*Notice: Anomalies are unusual patterns, not proof of wrongdoing.*`,
  },
  {
    id: 'rep-4',
    title: 'Evidence Timeline & Custody Log',
    category: 'Forensic Audit',
    dateGenerated: '25 Aug 2026 16:45 IST',
    status: 'Ready',
    summary: 'Chronological timeline tracing evidence ingestion from FIR-204 to laboratory gold assay with cryptographic SHA-256 verification.',
    content: `## EVIDENCE TIMELINE & PROVENANCE AUDIT
**Ledger Hash Block:** #1,402

All 14 evidence artifacts have undergone SHA-256 fingerprint generation prior to neural OCR parsing.
- EVD-FIR-2026-0882: a84f...91c2 (VERIFIED)
- BNK-BOB-4902: e44b...83aa (VERIFIED)
- CDR-BSNL-09412: 12ac...012 (VERIFIED)

*Integrity verified. Cryptographic fingerprint verifies record integrity, not the truthfulness of underlying evidence.*`,
  },
  {
    id: 'rep-5',
    title: 'Entity Relationship Dossier: Deepak Mehta',
    category: 'Entity Dossier',
    dateGenerated: '24 Aug 2026 15:20 IST',
    status: 'Ready',
    summary: 'Detailed link dossier on Deepak Mehta, mapping 12 direct edges, 3 corporate ties, and probabilistic leads for corroboration.',
    content: `## ENTITY DOSSIER: DEEPAK MEHTA (#6891)
**Alias:** "D-Bhai / Munna"
**Investigation Priority Index:** 63.2 / 100 (Medium-High)

### Documented Associations
- **Om Enterprises:** Registered Director (Corporate Registry ROC-771)
- **Prakash Traders:** Financial beneficiary (₹18.4L in 6 tranches)
- **Suresh Yadav:** Intermediary call logs (42 calls over 14 days)
- **Sector 18 Safehouse:** Cell tower co-presence (Tower ID-449)

*Investigation priority. Requires verification.*`,
  },
  {
    id: 'rep-6',
    title: 'Case Briefing & Actionable Leads Summary',
    category: 'Operational Brief',
    dateGenerated: '28 Aug 2026 09:30 IST',
    status: 'Ready',
    summary: 'Operational brief prepared for Special Cell command summarizing primary investigative leads and recommended verification steps.',
    content: `## SPECIAL CELL CASE BRIEFING: NX-2047
**Subject:** Urban Chain-Snatching & Fencing Syndicate

### Recommended Investigative Actions
1. Subpoena detailed counter withdrawal CCTV logs for Bank of Baroda account #4902.
2. Conduct physical verification of nominal warehouse registered for Prakash Traders in Chandni Chowk.
3. Cross-examine call logs between Suresh Yadav and BSNL IMEI 8694020488192.
4. Verify assay certificate MK-883 against malkhana physical gold ingot weight (420g).

*AI-generated investigative analysis. Verify against source evidence.*`,
  },
];

export const CASE_AUDIT_TRAIL: AuditRecord[] = [
  {
    id: 'aud-001',
    timestamp: '09:42:18 IST',
    action: 'Evidence uploaded',
    actor: 'Inv. Insp. S. Roy',
    hash: 'a84f982b610c4921de981a54b3017e829fa75e128cb5b328109d7a22491c2',
    details: 'Uploaded original handwritten seizure memo (EVD-FIR-2026-0882). Nikon D850 Raw Ingest (.NEF converted).',
  },
  {
    id: 'aud-002',
    timestamp: '09:42:25 IST',
    action: 'SHA-256 fingerprint generated',
    actor: 'System / CrypEngine',
    hash: 'a84f982b610c4921de981a54b3017e829fa75e128cb5b328109d7a22491c2',
    details: 'Computed prior to buffer pass. Immutable seal anchored into ledger Block #1,402.',
  },
  {
    id: 'aud-003',
    timestamp: '09:43:10 IST',
    action: 'OCR executed',
    actor: 'Local IndicTrOCR v2.4',
    hash: '3901bcae88412984120398410293841029384102938401293840192834019283',
    details: 'Handwritten FIR transcription completed with 82% confidence score. Air-gapped on-premises inference.',
  },
  {
    id: 'aud-004',
    timestamp: '09:43:45 IST',
    action: 'Entity extraction completed',
    actor: 'System / NER Pipeline',
    hash: '7c81a29304810293481029384102938410293840192834019283401928340192',
    details: 'Identified 4 entities: Deepak Mehta (Person), DL-04-CK-8812 (Vehicle), Sector 18 (Location), ₹45,000 (Financial).',
  },
  {
    id: 'aud-005',
    timestamp: '09:44:20 IST',
    action: 'Network updated',
    actor: 'Graph Heuristic Engine',
    hash: 'b120938410293840192834019283401928340192834019283401928340192834',
    details: 'Nodal links committed. Entity #6891 linked to 3 corporate accounts and 12 relational edges.',
  },
  {
    id: 'aud-006',
    timestamp: '09:45:00 IST',
    action: 'Anomaly model scan executed',
    actor: 'Isolation Forest v1.2',
    hash: '9012841029384019283401928340192834019283401928340192834019283401',
    details: '7 unusual patterns detected across financial structuring and roaming telephony churn.',
  },
  {
    id: 'aud-007',
    timestamp: '09:48:12 IST',
    action: 'Investigator query logged',
    actor: 'Inv. Insp. S. Roy',
    hash: '4410293840192834019283401928340192834019283401928340192834019283',
    details: 'Copilot query executed: "Show financial links involving Deepak Mehta."',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    timestamp: '14:28:09 IST',
    text: 'Show financial links involving Deepak Mehta.',
  },
  {
    id: 'msg-2',
    sender: 'ai',
    timestamp: '14:28:10 IST',
    text: `Deepak Mehta has connections to 3 organizations and 2 individuals in the current investigation dataset.

### Key connections

• **Om Enterprises**
  Financial relationship
  2 transactions

• **Prakash Traders**
  Financial relationship
  1 transaction (₹18.4L in 6 tranches)

• **Suresh Yadav**
  Financial relationship
  1 transaction (and 42 calls over 14 days)

### Investigation lead

Multiple incoming transactions may warrant verification. Rapid sequential deposits totaling ₹18.5L from Om Enterprises flagged under Rule #402 structuring heuristic within 4 hours.

### Evidence

Transaction records (Bank of Baroda #4902), FIR references (FIR-204/2026), and Network relationships.

Confidence: 87%`,
    keyConnections: [
      { entity: 'Om Enterprises', type: 'Financial relationship', detail: '2 transactions' },
      { entity: 'Prakash Traders', type: 'Financial relationship', detail: '1 transaction (₹18.4L in 6 tranches)' },
      { entity: 'Suresh Yadav', type: 'Financial relationship', detail: '1 transaction (and 42 calls over 14 days)' },
    ],
    investigationLeads: [
      'Multiple incoming transactions may warrant verification.',
      'Potential connection between legitimate wholesale front Prakash Traders and field handler Suresh Yadav.',
    ],
    evidenceSources: [
      { id: 'EV-2047-003', title: 'Bank of Baroda Statement #4902', hash: 'e44b...83aa' },
      { id: 'EV-2047-001', title: 'FIR No. 204/2026 (Subhash Chowk)', hash: 'a84f...91c2' },
      { id: 'EV-2047-004', title: 'BSNL CDR Intercept Dump', hash: '12ac...012' },
    ],
    confidence: 87,
    targetEntityId: 'ent-deepak-mehta',
    evidenceId: 'EV-2047-001',
  },
];
