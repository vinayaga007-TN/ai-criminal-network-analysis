export type ExposureIdentifierType = 'email' | 'username' | 'phone' | 'domain';

export interface ExposureRecord {
  id: string;
  identifierType: ExposureIdentifierType;
  identifier: string;
  source: 'Synthetic Threat Intelligence Dataset';
  firstSeen: string;
  lastSeen: string;
  dataTypes: string[];
  confidence: number;
  caseEntityId?: string;
  notes: string;
}

export const SYNTHETIC_EXPOSURES: ExposureRecord[] = [
  {
    id: 'EXP-001',
    identifierType: 'email',
    identifier: 'arjun.rao@example.test',
    source: 'Synthetic Threat Intelligence Dataset',
    firstSeen: '2026-04-12',
    lastSeen: '2026-08-19',
    dataTypes: ['email', 'username'],
    confidence: 94,
    caseEntityId: 'ent-arjun-rao',
    notes: 'Synthetic exposure used to demonstrate breach-intelligence correlation.'
  },
  {
    id: 'EXP-002',
    identifierType: 'username',
    identifier: 'arjun_rao_4821',
    source: 'Synthetic Threat Intelligence Dataset',
    firstSeen: '2026-05-03',
    lastSeen: '2026-08-22',
    dataTypes: ['username', 'email'],
    confidence: 89,
    caseEntityId: 'ent-arjun-rao',
    notes: 'Synthetic exposure associated with a case-linked username.'
  },
  {
    id: 'EXP-003',
    identifierType: 'domain',
    identifier: 'blue-meridian.example',
    source: 'Synthetic Threat Intelligence Dataset',
    firstSeen: '2026-03-18',
    lastSeen: '2026-08-30',
    dataTypes: ['domain', 'email'],
    confidence: 86,
    caseEntityId: 'ent-blue-meridian',
    notes: 'Synthetic domain exposure used for organization-level correlation.'
  },
  {
    id: 'EXP-004',
    identifierType: 'phone',
    identifier: '+910000004821',
    source: 'Synthetic Threat Intelligence Dataset',
    firstSeen: '2026-06-11',
    lastSeen: '2026-08-27',
    dataTypes: ['phone'],
    confidence: 81,
    caseEntityId: 'ent-phone-4821',
    notes: 'Synthetic phone exposure for timeline and network correlation.'
  }
];

export function normalizeIdentifier(type: ExposureIdentifierType, value: string): string {
  const raw = value.trim().toLowerCase();
  if (type === 'email' || type === 'username' || type === 'domain') return raw;
  return raw.replace(/[^0-9+]/g, '');
}

export function scanSyntheticExposure(type: ExposureIdentifierType, value: string) {
  const normalized = normalizeIdentifier(type, value);
  const exact = SYNTHETIC_EXPOSURES.filter((item) =>
    item.identifierType === type && normalizeIdentifier(item.identifierType, item.identifier) === normalized
  );

  return {
    queriedIdentifier: normalized,
    provider: 'Synthetic Threat Intelligence Dataset',
    matches: exact,
    isSynthetic: true,
    scannedAt: new Date().toISOString()
  };
}
