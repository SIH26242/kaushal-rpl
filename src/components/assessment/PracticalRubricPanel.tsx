import React, { useState, useRef } from 'react';
import { 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  Camera, 
  Video, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Paperclip
} from 'lucide-react';
import type { AssessmentTask, RubricCriterionScore, EvidenceItem } from '../../types';

interface PracticalRubricPanelProps {
  tasks: AssessmentTask[];
  onUpdateTasks: (tasks: AssessmentTask[], shouldLogSync?: boolean) => void;
  onProceedToReview: () => void;
}

export const PracticalRubricPanel: React.FC<PracticalRubricPanelProps> = ({
  tasks,
  onUpdateTasks,
  onProceedToReview
}) => {
  const [taskList, setTaskList] = useState<AssessmentTask[]>(tasks);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({
    'task-1': true,
    'task-2': true,
    'task-3': true
  });
  const [saveTimestamp, setSaveTimestamp] = useState<string>('Saved just now');
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTaskForUpload, setActiveTaskForUpload] = useState<string | null>(null);

  // Rubric calculations
  const allCriteria = taskList.flatMap(t => t.criteria);
  const totalCriteria = allCriteria.length;
  const scoredCriteria = allCriteria.filter(c => c.score !== null);
  const totalEarnedPoints = scoredCriteria.reduce((sum, c) => sum + (c.score || 0), 0);
  const maxPossiblePoints = totalCriteria * 2;
  const incompleteCount = totalCriteria - scoredCriteria.length;

  const toggleTask = (taskId: string) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleScoreChange = (taskId: string, criterionId: string, score: RubricCriterionScore) => {
    const updated = taskList.map(task => {
      if (task.id !== taskId) return task;
      const updatedCriteria = task.criteria.map(crit => {
        if (crit.id !== criterionId) return crit;
        // Toggle or set
        return { ...crit, score: crit.score === score ? null : score };
      });
      const allScored = updatedCriteria.every(c => c.score !== null);
      return { ...task, criteria: updatedCriteria, isCompleted: allScored };
    });
    setTaskList(updated);
    onUpdateTasks(updated, false); // save without creating sync record spam
  };

  const handleObservationChange = (taskId: string, criterionId: string, text: string) => {
    const updated = taskList.map(task => {
      if (task.id !== taskId) return task;
      const updatedCriteria = task.criteria.map(crit => {
        if (crit.id !== criterionId) return crit;
        return { ...crit, assessorObservation: text };
      });
      return { ...task, criteria: updatedCriteria };
    });
    setTaskList(updated);
  };

  const handleInputBlur = () => {
    onUpdateTasks(taskList, false); // persist on blur without queueing sync spam
  };

  const handleTaskNotesChange = (taskId: string, text: string) => {
    const updated = taskList.map(task => {
      if (task.id !== taskId) return task;
      return { ...task, assessorTaskNotes: text };
    });
    setTaskList(updated);
  };

  const handleSave = () => {
    onUpdateTasks(taskList, true); // explicit user save queues ONE sync record
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setSaveTimestamp(`Saved today at ${now}`);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  const handleAttachEvidenceClick = (taskId: string) => {
    setActiveTaskForUpload(taskId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !activeTaskForUpload) return;
    const file = e.target.files[0];
    const targetTaskId = activeTaskForUpload;

    const commitEvidence = (dataUrl?: string) => {
      const newEvidence: EvidenceItem = {
        id: 'ev-user-' + Date.now(),
        title: file.name,
        fileName: file.name,
        type: file.type.startsWith('video') ? 'video' : 'image',
        fileUrl: dataUrl,
        timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: `Local evidence record (${(file.size / 1024).toFixed(0)} KB)`
      };

      const updated = taskList.map(task => {
        if (task.id !== targetTaskId) return task;
        return {
          ...task,
          evidence: [...task.evidence, newEvidence]
        };
      });
      setTaskList(updated);
      onUpdateTasks(updated, false);
    };

    if (file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = (loadEv) => {
        commitEvidence(loadEv.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      commitEvidence();
    }
  };

  const handleRemoveEvidence = (taskId: string, evidenceId: string) => {
    const updated = taskList.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        evidence: task.evidence.filter(e => e.id !== evidenceId)
      };
    });
    setTaskList(updated);
    onUpdateTasks(updated, false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Mandatory Safety Notice */}
      <div className="notice-box notice-warning">
        <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong style={{ display: 'block', marginBottom: 2 }}>Mandatory Safety Protocol</strong>
          Practical demonstrations must be conducted by a qualified assessor using a safe, de-energized training setup and centre procedures. Never instruct or allow a candidate to perform live electrical work.
        </div>
      </div>

      {/* Running Score Bar Card */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#5B6573', fontWeight: 600 }}>
              Practical Assessment Score Progress
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                {totalEarnedPoints} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#5B6573' }}>/ {maxPossiblePoints} Points</span>
              </span>
              <span style={{ fontSize: '0.88rem', color: '#5B6573' }}>
                ({scoredCriteria.length} of {totalCriteria} criteria observed)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {incompleteCount > 0 ? (
              <span style={{ 
                background: 'var(--status-amber-bg)', 
                color: 'var(--status-amber-text)', 
                padding: '0.3rem 0.65rem', 
                borderRadius: 4, 
                fontSize: '0.78rem', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <AlertCircle size={13} />
                <span>{incompleteCount} criteria need score</span>
              </span>
            ) : (
              <span style={{ 
                background: 'var(--status-green-bg)', 
                color: 'var(--status-green-text)', 
                padding: '0.3rem 0.65rem', 
                borderRadius: 4, 
                fontSize: '0.78rem', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <CheckCircle2 size={13} />
                <span>All criteria scored</span>
              </span>
            )}

            <button className="btn btn-secondary btn-sm" onClick={handleSave}>
              <Save size={14} />
              <span>Save Progress</span>
            </button>
          </div>
        </div>

        {/* Rubric Scale Legend */}
        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.76rem', color: '#5B6573', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: '#1E293B' }}>Scoring Scale:</span>
          <span><strong style={{ color: '#991B1B' }}>0</strong> — Not demonstrated / unsafe</span>
          <span><strong style={{ color: '#92400E' }}>1</strong> — Partly demonstrated / needs prompting</span>
          <span><strong style={{ color: '#065F46' }}>2</strong> — Demonstrated safely and independently</span>
        </div>
      </div>

      {/* Hidden file input for attachment */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*,video/*"
        onChange={handleFileSelected} 
      />

      {/* Guided Tasks */}
      {taskList.map((task) => {
        const isExpanded = !!expandedTasks[task.id];
        const taskScored = task.criteria.filter(c => c.score !== null).length;
        const taskPoints = task.criteria.reduce((s, c) => s + (c.score || 0), 0);
        const taskMax = task.criteria.length * 2;

        return (
          <div key={task.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Task Header Accordion */}
            <div 
              onClick={() => toggleTask(task.id)}
              style={{ 
                padding: '1rem 1.25rem', 
                background: '#FFFFFF', 
                cursor: 'pointer',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ 
                  width: 28, 
                  height: 28, 
                  borderRadius: '50%', 
                  background: 'var(--primary-light)', 
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {task.taskNumber}
                </span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B' }}>
                    Task {task.taskNumber}: {task.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#5B6573' }}>
                    {task.description}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>
                  {taskPoints} / {taskMax} pts
                </span>
                <span style={{ 
                  fontSize: '0.74rem', 
                  padding: '2px 8px', 
                  borderRadius: 4, 
                  background: taskScored === task.criteria.length ? 'var(--status-green-bg)' : '#F1F4F8',
                  color: taskScored === task.criteria.length ? 'var(--status-green-text)' : '#5B6573',
                  fontWeight: 600
                }}>
                  {taskScored}/{task.criteria.length} scored
                </span>
                {isExpanded ? <ChevronUp size={18} color="#5B6573" /> : <ChevronDown size={18} color="#5B6573" />}
              </div>
            </div>

            {/* Task Body */}
            {isExpanded && (
              <div style={{ padding: '1.25rem' }}>
                {/* Criteria Table / List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                  {task.criteria.map((crit) => (
                    <div 
                      key={crit.id}
                      style={{ 
                        padding: '0.9rem 1rem', 
                        background: crit.score === null ? '#FFFBEB' : '#F8FAFC',
                        borderRadius: 6,
                        border: crit.score === null ? '1px solid #FDE68A' : '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ flex: '1 1 360px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <span style={{ 
                              fontSize: '0.7rem', 
                              textTransform: 'uppercase', 
                              fontWeight: 700, 
                              color: crit.category === 'safety' ? '#92400E' : '#173B63',
                              background: crit.category === 'safety' ? '#FEF3C7' : '#EBF1F7',
                              padding: '1px 5px',
                              borderRadius: 3
                            }}>
                              {crit.category}
                            </span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E293B' }}>
                              {crit.title}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#5B6573' }}>
                            {crit.description}
                          </div>
                        </div>

                        {/* 0 / 1 / 2 Selector */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <div className="rubric-score-selector">
                            <button 
                              type="button"
                              className={`rubric-btn score-0 ${crit.score === 0 ? 'active' : ''}`}
                              onClick={() => handleScoreChange(task.id, crit.id, 0)}
                              title="0 — Not demonstrated / unsafe"
                            >
                              0: Not demonstrated
                            </button>
                            <button 
                              type="button"
                              className={`rubric-btn score-1 ${crit.score === 1 ? 'active' : ''}`}
                              onClick={() => handleScoreChange(task.id, crit.id, 1)}
                              title="1 — Partly demonstrated / needs prompting"
                            >
                              1: Partly / Prompted
                            </button>
                            <button 
                              type="button"
                              className={`rubric-btn score-2 ${crit.score === 2 ? 'active' : ''}`}
                              onClick={() => handleScoreChange(task.id, crit.id, 2)}
                              title="2 — Demonstrated safely and independently"
                            >
                              2: Independent
                            </button>
                          </div>
                          {crit.score === null && (
                            <span style={{ fontSize: '0.7rem', color: '#92400E', fontWeight: 600 }}>
                              * Needs score
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Assessor Observation Field */}
                      <div style={{ marginTop: '0.65rem' }}>
                        <input 
                          type="text"
                          className="form-input"
                          style={{ fontSize: '0.82rem', padding: '0.35rem 0.6rem' }}
                          placeholder="Assessor observation note for this criterion (grounding evidence)..."
                          value={crit.assessorObservation || ''}
                          onChange={(e) => handleObservationChange(task.id, crit.id, e.target.value)}
                          onBlur={handleInputBlur}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Evidence Attachment Section */}
                <div style={{ background: '#F1F4F8', padding: '0.85rem', borderRadius: 6, marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Paperclip size={14} color="#173B63" />
                      <span>Evidence Attachment Metadata & Local Preview</span>
                      <span style={{ fontSize: '0.72rem', color: '#5B6573', fontWeight: 400 }}>
                        (Metadata & image thumbnails stay stored in browser localStorage; files are not uploaded externally)
                      </span>
                    </div>

                    <button 
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleAttachEvidenceClick(task.id)}
                    >
                      <Camera size={13} />
                      <span>Attach Evidence File</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {task.evidence.map(ev => (
                      <div 
                        key={ev.id}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 8, 
                          background: 'white', 
                          padding: '0.45rem 0.75rem', 
                          borderRadius: 4, 
                          border: '1px solid var(--border-color)',
                          fontSize: '0.8rem'
                        }}
                      >
                        {ev.fileUrl ? (
                          <img 
                            src={ev.fileUrl} 
                            alt={ev.title} 
                            style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-color)', flexShrink: 0 }} 
                          />
                        ) : ev.type === 'video' ? (
                          <Video size={16} color="#173B63" style={{ flexShrink: 0 }} />
                        ) : (
                          <Camera size={16} color="#2E7774" style={{ flexShrink: 0 }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: '#1E293B' }}>{ev.title}</div>
                          <div style={{ fontSize: '0.7rem', color: '#5B6573' }}>{ev.timestamp} · {ev.description}</div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveEvidence(task.id, ev.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', padding: 2, marginLeft: 4 }}
                          title="Remove evidence item"
                          aria-label={`Remove evidence ${ev.title}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}

                    {task.evidence.length === 0 && (
                      <span style={{ fontSize: '0.78rem', color: '#8E98A5', fontStyle: 'italic' }}>
                        No evidence items attached for this task yet.
                      </span>
                    )}
                  </div>
                </div>

                {/* Overall Task Assessor Notes */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Assessor Summary Notes for Task {task.taskNumber}</label>
                  <textarea 
                    className="form-textarea"
                    rows={2}
                    value={task.assessorTaskNotes}
                    onChange={(e) => handleTaskNotesChange(task.id, e.target.value)}
                    onBlur={handleInputBlur}
                    placeholder="Overall observations on candidate body language, safety stance, speed..."
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom Save & Proceed Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'white', borderRadius: 6, border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.8rem', color: '#5B6573' }}>
          {showSavedFeedback ? (
            <span style={{ color: 'var(--status-green-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={14} />
              <span>Scores and observations updated locally</span>
            </span>
          ) : (
            <span>{saveTimestamp}</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleSave}>
            <Save size={15} />
            <span>Save Assessment Rubric</span>
          </button>
          <button className="btn btn-primary" onClick={onProceedToReview}>
            <span>Proceed to AI Assistance & Decision →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
