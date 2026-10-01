import React from 'react';
import { 
  Menu, 
  MapPin, 
  Wifi, 
  WifiOff, 
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  offlineMode: boolean;
  onToggleOffline: () => void;
  pendingSyncCount: number;
  pendingSummary?: string;
  onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  offlineMode,
  onToggleOffline,
  pendingSyncCount,
  pendingSummary,
  onToggleMenu
}) => {
  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="menu-toggle-btn" 
          onClick={onToggleMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="brand-wrapper">
          <span className="brand-title">Kaushal RPL</span>
          <span className="brand-descriptor">Recognition of Prior Learning · Assessment Workspace</span>
        </div>
        <span className="prototype-tag">
          Prototype · Demo Data
        </span>
      </div>

      <div className="header-right">
        <div className="centre-badge" title="Active assessment location">
          <MapPin size={14} color="#5B6573" />
          <span>Kochi Assessment Centre (Demo)</span>
        </div>

        <button 
          className={`sync-toggle-btn ${offlineMode ? 'offline-mode' : 'online-mode'}`}
          onClick={onToggleOffline}
          title={offlineMode ? "Click to simulate online mode" : "Click to simulate offline field mode"}
        >
          {offlineMode ? (
            <>
              <WifiOff size={14} />
              <span>Offline Simulation</span>
              {pendingSyncCount > 0 && (
                <span style={{ 
                  background: '#92400E', 
                  color: 'white', 
                  fontSize: '0.7rem', 
                  padding: '1px 6px', 
                  borderRadius: '10px',
                  fontWeight: 600
                }}>
                  {pendingSummary || pendingSyncCount}
                </span>
              )}
            </>
          ) : (
            <>
              <Wifi size={14} />
              <span>Online</span>
              {pendingSyncCount > 0 && (
                <span style={{ 
                  background: '#2E7774', 
                  color: 'white', 
                  fontSize: '0.7rem', 
                  padding: '1px 6px', 
                  borderRadius: '10px',
                  fontWeight: 600
                }}>
                  {pendingSummary || `${pendingSyncCount} pending`}
                </span>
              )}
            </>
          )}
        </button>

        <div className="user-badge" title="Authenticated assessor profile for this session">
          <div className="user-avatar">AM</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.1 }}>Anita Menon</div>
            <div style={{ fontSize: '0.72rem', color: '#5B6573' }}>Lead Assessor (Demo)</div>
          </div>
          <UserCheck size={14} color="#2E7774" style={{ marginLeft: 2 }} />
        </div>
      </div>
    </header>
  );
};
