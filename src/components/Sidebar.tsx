import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck2, 
  RefreshCw, 
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import type { Candidate } from '../types';

export type NavTab = 'overview' | 'queue' | 'detail' | 'sync';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeCandidate?: Candidate;
  candidatesCount: number;
  pendingSyncCount: number;
  isMobileOpen: boolean;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeCandidate,
  candidatesCount,
  pendingSyncCount,
  isMobileOpen,
  onResetData
}) => {
  return (
    <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div>
        <nav className="nav-section">
          <button 
            className={`nav-item ${currentTab === 'overview' ? 'active' : ''}`}
            onClick={() => onSelectTab('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button 
            className={`nav-item ${currentTab === 'queue' ? 'active' : ''}`}
            onClick={() => onSelectTab('queue')}
          >
            <Users size={18} />
            <span>Assessments</span>
            <span className="nav-badge">{candidatesCount}</span>
          </button>

          <button 
            className={`nav-item ${currentTab === 'detail' ? 'active' : ''}`}
            onClick={() => onSelectTab('detail')}
          >
            <FileCheck2 size={18} />
            <span>Assessment Detail</span>
          </button>

          <button 
            className={`nav-item ${currentTab === 'sync' ? 'active' : ''}`}
            onClick={() => onSelectTab('sync')}
          >
            <RefreshCw size={18} />
            <span>Sync & Records</span>
            {pendingSyncCount > 0 && (
              <span className="nav-badge" style={{ background: '#FEF3C7', color: '#92400E', fontWeight: 600 }}>
                {pendingSyncCount}
              </span>
            )}
          </button>
        </nav>

        {activeCandidate && (
          <div className="active-candidate-pill">
            <div className="pill-label">Active Candidate</div>
            <div className="pill-name">{activeCandidate.name}</div>
            <div className="pill-trade">{activeCandidate.trade}</div>
            <div style={{ marginTop: '0.45rem', fontSize: '0.72rem', color: '#173B63', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2E7774' }}></span>
              {activeCandidate.status.replace('_', ' ')}
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
        <button 
          onClick={onResetData}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', color: '#5B6573' }}
          title="Reset candidates and rubrics to original demo seed state"
        >
          <RotateCcw size={14} />
          <span>Reset Demo Data</span>
        </button>

        <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#8E98A5', display: 'flex', alignItems: 'flex-start', gap: 4 }}>
          <ShieldAlert size={12} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>Demonstration system for SIH 26242. Assessor records the final decision.</span>
        </div>
      </div>
    </aside>
  );
};
