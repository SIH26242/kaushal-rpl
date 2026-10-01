import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Activity
} from 'lucide-react';
import type { Candidate } from '../types';

interface OverviewViewProps {
  candidates: Candidate[];
  onOpenCandidate: (candidateId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  candidates,
  onOpenCandidate
}) => {
  const ravi = candidates.find(c => c.id === 'cand-001') || candidates[0];

  if (!ravi) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#5B6573' }}>
        Loading assessment workspace...
      </div>
    );
  }

  // Calculate task criteria completion and points for Ravi
  const allCriteria = ravi.tasks?.flatMap(t => t.criteria) || [];
  const totalCriteria = allCriteria.length || 12;
  const scoredCriteria = allCriteria.filter(c => c.score !== null);
  const scoredCriteriaCount = scoredCriteria.length;
  const totalEarnedPoints = scoredCriteria.reduce((sum, c) => sum + (c.score || 0), 0);
  const totalMaxPoints = totalCriteria * 2;
  const completionPct = Math.round((scoredCriteriaCount / totalCriteria) * 100);

  const task1 = ravi.tasks?.[0];
  const task1Points = task1?.criteria.reduce((s, c) => s + (c.score || 0), 0) || 7;
  const task1Scored = task1?.criteria.filter(c => c.score !== null).length || 4;

  const task2 = ravi.tasks?.[1];
  const task2Points = task2?.criteria.reduce((s, c) => s + (c.score || 0), 0) || 5;
  const task2Scored = task2?.criteria.filter(c => c.score !== null).length || 3;

  const task3 = ravi.tasks?.[2];
  const task3Points = task3?.criteria.reduce((s, c) => s + (c.score || 0), 0) || 5;
  const task3Scored = task3?.criteria.filter(c => c.score !== null).length || 3;

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h1>Today's Assessment Work</h1>
          <div className="view-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} />
            <span>Thursday, 1 October 2026 · Kochi Assessment Centre · Anita Menon presiding</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Values */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">12</div>
          <div className="stat-note">8 candidates awaiting practical assessment</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Ready for Review</div>
          <div className="stat-value" style={{ color: 'var(--status-amber-text)' }}>4</div>
          <div className="stat-note">Practical scores awaiting decision</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Scheduled Today</div>
          <div className="stat-value">3</div>
          <div className="stat-note">Electrician & Solar trades</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Saved on Device</div>
          <div className="stat-value" style={{ color: 'var(--accent-teal)' }}>2</div>
          <div className="stat-note">Available offline locally</div>
        </div>
      </div>

      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '-0.75rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
        * Note: Overview counters represent illustrative Kochi Centre-wide metrics; active demo records for testing are listed in the Work Queue below.
      </div>

      {/* Primary Continue Assessment Card for Ravi Kumar */}
      <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="status-badge in_progress">In Progress · Live Bench Assessment</span>
              <span style={{ fontSize: '0.78rem', color: '#5B6573' }}>Candidate ID: #KCH-26242-01</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {ravi.name} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#5B6573' }}>({ravi.age} yrs · {ravi.location})</span>
            </h2>
            <div style={{ fontSize: '0.88rem', color: '#5B6573', marginTop: 3 }}>
              Target Trade: <strong>{ravi.trade}</strong> · 7 years informal on-the-job experience
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => onOpenCandidate(ravi.id)}
          >
            <span>Continue Ravi's Assessment</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Practical assessment progress snippet */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span style={{ fontWeight: 600, color: '#1E293B' }}>Practical Evaluation Rubric Progress</span>
            <span style={{ color: '#5B6573' }}>
              <strong style={{ color: '#173B63' }}>{totalEarnedPoints} of {totalMaxPoints} points recorded</strong> · {scoredCriteriaCount} of {totalCriteria} criteria observed ({completionPct}%)
            </span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${completionPct}%` }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
            <div style={{ background: '#F1F4F8', padding: '0.65rem 0.85rem', borderRadius: 4 }}>
              <div style={{ fontSize: '0.75rem', color: '#5B6573', fontWeight: 500 }}>Task 1: Tools & MCB</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#065F46', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <CheckCircle2 size={13} />
                <span>{task1Scored}/4 criteria · {task1Points}/8 pts</span>
              </div>
            </div>

            <div style={{ background: '#F1F4F8', padding: '0.65rem 0.85rem', borderRadius: 4 }}>
              <div style={{ fontSize: '0.75rem', color: '#5B6573', fontWeight: 500 }}>Task 2: Safe Work Area</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#92400E', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <AlertCircle size={13} />
                <span>{task2Scored}/4 criteria · {task2Points}/8 pts</span>
              </div>
            </div>

            <div style={{ background: '#F1F4F8', padding: '0.65rem 0.85rem', borderRadius: 4 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#5B6573' }}>Task 3: Wiring Board</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#92400E', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Clock size={13} />
                <span>{task3Scored}/4 criteria · {task3Points}/8 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: Recent Activity + Assessor Guidance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Activity size={18} color="var(--primary)" />
              <span>Recent Assessment Activity</span>
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.85rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2E7774', marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: '#1E293B' }}>Task 1 Rubric recorded for Ravi Kumar</div>
                <div style={{ color: '#5B6573', fontSize: '0.78rem' }}>Identified MCB, modular switches, and insulated tools. Scored 7/8 pts.</div>
                <div style={{ color: '#8E98A5', fontSize: '0.72rem', marginTop: 2 }}>Today, 10:25 AM · Anita Menon</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.85rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#92400E', marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: '#1E293B' }}>AI Assistance generated for Meera Das</div>
                <div style={{ color: '#5B6573', fontSize: '0.78rem' }}>Solar PV Installer Assistant · 92% competency profile ready for final assessor review.</div>
                <div style={{ color: '#8E98A5', fontSize: '0.72rem', marginTop: 2 }}>Yesterday, 4:30 PM · Anita Menon</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.85rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5B6573', marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: '#1E293B' }}>Suresh Patil intake record saved offline</div>
                <div style={{ color: '#5B6573', fontSize: '0.78rem' }}>Domestic Wireman (11 yrs experience) · Cached in browser storage.</div>
                <div style={{ color: '#8E98A5', fontSize: '0.72rem', marginTop: 2 }}>2 days ago · Field Intake Officer</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FileText size={18} color="var(--primary)" />
              <span>Assessor Operational Principles</span>
            </h3>
          </div>
          <div style={{ fontSize: '0.84rem', color: '#5B6573', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ background: '#F8FAFC', padding: '0.6rem 0.8rem', borderRadius: 4, borderLeft: '3px solid var(--accent-teal)' }}>
              <strong style={{ color: '#1E293B' }}>Assessor records the final decision:</strong>
              <div>AI provides decision support and consistency checks; the assessor records the final decision.</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: '0.6rem 0.8rem', borderRadius: 4, borderLeft: '3px solid var(--primary)' }}>
              <strong style={{ color: '#1E293B' }}>De-Energized Testing:</strong>
              <div>All candidate wiring runs must be evaluated on isolated, de-energized training boards with locked main supply.</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: '0.6rem 0.8rem', borderRadius: 4, borderLeft: '3px solid #92400E' }}>
              <strong style={{ color: '#1E293B' }}>Respectful Interaction:</strong>
              <div>Value non-formal and informal experience. Candidate self-declarations are mapped as starting points, not final verdicts.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
