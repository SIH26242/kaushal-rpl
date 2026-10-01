import { useState, useEffect } from 'react';
import type { Candidate, SyncRecord } from './types';
import { 
  loadCandidates, 
  saveCandidate, 
  loadSyncRecords, 
  syncAllPending, 
  resetDemoData, 
  loadOfflineMode, 
  saveOfflineMode 
} from './utils/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import type { NavTab } from './components/Sidebar';
import { OverviewView } from './components/OverviewView';
import { AssessmentsListView } from './components/AssessmentsListView';
import { AssessmentDetailView } from './components/AssessmentDetailView';
import { SyncRecordsView } from './components/SyncRecordsView';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [candidates, setCandidates] = useState<Candidate[]>(() => loadCandidates());
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('cand-001');
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [offlineMode, setOfflineMode] = useState<boolean>(() => loadOfflineMode());
  const [syncRecords, setSyncRecords] = useState<SyncRecord[]>(() => loadSyncRecords());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync on storage events if any
  useEffect(() => {
    const handleStorage = () => {
      setCandidates(loadCandidates());
      setSyncRecords(loadSyncRecords());
      setOfflineMode(loadOfflineMode());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleToggleOffline = () => {
    const nextMode = !offlineMode;
    setOfflineMode(nextMode);
    saveOfflineMode(nextMode);
    showToast(nextMode ? 'Switched to Offline Field Simulation' : 'Connected to Online Simulation');
  };

  const handleUpdateCandidate = (updated: Candidate, logSyncAction?: string) => {
    saveCandidate(updated, offlineMode, logSyncAction);
    setCandidates(loadCandidates());
    setSyncRecords(loadSyncRecords());
  };

  const handleOpenCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setCurrentTab('detail');
    setIsMobileMenuOpen(false);
  };

  const handleSyncAll = () => {
    syncAllPending();
    setSyncRecords(loadSyncRecords());
    showToast('All pending local assessment records synchronized for demo');
  };

  const handleResetData = () => {
    resetDemoData();
    const fresh = loadCandidates();
    setCandidates(fresh);
    setSyncRecords(loadSyncRecords());
    setSelectedCandidateId('cand-001');
    setCurrentTab('overview');
    showToast('Demo environment reset to initial seed state');
  };

  const activeCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];
  const pendingRecords = syncRecords.filter(r => r.status === 'pending');
  const pendingCount = pendingRecords.length;
  const pendingSummary = pendingCount === 1 
    ? `1 pending (${pendingRecords[0].candidateName})` 
    : pendingCount > 1 
    ? `${pendingCount} pending` 
    : undefined;

  return (
    <div className="app-container">
      <Header 
        offlineMode={offlineMode}
        onToggleOffline={handleToggleOffline}
        pendingSyncCount={pendingCount}
        pendingSummary={pendingSummary}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="app-body">
        <Sidebar 
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsMobileMenuOpen(false);
          }}
          activeCandidate={activeCandidate}
          candidatesCount={candidates.length}
          pendingSyncCount={pendingCount}
          isMobileOpen={isMobileMenuOpen}
          onResetData={handleResetData}
        />

        <main className="app-content">
          {currentTab === 'overview' && (
            <OverviewView 
              candidates={candidates}
              onOpenCandidate={handleOpenCandidate}
            />
          )}

          {currentTab === 'queue' && (
            <AssessmentsListView 
              candidates={candidates}
              onOpenCandidate={handleOpenCandidate}
            />
          )}

          {currentTab === 'detail' && activeCandidate && (
            <AssessmentDetailView 
              candidate={activeCandidate}
              onUpdateCandidate={handleUpdateCandidate}
              onReturnToQueue={() => setCurrentTab('queue')}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'sync' && (
            <SyncRecordsView 
              offlineMode={offlineMode}
              onToggleOffline={handleToggleOffline}
              syncRecords={syncRecords}
              onSyncAll={handleSyncAll}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle2 size={16} color="#A7F3D0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
