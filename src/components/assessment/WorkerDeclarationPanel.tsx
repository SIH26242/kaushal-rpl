import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Save, 
  AlertTriangle, 
  Info, 
  Check
} from 'lucide-react';
import type { Candidate, WorkerDeclaration } from '../../types';

interface WorkerDeclarationPanelProps {
  candidate: Candidate;
  onSaveDeclaration: (updatedDeclaration: WorkerDeclaration) => void;
  onAcceptMapping: () => void;
  onChangeQualification: (newQual: string, matchScore: number, reason: string) => void;
  onNextToRubric: () => void;
}

const AVAILABLE_QUALIFICATIONS = [
  {
    title: 'Assistant Electrician',
    score: 86,
    badge: 'Recommended Demo Match',
    reason: 'Matches 7 years declared informal domestic wiring, switchboards, and insulated tool usage.'
  },
  {
    title: 'Domestic Wireman',
    score: 78,
    badge: 'Secondary Match',
    reason: 'Single-phase residential installations; needs verified conduit bending demonstration.'
  },
  {
    title: 'Electrician (Full Scope / Three Phase)',
    score: 62,
    badge: 'Higher Scope',
    reason: 'Requires industrial three-phase power distribution and motor starters not evidenced in declaration.'
  }
];

const AVAILABLE_ACTIVITIES = [
  'Domestic house wiring (PVC conduit & batten)',
  'Switch & socket installation and replacements',
  'MCB and distribution board installation under guidance',
  'Basic domestic fault identification (blown fuse, loose terminal)',
  'Ceiling fan and LED lighting fixture installation',
  'Three-phase industrial panel assembly',
  'Earthing pit soil resistance testing',
  'Solar PV inverter DC string routing'
];

const AVAILABLE_TOOLS = [
  'Insulated screwdrivers (Phillips & flat)',
  'Wire strippers and side cutting pliers',
  'Neon phase tester / voltage detector',
  'Basic digital multimeter (AC voltage, continuity buzzer)',
  'Crimping tool and utility knife',
  'Earth Megger insulation tester',
  'Conduit pipe bender'
];

const AVAILABLE_SAFETY = [
  'Always isolates main DP switch before opening any socket plate',
  'Uses rubber-soled footwear at client sites',
  'Assessor noted: Needs formal practice on live-dead-live testing sequence',
  'Avoids working on energized overhead lines',
  'Wears safety helmet on active construction areas'
];

export const WorkerDeclarationPanel: React.FC<WorkerDeclarationPanelProps> = ({
  candidate,
  onSaveDeclaration,
  onAcceptMapping,
  onChangeQualification,
  onNextToRubric
}) => {
  const [formData, setFormData] = useState<WorkerDeclaration>({
    ...candidate.declaration
  });
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [showMappingSignalsModal, setShowMappingSignalsModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  const toggleActivity = (item: string) => {
    const current = formData.activities;
    const updated = current.includes(item)
      ? current.filter(x => x !== item)
      : [...current, item];
    setFormData({ ...formData, activities: updated });
  };

  const toggleTool = (item: string) => {
    const current = formData.toolsUsed;
    const updated = current.includes(item)
      ? current.filter(x => x !== item)
      : [...current, item];
    setFormData({ ...formData, toolsUsed: updated });
  };

  const toggleSafety = (item: string) => {
    const current = formData.safetyPractices;
    const updated = current.includes(item)
      ? current.filter(x => x !== item)
      : [...current, item];
    setFormData({ ...formData, safetyPractices: updated });
  };

  const handleSave = () => {
    onSaveDeclaration(formData);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const handleSelectNewQualification = (item: typeof AVAILABLE_QUALIFICATIONS[0]) => {
    onChangeQualification(item.title, item.score, item.reason);
    setShowChangeModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Illustrative Qualification Mapping Card */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent-teal)' }}>
        <div className="card-header" style={{ borderBottomColor: 'rgba(46, 119, 116, 0.15)' }}>
          <div className="card-title">
            <Sparkles size={18} color="var(--accent-teal)" />
            <span>Illustrative Qualification Mapping</span>
            <span style={{ fontSize: '0.72rem', background: 'var(--accent-teal-light)', color: 'var(--accent-teal)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
              Prototype Rule-Based Suggestions
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowMappingSignalsModal(true)}
            >
              <Info size={14} />
              <span>Review Mapping Signals</span>
            </button>
            <button 
              type="button"
              className={`btn btn-sm ${candidate.mapping.isAccepted ? 'btn-accent' : 'btn-primary'}`}
              onClick={onAcceptMapping}
            >
              <Check size={14} />
              <span>{candidate.mapping.isAccepted ? 'Accepted for Assessment' : 'Accept for this Assessment'}</span>
            </button>
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowChangeModal(true)}
              title="Adjust illustrative target qualification mapping"
            >
              <span>Change Illustrative Mapping</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#173B63' }}>
                {candidate.mapping.suggestedQualification}
              </span>
              <span style={{ 
                background: 'var(--status-green-bg)', 
                color: 'var(--status-green-text)', 
                padding: '2px 8px', 
                borderRadius: 4, 
                fontWeight: 700,
                fontSize: '0.82rem'
              }}>
                {candidate.mapping.matchScore}% Match
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#5B6573', marginTop: 2 }}>
              Rule-based prototype suggestion derived from declared experience keywords and tool familiarity.
            </div>

            <div style={{ marginTop: '0.85rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>
                Supporting Signals Extracted:
              </div>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#5B6573' }}>
                {candidate.mapping.supportingSignals.map((sig, i) => (
                  <li key={i} style={{ marginBottom: 2 }}>{sig}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: 6, border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#92400E', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <AlertTriangle size={14} />
              <span>Assessor Verification Priorities:</span>
            </div>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#5B6573' }}>
              {candidate.mapping.needsVerification.map((req, i) => (
                <li key={i} style={{ marginBottom: 3 }}>{req}</li>
              ))}
            </ul>

            <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.75rem' }}>
              <span style={{ fontWeight: 600, color: '#5B6573' }}>Other possible match: </span>
              <span style={{ color: '#1E293B' }}>{candidate.mapping.alternativeMatch.qualification} ({candidate.mapping.alternativeMatch.matchScore}%)</span>
              <div style={{ color: '#8E98A5', marginTop: 2 }}>{candidate.mapping.alternativeMatch.reason}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '0.85rem', fontSize: '0.74rem', color: '#5B6573', background: '#F1F4F8', padding: '0.5rem 0.75rem', borderRadius: 4, lineHeight: 1.4 }}>
          * Notice: In this single-trade demo workspace, adjusting the qualification changes the candidate's illustrative mapping profile only; practical rubric criteria remain standardized to the electrical assessment bench.
        </div>
      </div>

      {/* Structured Self-Declaration Form */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Worker Prior Experience Declaration</h3>
            <span style={{ fontSize: '0.78rem', color: '#5B6573' }}>
              Candidate: <strong>{candidate.name}</strong> · Mode: Informal on-the-job training in Kerala
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isSavedRecently && (
              <span style={{ fontSize: '0.8rem', color: 'var(--status-green-text)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={14} />
                <span>Declaration saved locally</span>
              </span>
            )}
            <button className="btn btn-secondary btn-sm" onClick={handleSave}>
              <Save size={14} />
              <span>Save Declaration</span>
            </button>
          </div>
        </div>

        {/* Basic Metadata Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Years of Informal Experience</label>
            <input 
              type="number" 
              className="form-input" 
              value={formData.yearsExperience} 
              onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Work Setting</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.workSetting} 
              onChange={(e) => setFormData({ ...formData, workSetting: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Prior Learning Pathway</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.priorLearningType} 
              onChange={(e) => setFormData({ ...formData, priorLearningType: e.target.value })}
            />
          </div>
        </div>

        {/* Activities Declared */}
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">
            Work Activities Regularly Performed (Click to toggle declared competencies)
          </label>
          <div className="chip-container">
            {AVAILABLE_ACTIVITIES.map(act => {
              const selected = formData.activities.includes(act);
              return (
                <div 
                  key={act} 
                  className={`chip-item ${selected ? 'selected' : ''}`}
                  onClick={() => toggleActivity(act)}
                >
                  {selected ? <Check size={13} /> : <span style={{ width: 13 }}>+</span>}
                  <span>{act}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tools Handled */}
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Tools and Test Instruments Used</label>
          <div className="chip-container">
            {AVAILABLE_TOOLS.map(tool => {
              const selected = formData.toolsUsed.includes(tool);
              return (
                <div 
                  key={tool} 
                  className={`chip-item ${selected ? 'selected' : ''}`}
                  onClick={() => toggleTool(tool)}
                >
                  {selected ? <Check size={13} /> : <span style={{ width: 13 }}>+</span>}
                  <span>{tool}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Practices Declared */}
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Self-Reported Safety Procedures</label>
          <div className="chip-container">
            {AVAILABLE_SAFETY.map(safe => {
              const selected = formData.safetyPractices.includes(safe);
              return (
                <div 
                  key={safe} 
                  className={`chip-item ${selected ? 'selected' : ''}`}
                  onClick={() => toggleSafety(safe)}
                >
                  {selected ? <Check size={13} /> : <span style={{ width: 13 }}>+</span>}
                  <span>{safe}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Narrative */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Candidate Self-Declaration Narrative (Transcribed or Entered)</label>
          <textarea 
            className="form-textarea"
            rows={3}
            value={formData.narrative}
            onChange={(e) => setFormData({ ...formData, narrative: e.target.value })}
            placeholder="Candidate explains their work background in their own words..."
          />
        </div>

        {/* Assessor Declaration Intake Notes */}
        <div className="form-group">
          <label className="form-label">Assessor Intake Observation Notes</label>
          <textarea 
            className="form-textarea"
            rows={2}
            value={formData.assessorNotes || ''}
            onChange={(e) => setFormData({ ...formData, assessorNotes: e.target.value })}
            placeholder="Notes on communication, language preference, clarity of trade terminology..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: '#5B6573' }}>
            Last saved: {candidate.declaration.lastSaved || 'Initial seed state'}
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={handleSave}>
              <Save size={15} />
              <span>Save Declaration</span>
            </button>
            <button className="btn btn-primary" onClick={onNextToRubric}>
              <span>Proceed to Practical Assessment Rubric →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Review Mapping Signals */}
      {showMappingSignalsModal && (
        <div className="modal-overlay" onClick={() => setShowMappingSignalsModal(false)} role="dialog" aria-modal="true" aria-labelledby="signals-title">
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h3 id="signals-title" className="card-title">
                <Sparkles size={18} color="var(--accent-teal)" />
                <span>Qualification Mapping Engine Signals</span>
              </h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowMappingSignalsModal(false)} aria-label="Close modal">✕</button>
            </div>

            <div style={{ fontSize: '0.86rem', color: '#1E293B', marginBottom: '1rem' }}>
              The prototype rule-based mapping engine evaluated declared experience attributes against standard trade qualification packs:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#F1F4F8', padding: '0.75rem', borderRadius: 4 }}>
                <div style={{ fontWeight: 600, color: '#173B63', fontSize: '0.84rem' }}>Signal 1: Experience Duration (7 Years)</div>
                <div style={{ fontSize: '0.8rem', color: '#5B6573' }}>Satisfies recommended threshold for Assistant Electrician RPL track. Contributes +30% weight.</div>
              </div>

              <div style={{ background: '#F1F4F8', padding: '0.75rem', borderRadius: 4 }}>
                <div style={{ fontWeight: 600, color: '#173B63', fontSize: '0.84rem' }}>Signal 2: Modular Accessories & Conduit Wiring</div>
                <div style={{ fontSize: '0.8rem', color: '#5B6573' }}>Keyword match with domestic electrical installation units. Contributes +35% weight.</div>
              </div>

              <div style={{ background: '#F1F4F8', padding: '0.75rem', borderRadius: 4 }}>
                <div style={{ fontWeight: 600, color: '#173B63', fontSize: '0.84rem' }}>Signal 3: Insulated Hand Tools & Tester</div>
                <div style={{ fontSize: '0.8rem', color: '#5B6573' }}>Matches base tool handling requirements for single-phase installation. Contributes +21% weight.</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowMappingSignalsModal(false)}>
                Close Signal Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adjusting Illustrative Mapping */}
      {showChangeModal && (
        <div className="modal-overlay" onClick={() => setShowChangeModal(false)} role="dialog" aria-modal="true" aria-labelledby="change-qual-title">
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="card-header">
              <h3 id="change-qual-title" className="card-title">
                <Sparkles size={18} color="var(--accent-teal)" />
                <span>Adjust Illustrative Qualification Mapping</span>
              </h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowChangeModal(false)} aria-label="Close modal">✕</button>
            </div>

            <div className="notice-box notice-info" style={{ fontSize: '0.8rem', marginBottom: '1rem', lineHeight: 1.45 }}>
              <Info size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Illustrative Mapping Adjustment:</strong> Choose an alternative qualification match to explore qualification alignment signals. In this single-trade demo, practical rubric criteria remain standardized to the electrical test bench.
              </div>
            </div>

            <div style={{ fontSize: '0.84rem', color: '#1E293B', marginBottom: '0.75rem', fontWeight: 600 }}>
              Available Qualification Packs:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {AVAILABLE_QUALIFICATIONS.map(q => {
                const isCurrent = candidate.mapping.suggestedQualification === q.title;
                return (
                  <div 
                    key={q.title}
                    style={{ 
                      padding: '0.85rem 1rem', 
                      borderRadius: 6, 
                      border: isCurrent ? '2px solid var(--accent-teal)' : '1px solid var(--border-color)',
                      background: isCurrent ? 'var(--accent-teal-light)' : '#FFFFFF',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#173B63', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{q.title}</span>
                        <span style={{ fontSize: '0.72rem', background: '#F1F4F8', border: '1px solid #DDE2E8', padding: '1px 6px', borderRadius: 4, fontWeight: 600, color: '#5B6573' }}>
                          {q.score}% Match
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#5B6573', marginTop: 3 }}>
                        {q.reason}
                      </div>
                    </div>

                    <button 
                      type="button"
                      className={`btn btn-sm ${isCurrent ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleSelectNewQualification(q)}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Current' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowChangeModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
