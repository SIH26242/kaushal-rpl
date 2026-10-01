import React, { useState } from 'react';
import { 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  HardDrive, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import type { SyncRecord } from '../types';
import { getStorageUsageInfo } from '../utils/storage';

interface SyncRecordsViewProps {
  offlineMode: boolean;
  onToggleOffline: () => void;
  syncRecords: SyncRecord[];
  onSyncAll: () => void;
  onResetData: () => void;
}

export const SyncRecordsView: React.FC<SyncRecordsViewProps> = ({
  offlineMode,
  onToggleOffline,
  syncRecords,
  onSyncAll,
  onResetData
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const storageInfo = getStorageUsageInfo();
  const pendingCount = syncRecords.filter(r => r.status === 'pending').length;

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h1>Sync & Local Storage Records</h1>
          <div className="view-subtitle">
            Field assessment sync queue, device storage diagnostics, and demo environment controls.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-primary"
            onClick={onSyncAll}
            disabled={pendingCount === 0}
          >
            <RefreshCw size={15} />
            <span>Simulate Cloud Sync Now ({pendingCount} Pending)</span>
          </button>
        </div>
      </div>

      {/* Connectivity & Cache Status Card */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 6, border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: '#5B6573', fontWeight: 600 }}>Active Network Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              {offlineMode ? <WifiOff size={18} color="#92400E" /> : <Wifi size={18} color="#065F46" />}
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: offlineMode ? '#92400E' : '#065F46' }}>
                {offlineMode ? 'Offline Simulation Active' : 'Connected (Online Simulation)'}
              </span>
            </div>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ marginTop: '0.65rem' }}
              onClick={onToggleOffline}
            >
              Toggle Network Mode
            </button>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 6, border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: '#5B6573', fontWeight: 600 }}>Local Browser Storage</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <HardDrive size={18} color="var(--primary)" />
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#173B63' }}>
                {(storageInfo.approxBytes / 1024).toFixed(1)} KB Cached
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#5B6573', marginTop: '0.65rem' }}>
              Stores {storageInfo.count} candidate dossiers, rubrics, and offline audit events.
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 6, border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: '#5B6573', fontWeight: 600 }}>Demo Storage Principle</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <ShieldCheck size={18} color="#065F46" />
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#065F46' }}>
                Demo data stays in this browser
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#5B6573', marginTop: '0.65rem' }}>
              All self-declarations, rubrics, and evidence attachments remain solely on this device.
            </div>
          </div>
        </div>
      </div>

      {/* Pending status explainer banner */}
      {pendingCount > 0 ? (
        <div className="notice-box notice-warning" style={{ marginBottom: '1.25rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Pending Local Queue (1 record · Suresh Patil):</strong> Field intake data for <em>Suresh Patil (Kozhikode · Domestic Wireman)</em> is currently queued in local browser storage awaiting transmission. <em>Ravi Kumar's</em> assessment rubric items, observations, and declarations were marked as synced during this session.
          </div>
        </div>
      ) : (
        <div className="notice-box notice-success" style={{ marginBottom: '1.25rem' }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            All assessment records (including Suresh Patil and Ravi Kumar) are currently synchronized for this demo.
          </div>
        </div>
      )}

      {/* Sync Queue Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <RefreshCw size={18} color="var(--primary)" />
            <span>Field Synchronization Audit Trail</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#5B6573' }}>
            Showing recent offline modifications & queued transmissions
          </span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Candidate</th>
                <th>Action Recorded</th>
                <th>Timestamp</th>
                <th>Sync Status</th>
              </tr>
            </thead>
            <tbody>
              {syncRecords.map(rec => (
                <tr key={rec.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: '#5B6573' }}>
                    {rec.id}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {rec.candidateName}
                  </td>
                  <td>
                    {rec.action}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#5B6573' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      <span>{rec.timestamp}</span>
                    </div>
                  </td>
                  <td>
                    {rec.status === 'synced' ? (
                      <span style={{ 
                        background: 'var(--status-green-bg)', 
                        color: 'var(--status-green-text)', 
                        padding: '2px 8px', 
                        borderRadius: 4, 
                        fontSize: '0.74rem', 
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3
                      }}>
                        <CheckCircle2 size={12} />
                        <span>Synced for Demo</span>
                      </span>
                    ) : (
                      <span style={{ 
                        background: 'var(--status-amber-bg)', 
                        color: 'var(--status-amber-text)', 
                        padding: '2px 8px', 
                        borderRadius: 4, 
                        fontSize: '0.74rem', 
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3
                      }}>
                        <Clock size={12} />
                        <span>Pending Local Queue</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dangerous Environment Management Area */}
      <div className="card" style={{ border: '1px solid #FECACA', background: '#FFF5F5', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#991B1B', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle size={16} />
              <span>Reset Prototype Demo Workspace</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5B6573', marginTop: 2 }}>
              Restores Ravi Kumar, Meera Das, and Suresh Patil to baseline seed states and clears local sync queues.
            </div>
          </div>

          <button 
            className="btn btn-danger-outline btn-sm"
            onClick={() => setShowResetConfirm(true)}
          >
            <RotateCcw size={14} />
            <span>Reset Demo Data to Initial State</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowResetConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="card-header">
              <h3 className="card-title" id="reset-dialog-title" style={{ color: '#991B1B' }}>
                <RotateCcw size={18} />
                <span>Confirm Demo Data Reset</span>
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowResetConfirm(false)} aria-label="Close dialog">✕</button>
            </div>

            <div style={{ fontSize: '0.88rem', color: '#1E293B', marginBottom: '1.25rem' }}>
              Are you sure you want to reset all candidate declarations, rubric scores, and recorded assessor decisions back to their initial demonstration defaults?
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                style={{ backgroundColor: '#991B1B' }}
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
