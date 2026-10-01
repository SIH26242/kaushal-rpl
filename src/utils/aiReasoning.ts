import type { Candidate, AIReviewResult, AssessmentTask } from '../types';

/**
 * Deterministic, inspectable AI Decision-Support Engine for Kaushal RPL.
 * Grounded in:
 * 1. Criterion scores (0, 1, 2, or null)
 * 2. Assessor observations written for each criterion and task
 * 3. Declared candidate profile (years of experience, declared activities)
 *
 * NOTE: This is decision support for human assessors. It never makes or issues certification.
 */
export function generateAIReview(candidate: Candidate, tasks: AssessmentTask[]): AIReviewResult {
  const allCriteria = tasks.flatMap(t => t.criteria);
  const totalCriteriaCount = allCriteria.length;
  
  let scoredCount = 0;
  let earnedPoints = 0;
  const maxPossiblePoints = totalCriteriaCount * 2;

  let techEarned = 0;
  let techMax = 0;
  let safetyEarned = 0;
  let safetyMax = 0;
  let practicalEarned = 0;
  let practicalMax = 0;

  const strengths: string[] = [];
  const riskFlags: string[] = [];
  let observationsWithNotes = 0;

  allCriteria.forEach(crit => {
    const maxForCriterion = 2;
    if (crit.category === 'technical') techMax += maxForCriterion;
    if (crit.category === 'safety') safetyMax += maxForCriterion;
    if (crit.category === 'practical') practicalMax += maxForCriterion;

    if (crit.score !== null) {
      scoredCount++;
      earnedPoints += crit.score;

      if (crit.category === 'technical') techEarned += crit.score;
      if (crit.category === 'safety') safetyEarned += crit.score;
      if (crit.category === 'practical') practicalEarned += crit.score;

      if (crit.score === 2) {
        if (crit.assessorObservation && crit.assessorObservation.trim().length > 0) {
          strengths.push(`${crit.title}: ${crit.assessorObservation}`);
        } else {
          strengths.push(`${crit.title}: Demonstrated independently and safely (Score: 2/2).`);
        }
      } else if (crit.score === 0) {
        riskFlags.push(`Critical Gap [${crit.title}]: Scored 0/2 (not demonstrated). ${crit.assessorObservation ? `Observation: "${crit.assessorObservation}"` : 'Requires verified remediation.'}`);
      } else if (crit.score === 1) {
        riskFlags.push(`Partial Demonstration [${crit.title}]: Scored 1/2. ${crit.assessorObservation ? `Observation: "${crit.assessorObservation}"` : 'Assessor prompting was required.'}`);
      }
    } else {
      riskFlags.push(`Pending Assessor Observation: "${crit.title}" has not been scored yet.`);
    }

    if (crit.assessorObservation && crit.assessorObservation.trim().length > 0) {
      observationsWithNotes++;
    }
  });

  const completionPercentage = Math.round((scoredCount / (totalCriteriaCount || 1)) * 100);
  
  const technicalCompetencyPct = techMax > 0 ? Math.round((techEarned / techMax) * 100) : 0;
  const safetyCompliancePct = safetyMax > 0 ? Math.round((safetyEarned / safetyMax) * 100) : 0;
  const practicalSkillsPct = practicalMax > 0 ? Math.round((practicalEarned / practicalMax) * 100) : 0;

  // Weighted overall calculation: 40% practical, 35% safety, 25% technical
  const scoredMax = (techMax > 0 ? techEarned / techMax * 25 : 0) +
                    (safetyMax > 0 ? safetyEarned / safetyMax * 35 : 0) +
                    (practicalMax > 0 ? practicalEarned / practicalMax * 40 : 0);
  const overallCompetencyPct = Math.round(scoredMax);

  // Fallback strengths if none collected yet
  if (strengths.length === 0) {
    if (candidate.declaration.yearsExperience >= 5) {
      strengths.push(`${candidate.declaration.yearsExperience} years of declared continuous informal trade experience in domestic settings.`);
    } else {
      strengths.push('Candidate completed trade declaration intake.');
    }
  }

  // Determine suggested next step
  const unScoredCount = totalCriteriaCount - scoredCount;
  let suggestedNextStep = '';
  if (unScoredCount > 0) {
    suggestedNextStep = `Record scores and observations for the remaining ${unScoredCount} criteria before final review. Prioritize safe isolation observation.`;
  } else if (safetyCompliancePct < 75) {
    suggestedNextStep = 'Safety score is below 75%. Assessor re-check of live-dead-live isolation protocol is strongly recommended.';
  } else if (overallCompetencyPct >= 80) {
    suggestedNextStep = 'Assessment criteria comprehensively satisfied. Ready for final human assessor determination.';
  } else {
    suggestedNextStep = 'Review borderline practical criteria with candidate or consider bridging module recommendation.';
  }

  const keySignals = [
    `${candidate.declaration.yearsExperience} years informal trade work declared`,
    `${candidate.declaration.activities.length} work activities reported (${candidate.declaration.activities.slice(0, 2).join(', ')}...)`,
    `${candidate.declaration.toolsUsed.length} standard trade tools listed`
  ];

  return {
    generatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    earnedPoints,
    totalPoints: maxPossiblePoints,
    completionPercentage,
    technicalCompetencyPct,
    safetyCompliancePct,
    practicalSkillsPct,
    overallCompetencyPct,
    strengths: strengths.slice(0, 4),
    riskFlags: riskFlags.slice(0, 4),
    suggestedNextStep,
    scoreSignature: computeScoreSignature(tasks),
    isStale: false,
    dataBasis: {
      rubricPointsRecorded: `${earnedPoints} points recorded across ${scoredCount} of ${totalCriteriaCount} criteria`,
      keyDeclarationSignals: keySignals,
      observationsEvaluated: observationsWithNotes,
      missingCriteriaCount: unScoredCount
    }
  };
}

/**
 * Computes a deterministic signature of rubric scores across all tasks
 */
export function computeScoreSignature(tasks: AssessmentTask[]): string {
  return tasks
    .flatMap(t => t.criteria)
    .map(c => `${c.id}:${c.score ?? 'null'}`)
    .join(';');
}

/**
 * Determines whether an existing AI review was generated against different rubric scores
 */
export function isAIReviewStale(review: AIReviewResult | undefined, tasks: AssessmentTask[]): boolean {
  if (!review) return false;
  if (review.isStale) return true;
  
  const currentSignature = computeScoreSignature(tasks);
  if (review.scoreSignature) {
    return review.scoreSignature !== currentSignature;
  }

  // Fallback for initial seed review without scoreSignature
  const currentEarnedPoints = tasks.flatMap(t => t.criteria).reduce((sum, c) => sum + (c.score || 0), 0);
  const currentScoredCount = tasks.flatMap(t => t.criteria).filter(c => c.score !== null).length;
  const initialObserved = 12 - review.dataBasis.missingCriteriaCount;
  return review.earnedPoints !== currentEarnedPoints || initialObserved !== currentScoredCount;
}

/**
 * Explain why a qualification mapping was suggested
 */
export function explainMapping(candidate: Candidate) {
  return {
    title: candidate.mapping.suggestedQualification,
    matchScore: candidate.mapping.matchScore,
    confidenceLabel: 'High Correlation (Illustrative Demo Model)',
    signals: candidate.mapping.supportingSignals,
    verificationNeeds: candidate.mapping.needsVerification,
    alternative: candidate.mapping.alternativeMatch
  };
}
