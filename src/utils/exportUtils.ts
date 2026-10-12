import { FinancialTransaction, Entity, Relationship } from '../types';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function exportTransactionsToCSV(transactions: FinancialTransaction[], caseTitle: string) {
  const headers = [
    'Transaction ID',
    'Case ID',
    'Source Account',
    'Source Holder',
    'Destination Account',
    'Destination Holder',
    'Amount (INR)',
    'Type',
    'Reference No',
    'Timestamp',
    'Evidence ID',
    'Notes',
  ];

  const rows = transactions.map((t) => [
    t.id,
    t.caseId,
    t.sourceAccountNum,
    `"${t.sourceHolder}"`,
    t.destAccountNum,
    `"${t.destHolder}"`,
    t.amount,
    t.transferType,
    t.referenceNo,
    t.timestamp,
    t.evidenceId,
    `"${t.notes.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadBlob(csvContent, `Financial_Trail_${caseTitle.replace(/\s+/g, '_')}.csv`, 'text/csv');
}

export function exportEntitiesToCSV(entities: Entity[], caseTitle: string) {
  const headers = ['Entity ID', 'Name', 'Type', 'Identifier', 'Risk Score', 'Role', 'Status'];
  const rows = entities.map((e) => [
    e.id,
    `"${e.name}"`,
    e.type,
    `"${e.identifier}"`,
    e.riskScore,
    `"${e.role || ''}"`,
    e.verified ? 'Verified' : 'Unverified Lead',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadBlob(csvContent, `Entities_${caseTitle.replace(/\s+/g, '_')}.csv`, 'text/csv');
}

export function exportRelationshipsToCSV(relationships: Relationship[], caseTitle: string) {
  const headers = ['Relationship ID', 'Source ID', 'Target ID', 'Type', 'Label', 'Confidence', 'Status', 'Evidence ID'];
  const rows = relationships.map((r) => [
    r.id,
    r.sourceId,
    r.targetId,
    r.type,
    `"${r.label}"`,
    r.confidence,
    r.status,
    r.evidenceId,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadBlob(csvContent, `Relationships_${caseTitle.replace(/\s+/g, '_')}.csv`, 'text/csv');
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
