import React, { useState } from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  ClipboardList, 
  Printer, 
  Users, 
  MapPin, 
  CheckCircle2
} from 'lucide-react';
import type { Candidate, WorkerDeclaration, AssessmentTask, AIReviewResult, AssessorDecision } from '../types';
import { WorkerDeclarationPanel } from './assessment/WorkerDeclarationPanel';
import { PracticalRubricPanel } from './assessment/PracticalRubricPanel';
import { AIAssistanceDecisionPanel } from './assessment/AIAssistanceDecisionPanel';
import { PrintDossierModal } from './PrintDossierModal';
import { isAIReviewStale } from '../utils/aiReasoning';

interface AssessmentDetailViewProps {
  candidate: Candidate;
  onUpdateCandidate: (updated: Candidate, logSyncAction?: string) => void;
  onReturnToQueue: () => void;
  onShowToast: (msg: string) => void;
}

type DetailTab = 'declaration' | 'rubric' | 'decision';

export const AssessmentDetailView: React.FC<AssessmentDetailViewProps> = ({
  candidate,
  onUpdateCandidate,
  onReturnToQueue,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('rubric');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Tab 1 save declaration
  const handleSaveDeclaration = (updatedDeclaration: WorkerDeclaration) => {
    const updated: Candidate = {
      ...candidate,
      declaration: {
        ...updatedDeclaration,
        lastSaved: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    };
    onUpdateCandidate(updated, `Worker self-declaration saved for ${candidate.name}`);
    onShowToast('Worker declaration changes saved locally');
  };

  // Tab 1 accept mapping
  const handleAcceptMapping = () => {
    const updated: Candidate = {
      ...candidate,
      mapping: {
        ...candidate.mapping,
        isAccepted: true,
        acceptedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    };
    onUpdateCandidate(updated, `Accepted ${candidate.mapping.suggestedQualification} trade pack`);
    onShowToast(`${candidate.mapping.suggestedQualification} trade pack accepted for assessment rubric`);
  };

  const handleChangeQualification = (newQual: string, matchScore: number, reason: string) => {
    const updated: Candidate = {
      ...candidate,
      trade: newQual,
      targetQualification: `${newQual} (Illustrative)`,
      mapping: {
        ...candidate.mapping,
        suggestedQualification: newQual,
        matchScore,
        isAccepted: false,
        acceptedAt: undefined,
        note: `Rule-based mapping changed to ${newQual}: ${reason}`
      }
    };
    onUpdateCandidate(updated, `Illustrative mapping changed to ${newQual}`);
    onShowToast(`Illustrative mapping changed to ${newQual} (Rubric criteria remain standardized)`);
  };

  // Tab 2 update tasks
  const handleUpdateTasks = (updatedTasks: AssessmentTask[], shouldLogSync: boolean = false) => {
    const allCriteria = updatedTasks.flatMap(t => t.criteria);
    const scoredCount = allCriteria.filter(c => c.score !== null).length;
    const isFullyScored = scoredCount === allCriteria.length;

    let newStatus = candidate.status;
    if (newStatus !== 'decision_recorded') {
      newStatus = isFullyScored ? 'ready_for_review' : 'in_progress';
    }

    // Check if previously generated AI review has become stale due to score modifications
    const isStale = isAIReviewStale(candidate.aiReview, updatedTasks);
    const updatedAIReview = candidate.aiReview ? { ...candidate.aiReview, isStale } : undefined;

    const updated: Candidate = {
      ...candidate,
      tasks: updatedTasks,
      status: newStatus,
      aiReview: updatedAIReview
    };
    onUpdateCandidate(updated, shouldLogSync ? `Practical rubric saved (${scoredCount}/${allCriteria.length} criteria)` : undefined);
    if (shouldLogSync) {
      onShowToast('Assessment rubric progress saved locally');
    }
  };

  // Tab 3 AI Review
  const handleSaveAIReview = (review: AIReviewResult) => {
    const updated: Candidate = {
      ...candidate,
      aiReview: review
    };
    onUpdateCandidate(updated);
    onShowToast('AI assessment assistance generated from current rubric observations');
  };

  const handleClearAIReview = () => {
    const updated: Candidate = {
      ...candidate,
      aiReview: undefined
    };
    onUpdateCandidate(updated);
    onShowToast('AI assessment suggestion cleared');
  };

  // Tab 3 Record Decision
  const handleRecordDecision = (decision: AssessorDecision) => {
    const updated: Candidate = {
      ...candidate,
      assessorDecision: decision,
      status: 'decision_recorded'
    };
    onUpdateCandidate(updated, `Assessor decision recorded by ${decision.assessorName}`);
    onShowToast(`Assessor determination recorded by ${decision.assessorName}`);
  };

  return (
    <div>
      {/* Candidate Profile Header Card */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {candidate.name}
                </h1>
                <span className={`status-badge ${candidate.status}`}>
                  {candidate.status.replace(/_/g, ' ')}
                </span>
                <span style={{ fontSize: '0.75rem', background: '#F1F4F8', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: 4, color: '#5B6573' }}>
                  Demo Candidate #{candidate.id}
                </span>
              </div>

              <div style={{ fontSize: '0.84rem', color: '#5B6573', marginTop: 3, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span><strong>Target Trade:</strong> {candidate.trade}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <MapPin size={13} />
                  <span>{candidate.location}</span>
                </span>
                <span>•</span>
                <span><strong>Age:</strong> {candidate.age} yrs</span>
                <span>•</span>
                <span><strong>Preferred Language:</strong> {candidate.preferredLanguage}</span>
                <span>•</span>
                <span><strong>Informal Experience:</strong> {candidate.declaration.yearsExperience} yrs</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowPrintModal(true)}>
              <Printer size={14} />
              <span>Assessment Dossier</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onReturnToQueue}>
              <Users size={14} />
              <span>Switch Candidate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'declaration' ? 'active' : ''}`}
          onClick={() => setActiveTab('declaration')}
        >
          <ClipboardList size={16} />
          <span>1. Worker Declaration & Mapping</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === 'rubric' ? 'active' : ''}`}
          onClick={() => setActiveTab('rubric')}
        >
          <FileCheck2 size={16} />
          <span>2. Practical Rubric & Evidence</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === 'decision' ? 'active' : ''}`}
          onClick={() => setActiveTab('decision')}
        >
          <Sparkles size={16} />
          <span>3. AI Review & Assessor Decision</span>
          {candidate.assessorDecision?.confirmed && (
            <CheckCircle2 size={14} color="#065F46" style={{ marginLeft: 2 }} />
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'declaration' && (
        <WorkerDeclarationPanel 
          candidate={candidate}
          onSaveDeclaration={handleSaveDeclaration}
          onAcceptMapping={handleAcceptMapping}
          onChangeQualification={handleChangeQualification}
          onNextToRubric={() => setActiveTab('rubric')}
        />
      )}

      {activeTab === 'rubric' && (
        <PracticalRubricPanel 
          tasks={candidate.tasks}
          onUpdateTasks={handleUpdateTasks}
          onProceedToReview={() => setActiveTab('decision')}
        />
      )}

      {activeTab === 'decision' && (
        <AIAssistanceDecisionPanel 
          candidate={candidate}
          tasks={candidate.tasks}
          onSaveAIReview={handleSaveAIReview}
          onClearAIReview={handleClearAIReview}
          onRecordDecision={handleRecordDecision}
          onOpenDossier={() => setShowPrintModal(true)}
        />
      )}

      {/* Dossier Modal */}
      {showPrintModal && (
        <PrintDossierModal 
          candidate={candidate}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
