import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  MapPin, 
  Clock, 
  User
} from 'lucide-react';
import type { Candidate, AssessmentStatus } from '../types';

interface AssessmentsListViewProps {
  candidates: Candidate[];
  onOpenCandidate: (candidateId: string) => void;
}

export const AssessmentsListView: React.FC<AssessmentsListViewProps> = ({
  candidates,
  onOpenCandidate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AssessmentStatus>('all');

  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = 
      cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cand.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status: AssessmentStatus) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'ready_for_review': return 'Ready for Review';
      case 'decision_recorded': return 'Decision Recorded';
      case 'saved_offline': return 'Saved Offline';
      default: return status;
    }
  };

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h1>Assessments Work Queue</h1>
          <div className="view-subtitle">
            Manage candidates, monitor practical scoring status, and conduct assessor reviews.
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 420 }}>
            <Search size={16} color="#5B6573" style={{ position: 'absolute', left: 10, top: 11 }} />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.2rem' }}
              placeholder="Search by candidate name, trade, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({candidates.length})
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('in_progress')}
            >
              In Progress
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'ready_for_review' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('ready_for_review')}
            >
              Ready for Review
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'saved_offline' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('saved_offline')}
            >
              Saved Offline
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="data-table-wrapper" style={{ display: window.innerWidth < 768 ? 'none' : 'block' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Trade / Qualification</th>
              <th>Assessment Centre</th>
              <th>Experience</th>
              <th>Last Updated</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map(cand => (
              <tr key={cand.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      background: '#EBF1F7', 
                      color: '#173B63',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.8rem'
                    }}>
                      {cand.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>{cand.name}</div>
                      <div style={{ fontSize: '0.76rem', color: '#5B6573' }}>Age {cand.age} · {cand.location}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{cand.trade}</div>
                  <div style={{ fontSize: '0.74rem', color: '#5B6573' }}>
                    Match: {cand.mapping?.matchScore ? `${cand.mapping.matchScore}% (Illustrative)` : 'Pending'}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} color="#5B6573" />
                    <span>{cand.centre}</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                    {cand.declaration.yearsExperience} years informal
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.78rem', color: '#5B6573', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} />
                    <span>{cand.lastUpdated}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${cand.status}`}>
                    {getStatusLabel(cand.status)}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onOpenCandidate(cand.id)}
                  >
                    <span>Open Assessment</span>
                    <ArrowRight size={13} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCandidates.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#5B6573' }}>
                  No candidates match the selected filters or search term.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (renders nicely on phones or small viewports) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
        {filteredCandidates.map(cand => (
          <div key={cand.id} className="card" style={{ display: window.innerWidth >= 768 ? 'none' : 'block', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={18} color="#173B63" />
                <div>
                  <div style={{ fontWeight: 600 }}>{cand.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#5B6573' }}>{cand.trade} · {cand.age} yrs</div>
                </div>
              </div>
              <span className={`status-badge ${cand.status}`}>
                {getStatusLabel(cand.status)}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#5B6573', marginBottom: '0.75rem' }}>
              <div><strong>Location:</strong> {cand.location}</div>
              <div><strong>Experience:</strong> {cand.declaration.yearsExperience} yrs (informal)</div>
              <div><strong>Last Updated:</strong> {cand.lastUpdated}</div>
            </div>

            <button 
              className="btn btn-primary btn-sm" 
              style={{ width: '100%' }}
              onClick={() => onOpenCandidate(cand.id)}
            >
              <span>Open Assessment</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
