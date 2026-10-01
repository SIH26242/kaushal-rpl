import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  UserCheck, 
  Database,
  RefreshCw
} from 'lucide-react';
import type { Candidate, AssessmentTask, AIReviewResult, AssessorDecision } from '../../types';
import { generateAIReview, isAIReviewStale } from '../../utils/aiReasoning';

interface AIAssistanceDecisionPanelProps {
  candidate: Candidate;
  tasks: AssessmentTask[];
  onSaveAIReview: (review: AIReviewResult) => void;
  onClearAIReview?: () => void;
  onRecordDecision: (decision: AssessorDecision) => void;
  onOpenDossier: () => void;
}

export const AIAssistanceDecisionPanel: React.FC<AIAssistanceDecisionPanelProps> = ({
  candidate,
  tasks,
  onSaveAIReview,
  onClearAIReview,
  onRecordDecision,
  onOpenDossier
}) => {
  const [aiReview, setAiReview] = useState<AIReviewResult | undefined>(candidate.aiReview);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDataBasis, setShowDataBasis] = useState(false);

  // Sync state if candidate.aiReview changes upstream
  useEffect(() => {
    setAiReview(candidate.aiReview);
  }, [candidate.aiReview]);

  // Calculate live criteria completion and scores
  const incompleteCriteria = tasks.flatMap(t => t.criteria).filter(c => c.score === null);
  const hasIncompleteCriteria = incompleteCriteria.length > 0;
  const currentEarnedPoints = tasks.flatMap(t => t.criteria).reduce((sum, c) => sum + (c.score || 0), 0);
  const currentScoredCount = tasks.flatMap(t => t.criteria).filter(c => c.score !== null).length;

  // Determine if previously generated AI suggestions are stale against current rubric scores
  const isStale = isAIReviewStale(aiReview, tasks);

  // Assessor decision state starts empty unless already recorded
  const existingDecision = candidate.assessorDecision;
  const [selectedDecision, setSelectedDecision] = useState<AssessorDecision['decision'] | null>(
    existingDecision?.decision || null
  );
  const [assessorNotes, setAssessorNotes] = useState<string>(
    existingDecision?.rationale || ''
  );
  const [assessorName, setAssessorName] = useState<string>(
    existingDecision?.assessorName || 'Anita Menon'
  );
  const [assessorDate, setAssessorDate] = useState<string>(
    existingDecision?.date || new Date().toISOString().split('T')[0]
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateAIReview(candidate, tasks);
      setAiReview(result);
      onSaveAIReview(result);
      setIsGenerating(false);
    }, 400);
  };

  const handleInitiateDecision = () => {
    if (!selectedDecision) {
      setValidationError('Please select a determination outcome before saving.');
      return;
    }
    if (selectedDecision === 'competencies_demonstrated' && hasIncompleteCriteria) {
      setValidationError(`Cannot record "Competencies Demonstrated" while ${incompleteCriteria.length} criteria remain unscored.`);
      return;
    }
    if (!assessorNotes.trim()) {
      setValidationError('Assessor rationale and findings notes are required before saving a decision.');
      return;
    }
    setValidationError(null);
    setShowConfirmModal(true);
  };

  const handleConfirmDecision = () => {
    if (!selectedDecision) return;
    const finalDecision: AssessorDecision = {
      decision: selectedDecision,
      assessorName,
      assessorRole: 'Lead RPL Assessor (Demo)',
      date: assessorDate,
      rationale: assessorNotes,
      confirmed: true
    };
    onRecordDecision(finalDecision);
    setShowConfirmModal(false);
  };

  const getDecisionTitle = (dec: AssessorDecision['decision'] | null) => {
    if (!dec) return 'No outcome selected';
    switch (dec) {
      case 'competencies_demonstrated':
        return 'Competencies Demonstrated (Practical Criteria Satisfied)';
      case 'further_assessment_needed':
        return 'Further Assessment Needed (Specific Criteria Re-Demonstration)';
      case 'refer_for_training':
        return 'Refer for Additional Training / Bridge Modules';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Advisory Banner */}
      <div className="notice-box notice-info" style={{ marginBottom: 0 }}>
        <Sparkles size={18} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong style={{ display: 'block', marginBottom: 2 }}>
            Decision Support Policy Notice
          </strong>
          The AI analysis below provides consistency checks, rubric aggregation, and risk flags derived solely from the rubric scores, observations, and candidate self-declaration. It does not certify candidates or replace assessor judgment. The assessor records the final decision.
        </div>
      </div>

      {/* AI Decision Support Section */}
      <div className="card" style={{ borderLeft: isStale ? '4px solid #D97706' : '4px solid var(--primary)' }}>
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={18} color={isStale ? '#D97706' : 'var(--primary)'} />
            <span>AI-Assisted Assessment Analysis</span>
            {isStale ? (
              <span style={{ 
                fontSize: '0.72rem', 
                background: '#FEF3C7', 
                color: '#92400E', 
                border: '1px solid #FDE68A', 
                padding: '2px 8px', 
                borderRadius: 4, 
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}>
                <AlertTriangle size={12} />
                <span>Analysis Stale · Rubric Scores Changed</span>
              </span>
            ) : (
              <span style={{ fontSize: '0.72rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                Prototype Analysis Model
              </span>
            )}
          </div>

          <button 
            className="btn btn-primary btn-sm"
            onClick={handleGenerateAI}
            disabled={isGenerating}
          >
            {isGenerating ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
            <span>{isGenerating ? 'Evaluating Rubric...' : isStale ? 'Re-evaluate with Current Scores' : 'Generate Assessment Assistance'}</span>
          </button>
        </div>

        {aiReview ? (
          <div>
            {/* Stale Warning Banner */}
            {isStale && (
              <div className="notice-box notice-warning" style={{ marginBottom: '1.25rem' }}>
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.86rem' }}>
                    AI Suggestion is Stale — Rubric Scores Have Changed
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#78350F', marginTop: 3, lineHeight: 1.45 }}>
                    The practical rubric currently records <strong>{currentEarnedPoints} of 24 points ({currentScoredCount}/12 criteria scored)</strong>. 
                    This suggestion was evaluated earlier against <strong>{aiReview.earnedPoints} of 24 points</strong>.
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem' }}>
                    <button 
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                    >
                      <Sparkles size={13} />
                      <span>Re-evaluate with Current Scores</span>
                    </button>
                    {onClearAIReview && (
                      <button 
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setAiReview(undefined);
                          onClearAIReview();
                        }}
                      >
                        <span>Clear Stale Suggestion</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Summary Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.25rem', opacity: isStale ? 0.75 : 1 }}>
              <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: '#5B6573', fontWeight: 600, textTransform: 'uppercase' }}>Technical Competency</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#173B63', marginTop: 2 }}>
                  {aiReview.technicalCompetencyPct}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#8E98A5' }}>Component & tool usage</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: '#5B6573', fontWeight: 600, textTransform: 'uppercase' }}>Safety Compliance</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: aiReview.safetyCompliancePct >= 75 ? '#065F46' : '#92400E', marginTop: 2 }}>
                  {aiReview.safetyCompliancePct}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#8E98A5' }}>Isolation & PPE checks</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: '#5B6573', fontWeight: 600, textTransform: 'uppercase' }}>Practical Skills</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#065F46', marginTop: 2 }}>
                  {aiReview.practicalSkillsPct}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#8E98A5' }}>Wiring board terminations</div>
              </div>

              <div style={{ 
                background: isStale ? '#FEF3C7' : 'var(--primary-light)', 
                padding: '0.75rem', 
                borderRadius: 6, 
                border: isStale ? '1px dashed #D97706' : '1px solid rgba(23, 59, 99, 0.15)' 
              }}>
                <div style={{ fontSize: '0.74rem', color: isStale ? '#92400E' : '#173B63', fontWeight: 700, textTransform: 'uppercase' }}>
                  Overall Suggested Rating
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isStale ? '#92400E' : '#173B63', marginTop: 2 }}>
                  {aiReview.overallCompetencyPct}%
                </div>
                <div style={{ fontSize: '0.7rem', color: isStale ? '#92400E' : '#5B6573', fontWeight: isStale ? 600 : 400 }}>
                  {isStale 
                    ? `Stale: was ${aiReview.earnedPoints}/${aiReview.totalPoints} pts` 
                    : `${aiReview.earnedPoints}/${aiReview.totalPoints} points recorded`}
                </div>
              </div>
            </div>

            {/* Strengths & Verification Gaps */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--status-green-bg)', padding: '0.85rem', borderRadius: 6, border: '1px solid var(--status-green-border)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--status-green-text)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <CheckCircle2 size={15} />
                  <span>Demonstrated Strengths (Grounded in Rubric):</span>
                </div>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--status-green-text)' }}>
                  {aiReview.strengths.map((str, idx) => (
                    <li key={idx} style={{ marginBottom: 3 }}>{str}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: 'var(--status-amber-bg)', padding: '0.85rem', borderRadius: 6, border: '1px solid var(--status-amber-border)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--status-amber-text)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <AlertTriangle size={15} />
                  <span>Verification Priorities / Flags for Assessor:</span>
                </div>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--status-amber-text)' }}>
                  {aiReview.riskFlags.map((rf, idx) => (
                    <li key={idx} style={{ marginBottom: 3 }}>{rf}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Suggested Next Step */}
            <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: 6, border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.82rem', color: '#1E293B', display: 'block', marginBottom: 2 }}>
                Suggested Assessor Action:
              </strong>
              <div style={{ fontSize: '0.84rem', color: '#5B6573' }}>
                {aiReview.suggestedNextStep}
              </div>
            </div>

            {/* Inspectable Data Basis Accordion */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <button 
                type="button"
                onClick={() => setShowDataBasis(!showDataBasis)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#5B6573', 
                  fontSize: '0.78rem', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Database size={13} />
                <span>{showDataBasis ? 'Hide Data Basis Used in Prototype Analysis' : 'Inspect Data Basis Used in Prototype Analysis'}</span>
              </button>

              {showDataBasis && (
                <div style={{ marginTop: '0.5rem', background: '#F1F4F8', padding: '0.75rem', borderRadius: 4, fontSize: '0.76rem', color: '#1E293B' }}>
                  <div><strong>Rubric Points Source:</strong> {aiReview.dataBasis.rubricPointsRecorded}</div>
                  <div><strong>Observations Analyzed:</strong> {aiReview.dataBasis.observationsEvaluated} criterion observations evaluated</div>
                  <div><strong>Candidate Experience Inputs:</strong> {aiReview.dataBasis.keyDeclarationSignals.join(' · ')}</div>
                  <div style={{ color: '#8E98A5', marginTop: 4 }}>
                    Deterministic rule-based aggregation. No external computer vision or unsupported emotion analysis model was utilized.
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#5B6573' }}>
            <Sparkles size={28} color="#8E98A5" style={{ margin: '0 auto 0.5rem auto' }} />
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>No AI Analysis Generated Yet</div>
            <div style={{ fontSize: '0.8rem', maxWidth: 450, margin: '0.25rem auto 1rem auto' }}>
              Click "Generate Assessment Assistance" to produce grounded consistency scores, strength highlights, and verification flags from current rubric scores.
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleGenerateAI}>
              <Sparkles size={14} />
              <span>Generate Assessment Assistance</span>
            </button>
          </div>
        )}
      </div>

      {/* Assessor Final Determination Section */}
      <div className="card" style={{ borderTop: '4px solid var(--accent-teal)' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <UserCheck size={18} color="var(--accent-teal)" />
              <span>Assessor Final Determination</span>
            </h3>
            <span style={{ fontSize: '0.76rem', color: '#5B6573' }}>
              Assessor review: Anita Menon (Lead Assessor, Demo)
            </span>
          </div>

          {existingDecision?.confirmed && (
            <span style={{ 
              background: 'var(--status-green-bg)', 
              color: 'var(--status-green-text)', 
              border: '1px solid var(--status-green-border)',
              padding: '0.3rem 0.65rem', 
              borderRadius: 4, 
              fontSize: '0.78rem', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <CheckCircle2 size={14} />
              <span>Decision Officially Recorded</span>
            </span>
          )}
        </div>

        {/* Form Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Determination Outcome</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <label 
                style={{ 
                  display: 'block',
                  padding: '0.85rem', 
                  borderRadius: 6, 
                  border: selectedDecision === 'competencies_demonstrated' ? '2px solid var(--accent-teal)' : '1px solid var(--border-color)',
                  background: hasIncompleteCriteria ? '#F8FAFC' : selectedDecision === 'competencies_demonstrated' ? 'var(--accent-teal-light)' : '#FFFFFF',
                  cursor: hasIncompleteCriteria ? 'not-allowed' : 'pointer',
                  opacity: hasIncompleteCriteria ? 0.75 : 1
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input 
                    type="radio" 
                    name="decision_outcome"
                    disabled={hasIncompleteCriteria}
                    checked={selectedDecision === 'competencies_demonstrated'} 
                    onChange={() => {
                      if (!hasIncompleteCriteria) setSelectedDecision('competencies_demonstrated');
                    }}
                  />
                  <span>Competencies Demonstrated</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: hasIncompleteCriteria ? '#991B1B' : '#5B6573', marginTop: 4, paddingLeft: 18 }}>
                  {hasIncompleteCriteria 
                    ? `Unavailable: ${incompleteCriteria.length} criteria remain unscored.`
                    : 'Candidate satisfies observed practical and safety criteria for this trade pack.'}
                </div>
              </label>

              <label 
                style={{ 
                  display: 'block',
                  padding: '0.85rem', 
                  borderRadius: 6, 
                  border: selectedDecision === 'further_assessment_needed' ? '2px solid #92400E' : '1px solid var(--border-color)',
                  background: selectedDecision === 'further_assessment_needed' ? '#FEF3C7' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input 
                    type="radio" 
                    name="decision_outcome"
                    checked={selectedDecision === 'further_assessment_needed'} 
                    onChange={() => setSelectedDecision('further_assessment_needed')}
                  />
                  <span>Further Assessment Needed</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#5B6573', marginTop: 4, paddingLeft: 18 }}>
                  Candidate needs re-demonstration on specific criteria (e.g. live-dead-live test).
                </div>
              </label>

              <label 
                style={{ 
                  display: 'block',
                  padding: '0.85rem', 
                  borderRadius: 6, 
                  border: selectedDecision === 'refer_for_training' ? '2px solid #991B1B' : '1px solid var(--border-color)',
                  background: selectedDecision === 'refer_for_training' ? '#FEE2E2' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input 
                    type="radio" 
                    name="decision_outcome"
                    checked={selectedDecision === 'refer_for_training'} 
                    onChange={() => setSelectedDecision('refer_for_training')}
                  />
                  <span>Refer for Additional Training</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#5B6573', marginTop: 4, paddingLeft: 18 }}>
                  Recommend structured short-term bridge module before re-attempting RPL.
                </div>
              </label>
            </div>
          </div>

          {/* Assessor Rationale Textarea */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Assessor Evaluation Rationale & Findings <span style={{ color: '#991B1B' }}>*</span>
            </label>
            <textarea 
              className="form-textarea"
              rows={3}
              value={assessorNotes}
              onChange={(e) => setAssessorNotes(e.target.value)}
              placeholder="State the justification for your determination, noting verified competencies and observed safety compliance..."
            />
            {validationError && (
              <span style={{ fontSize: '0.78rem', color: '#991B1B', marginTop: 4, display: 'block' }}>
                {validationError}
              </span>
            )}
          </div>

          {/* Name & Date fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Assessor Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={assessorName}
                onChange={(e) => setAssessorName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Assessment Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={assessorDate}
                onChange={(e) => setAssessorDate(e.target.value)}
              />
            </div>
          </div>

          {/* Decision Status Banner or Submit Button */}
          {existingDecision?.confirmed ? (
            <div style={{ 
              background: 'var(--status-green-bg)', 
              border: '1px solid var(--status-green-border)', 
              borderRadius: 6, 
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--status-green-text)', fontSize: '0.9rem' }}>
                  Decision recorded by {existingDecision.assessorName}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--status-green-text)' }}>
                  Outcome: <strong>{getDecisionTitle(existingDecision.decision)}</strong> · Recorded on {existingDecision.date}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={onOpenDossier}>
                  <FileCheck size={14} />
                  <span>View Assessment Dossier / Print</span>
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowConfirmModal(true)}>
                  <span>Edit Decision</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button className="btn btn-primary" onClick={handleInitiateDecision}>
                <CheckCircle2 size={16} />
                <span>Record Assessor Decision</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowConfirmModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-decision-title"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h3 className="card-title" id="confirm-decision-title">
                <UserCheck size={18} color="var(--primary)" />
                <span>Confirm Assessor Determination</span>
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowConfirmModal(false)} aria-label="Close dialog">✕</button>
            </div>

            <div style={{ fontSize: '0.88rem', color: '#1E293B', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Please review the recorded determination before saving:
            </div>

            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 6, border: '1px solid var(--border-color)', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
              <div><strong>Candidate:</strong> {candidate.name} (ID: #{candidate.id})</div>
              <div><strong>Trade Assessed:</strong> {candidate.trade}</div>
              <div><strong>Recorded Outcome:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{getDecisionTitle(selectedDecision)}</span></div>
              <div><strong>Assessor Sign-Off:</strong> {assessorName} ({assessorDate})</div>
              <div><strong>Rationale:</strong> <em>"{assessorNotes}"</em></div>
            </div>

            <div className="notice-box notice-warning" style={{ fontSize: '0.78rem', marginBottom: '1.25rem' }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <div>
                Confirmation: Practical observations will be saved to this local assessment record in accordance with centre de-energized test bench procedures.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmDecision}>
                <CheckCircle2 size={16} />
                <span>Save Assessor Determination</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
