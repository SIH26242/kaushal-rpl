import type { Candidate, SyncRecord } from '../types';
import { INITIAL_CANDIDATES, INITIAL_SYNC_RECORDS } from '../data/seedData';

const STORAGE_KEY_CANDIDATES = 'kaushal_rpl_candidates_v2';
const STORAGE_KEY_SYNC_QUEUE = 'kaushal_rpl_sync_queue_v2';
const STORAGE_KEY_OFFLINE_MODE = 'kaushal_rpl_offline_mode_v2';

export function loadCandidates(): Candidate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CANDIDATES);
    if (!raw) {
      saveCandidates(INITIAL_CANDIDATES);
      return INITIAL_CANDIDATES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load candidates from storage, falling back to seed:', err);
    return INITIAL_CANDIDATES;
  }
}

export function saveCandidates(candidates: Candidate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CANDIDATES, JSON.stringify(candidates));
  } catch (err) {
    console.error('Failed to persist candidates:', err);
  }
}

export function saveCandidate(candidate: Candidate, offlineSimulation: boolean = false, logSyncAction?: string): void {
  const all = loadCandidates();
  const index = all.findIndex(c => c.id === candidate.id);
  if (index !== -1) {
    all[index] = { ...candidate, lastUpdated: 'Just now' };
  } else {
    all.push({ ...candidate, lastUpdated: 'Just now' });
  }
  saveCandidates(all);

  // Only create a sync queue audit entry when an explicit action is requested (e.g. Save button click)
  if (logSyncAction) {
    addSyncRecord({
      id: 'sync-' + Date.now(),
      candidateId: candidate.id,
      candidateName: candidate.name,
      action: logSyncAction,
      timestamp: 'Just now',
      status: offlineSimulation ? 'pending' : 'synced'
    });
  }
}

export function loadSyncRecords(): SyncRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SYNC_QUEUE);
    if (!raw) {
      saveSyncRecords(INITIAL_SYNC_RECORDS);
      return INITIAL_SYNC_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SYNC_RECORDS;
  }
}

export function saveSyncRecords(records: SyncRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SYNC_QUEUE, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save sync records:', err);
  }
}

export function addSyncRecord(record: SyncRecord): void {
  const records = loadSyncRecords();
  records.unshift(record);
  saveSyncRecords(records.slice(0, 30)); // keep last 30 records
}

export function syncAllPending(): void {
  const records = loadSyncRecords();
  const updated = records.map(r => ({ ...r, status: 'synced' as const }));
  saveSyncRecords(updated);
}

export function resetDemoData(): void {
  localStorage.removeItem(STORAGE_KEY_CANDIDATES);
  localStorage.removeItem(STORAGE_KEY_SYNC_QUEUE);
  saveCandidates(INITIAL_CANDIDATES);
  saveSyncRecords(INITIAL_SYNC_RECORDS);
}

export function loadOfflineMode(): boolean {
  return localStorage.getItem(STORAGE_KEY_OFFLINE_MODE) === 'true';
}

export function saveOfflineMode(val: boolean): void {
  localStorage.setItem(STORAGE_KEY_OFFLINE_MODE, String(val));
}

export function getStorageUsageInfo(): { count: number; approxBytes: number; lastSaved: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CANDIDATES) || '';
    const syncRaw = localStorage.getItem(STORAGE_KEY_SYNC_QUEUE) || '';
    const approxBytes = (raw.length + syncRaw.length) * 2;
    return {
      count: loadCandidates().length,
      approxBytes,
      lastSaved: 'Local storage active'
    };
  } catch {
    return { count: 3, approxBytes: 15200, lastSaved: 'Local storage' };
  }
}
