import React from 'react';
import { 
  Printer, 
  X, 
  FileCheck2, 
  ShieldCheck
} from 'lucide-react';
import type { Candidate } from '../types';
import { isAIReviewStale } from '../utils/aiReasoning';

interface PrintDossierModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export const PrintDossierModal: React.FC<PrintDossierModalProps> = ({
  candidate,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const allCriteria = candidate.tasks.flatMap(t => t.criteria);
  const earned = allCriteria.reduce((sum, c) => sum + (c.score || 0), 0);
  const totalPossible = allCriteria.length * 2;
  const scoredCount = allCriteria.filter(c => c.score !== null).length;
  const isReviewStale = isAIReviewStale(candidate.aiReview, candidate.tasks);

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      style={{ zIndex: 70 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-modal-title"
    >
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '850px', maxHeight: '92vh' }}
      >
        {/* Modal Controls (Hidden in print) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <div id="dossier-modal-title" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileCheck2 size={18} />
            <span>RPL Assessment Dossier Summary</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={14} />
              <span>Print / Save as PDF</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={14} />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div style={{ padding: '0.5rem', background: '#FFFFFF', color: '#1E293B', fontSize: '0.85rem' }}>
          {/* Header block */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #173B63', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5B6573', fontWeight: 700 }}>
              Recognition of Prior Learning (RPL) · Assessment Record
            </div>
            <h1 style={{ fontSize: '1.35rem', color: '#173B63', margin: '0.25rem 0' }}>
              Candidate Practical Skill Evaluation Dossier
            </h1>
            <div style={{ fontSize: '0.8rem', color: '#5B6573' }}>
              Kochi Assessment Centre · Reference: RPL-{candidate.id.toUpperCase()}-2026
            </div>
            <div style={{ display: 'inline-block', marginTop: 6, fontSize: '0.72rem', background: '#F1F4F8', border: '1px solid #DDE2E8', padding: '2px 8px', borderRadius: 4, color: '#5B6573' }}>
              Prototype Demonstration Dossier · For Assessment Committee Review
            </div>
          </div>

          {/* Candidate Profile Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', background: '#F8FAFC', padding: '0.85rem', borderRadius: 4, border: '1px solid #DDE2E8', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#5B6573' }}>Candidate Name</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{candidate.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#5B6573' }}>Age & Location</div>
              <div>{candidate.age} yrs · {candidate.location}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#5B6573' }}>Target Trade</div>
              <div style={{ fontWeight: 600, color: '#173B63' }}>{candidate.trade}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#5B6573' }}>Declared Experience</div>
              <div>{candidate.declaration.yearsExperience} years informal</div>
            </div>
          </div>

          {/* Qualification Mapping Summary */}
          <div style={{ marginBottom: '1.25rem', padding: '0.75rem', border: '1px solid #DDE2E8', borderRadius: 4 }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#173B63', marginBottom: 4 }}>
              Illustrative Qualification Mapping Evaluation
            </div>
            <div style={{ fontSize: '0.8rem', color: '#5B6573', display: 'flex', justifyContent: 'space-between' }}>
              <span>Suggested Qualification: <strong>{candidate.mapping.suggestedQualification}</strong></span>
              <span>Correlation Score: <strong>{candidate.mapping.matchScore}%</strong></span>
              <span>Status: <strong>{candidate.mapping.isAccepted ? 'Accepted for Assessment' : 'Under Review'}</strong></span>
            </div>
          </div>

          {/* Practical Assessment Rubric Table */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#173B63' }}>
                Practical Assessment Rubric Performance (0–2 Scale)
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                Score: {earned} / {totalPossible} Points ({scoredCount}/{allCriteria.length} observed)
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid #DDE2E8' }}>
              <thead>
                <tr style={{ background: '#F1F4F8' }}>
                  <th style={{ padding: '6px 8px', border: '1px solid #DDE2E8', textAlign: 'left' }}>Task & Criterion Description</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #DDE2E8', textAlign: 'center', width: '80px' }}>Category</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #DDE2E8', textAlign: 'center', width: '60px' }}>Score</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #DDE2E8', textAlign: 'left' }}>Assessor Clinical Observation</th>
                </tr>
              </thead>
              <tbody>
                {candidate.tasks.map(task => (
                  <React.Fragment key={task.id}>
                    <tr style={{ background: '#F8FAFC' }}>
                      <td colSpan={4} style={{ padding: '4px 8px', border: '1px solid #DDE2E8', fontWeight: 700, color: '#173B63' }}>
                        Task {task.taskNumber}: {task.title}
                      </td>
                    </tr>
                    {task.criteria.map(c => (
                      <tr key={c.id}>
                        <td style={{ padding: '6px 8px', border: '1px solid #DDE2E8' }}>{c.title}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #DDE2E8', textAlign: 'center', textTransform: 'capitalize' }}>{c.category}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #DDE2E8', textAlign: 'center', fontWeight: 700 }}>
                          {c.score !== null ? `${c.score}/2` : 'Pending'}
                        </td>
                        <td style={{ padding: '6px 8px', border: '1px solid #DDE2E8', color: '#5B6573' }}>
                          {c.assessorObservation || 'No specific observation note recorded.'}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Decision Support Summary */}
          {candidate.aiReview && (
            <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: 4, border: '1px solid #DDE2E8', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#173B63', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>AI Decision-Support Consistency Profile (Prototype Advisory)</span>
                {isReviewStale && (
                  <span style={{ fontSize: '0.7rem', color: '#92400E', background: '#FEF3C7', padding: '1px 6px', borderRadius: 3, border: '1px solid #FDE68A', fontWeight: 600 }}>
                    Analysis Stale (Rubric was modified)
                  </span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.78rem', marginBottom: 6 }}>
                <div>Technical Competency: <strong>{candidate.aiReview.technicalCompetencyPct}%</strong></div>
                <div>Safety Compliance: <strong>{candidate.aiReview.safetyCompliancePct}%</strong></div>
                <div>Practical Wiring: <strong>{candidate.aiReview.practicalSkillsPct}%</strong></div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#5B6573' }}>
                <strong>Key Assessor Risk Flags: </strong>
                {candidate.aiReview.riskFlags.join('; ') || 'None flagged.'}
              </div>
            </div>
          )}

          {/* Assessor Sign-Off Block */}
          <div style={{ border: '2px solid #173B63', borderRadius: 4, padding: '1rem', background: '#FAFCFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#5B6573', fontWeight: 700 }}>
                  Assessor Final Determination
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#173B63', marginTop: 2 }}>
                  {candidate.assessorDecision?.confirmed 
                    ? candidate.assessorDecision.decision.replace(/_/g, ' ').toUpperCase() 
                    : 'ASSESSMENT IN PROGRESS · PENDING ASSESSOR SIGN-OFF'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#5B6573' }}>Date of Determination</div>
                <div style={{ fontWeight: 600 }}>{candidate.assessorDecision?.date || 'Pending'}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#1E293B', marginBottom: '1rem' }}>
              <strong>Assessor Rationale / Clinical Justification:</strong>
              <div style={{ marginTop: 2, color: '#5B6573', fontStyle: 'italic' }}>
                "{candidate.assessorDecision?.rationale || 'Assessment rubric underway on testing bench.'}"
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #DDE2E8', paddingTop: '0.75rem', fontSize: '0.78rem' }}>
              <div>
                <div>Appointed Assessor: <strong>{candidate.assessorDecision?.assessorName || 'Anita Menon'}</strong></div>
                <div style={{ color: '#5B6573' }}>Kochi Centre Assessment Panel (Demo)</div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 4, color: '#065F46' }}>
                <ShieldCheck size={16} />
                <span>Assessor records the final decision</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
