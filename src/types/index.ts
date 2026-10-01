export type AssessmentStatus = 
  | 'draft'
  | 'in_progress'
  | 'ready_for_review'
  | 'decision_recorded'
  | 'saved_offline';

export type Candidate = {
  id: string;
  name: string;
  age: number;
  location: string;
  preferredLanguage: string;
  trade: string;
  targetQualification: string;
  status: AssessmentStatus;
  lastUpdated: string;
  centre: string;
  hasFormalCertificate: boolean;
  declaration: WorkerDeclaration;
  mapping: QualificationMapping;
  tasks: AssessmentTask[];
  aiReview?: AIReviewResult;
  assessorDecision?: AssessorDecision;
};

export type WorkerDeclaration = {
  yearsExperience: number;
  workSetting: string;
  priorLearningType: string;
  activities: string[];
  toolsUsed: string[];
  safetyPractices: string[];
  narrative: string;
  assessorNotes?: string;
  lastSaved?: string;
};

export type QualificationMapping = {
  suggestedQualification: string;
  matchScore: number; // e.g. 86
  isAccepted: boolean;
  acceptedAt?: string;
  supportingSignals: string[];
  needsVerification: string[];
  alternativeMatch: {
    qualification: string;
    matchScore: number;
    reason: string;
  };
  note: string;
};

export type RubricCriterionScore = 0 | 1 | 2 | null;

export type AssessmentCriterion = {
  id: string;
  title: string;
  description: string;
  score: RubricCriterionScore;
  category: 'technical' | 'safety' | 'practical';
  assessorObservation?: string;
};

export type EvidenceItem = {
  id: string;
  title: string;
  type: 'image' | 'video' | 'note';
  timestamp: string;
  fileUrl?: string;
  fileName?: string;
  isDemoSample?: boolean;
  description: string;
};

export type AssessmentTask = {
  id: string;
  taskNumber: number;
  title: string;
  description: string;
  criteria: AssessmentCriterion[];
  assessorTaskNotes: string;
  evidence: EvidenceItem[];
  isCompleted: boolean;
};

export type AIReviewResult = {
  generatedAt: string;
  earnedPoints: number;
  totalPoints: number;
  completionPercentage: number;
  technicalCompetencyPct: number;
  safetyCompliancePct: number;
  practicalSkillsPct: number;
  overallCompetencyPct: number;
  strengths: string[];
  riskFlags: string[];
  suggestedNextStep: string;
  dataBasis: {
    rubricPointsRecorded: string;
    keyDeclarationSignals: string[];
    observationsEvaluated: number;
    missingCriteriaCount: number;
  };
  scoreSignature?: string;
  isStale?: boolean;
};

export type AssessorDecision = {
  decision: 'competencies_demonstrated' | 'further_assessment_needed' | 'refer_for_training';
  assessorName: string;
  assessorRole: string;
  date: string;
  rationale: string;
  recommendedActions?: string[];
  confirmed: boolean;
};

export type SyncRecord = {
  id: string;
  candidateId: string;
  candidateName: string;
  action: string;
  timestamp: string;
  status: 'pending' | 'synced';
};
