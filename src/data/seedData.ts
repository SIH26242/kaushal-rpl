import type { Candidate, AssessmentTask, SyncRecord } from '../types';

export const INITIAL_TASKS_RAVI: AssessmentTask[] = [
  {
    id: 'task-1',
    taskNumber: 1,
    title: 'Identify components and tools',
    description: 'Verify candidate capability to recognize fundamental protective devices, switches, sockets, and proper tool selection on the test bench.',
    assessorTaskNotes: 'Candidate demonstrated immediate familiarity with MCB rating curves and standard domestic switches. Needed slight prompting on multimeter impedance setting.',
    isCompleted: true,
    evidence: [
      {
        id: 'ev-1',
        title: 'Component identification bench verification',
        type: 'image',
        timestamp: 'Today, 10:15 AM',
        isDemoSample: true,
        description: 'Photo record: Candidate correctly segregated SP MCB, DP isolator, and intermediate switch.'
      }
    ],
    criteria: [
      {
        id: 'c1-1',
        title: 'Identifies MCB and its operational purpose',
        description: 'Distinguishes Miniature Circuit Breaker from switch/fuse, explains overcurrent and short-circuit protection.',
        score: 2,
        category: 'technical',
        assessorObservation: 'Quickly picked 16A Type-B MCB and explained its trip mechanism vs traditional rewirable fuse.'
      },
      {
        id: 'c1-2',
        title: 'Identifies switch and socket components',
        description: 'Correctly identifies terminal connections (Phase, Neutral, Earth) on standard modular accessories.',
        score: 2,
        category: 'technical',
        assessorObservation: 'Clearly distinguished L, N, and E terminals on 6A and 16A modular sockets without hesitation.'
      },
      {
        id: 'c1-3',
        title: 'Selects appropriate insulated hand tools',
        description: 'Chooses 1000V rated insulated screwdrivers and proper wire strippers without damaging copper core.',
        score: 2,
        category: 'practical',
        assessorObservation: 'Picked insulated VDE screwdriver and used stripper without nicking 1.5 sq mm conductor core.'
      },
      {
        id: 'c1-4',
        title: 'Explains when a multimeter is used',
        description: 'Articulates voltage check, continuity test, and basic resistance measurement in simple terms.',
        score: 1,
        category: 'technical',
        assessorObservation: 'Understands AC voltage and continuity buzzer well, but was hesitant on DC scale selector.'
      }
    ]
  },
  {
    id: 'task-2',
    taskNumber: 2,
    title: 'Prepare a safe work area',
    description: 'Assess adherence to electrical safety protocols, personal protective equipment (PPE), and isolation procedure before any board contact.',
    assessorTaskNotes: 'Candidate is naturally cautious and wears rubber-soled boots. However, formal live-dead-live test procedure was explained orally rather than demonstrated systematically.',
    isCompleted: false,
    evidence: [
      {
        id: 'ev-2',
        title: 'PPE inspection & bench area check',
        type: 'image',
        timestamp: 'Today, 10:45 AM',
        isDemoSample: true,
        description: 'Assessor inspection: Checked safety footwear, insulated matting in place, dry hands.'
      }
    ],
    criteria: [
      {
        id: 'c2-1',
        title: 'Describes isolating the supply and confirming circuit is de-energized',
        description: 'Explains turning off upstream isolator, lockout/tagout awareness, and verifying zero voltage with tester.',
        score: 1,
        category: 'safety',
        assessorObservation: 'Switched off isolator correctly, but forgot to test the neon tester on a known live source first.'
      },
      {
        id: 'c2-2',
        title: 'Selects and uses appropriate PPE',
        description: 'Wears safety boots, checks for dry gloves, removes metallic jewelry/watches prior to work.',
        score: 2,
        category: 'safety',
        assessorObservation: 'Complied fully; removed metal ring and confirmed dry footwear before touching the test station.'
      },
      {
        id: 'c2-3',
        title: 'Checks tools and work area before starting',
        description: 'Inspects tool insulation for nicks, ensures clean dry bench surface without stray copper strands.',
        score: 2,
        category: 'safety',
        assessorObservation: 'Inspected tool handles for cracks and brushed away shavings from prior session.'
      },
      {
        id: 'c2-4',
        title: 'Stops and asks for help when a hazard is present',
        description: 'Recognizes damaged conduit, wet floor, or unverified wire and pauses work to consult supervisor.',
        score: null, // Left for assessor input during demo
        category: 'safety',
        assessorObservation: ''
      }
    ]
  },
  {
    id: 'task-3',
    taskNumber: 3,
    title: 'Demonstrate basic wiring procedure on training board',
    description: 'Execute a single-lamp controlled by one-way switch plus parallel socket outlet on a de-energized training board following standard colour coding.',
    assessorTaskNotes: 'Wiring work is neat and shows 7 years of muscle memory. Needs observation on final insulation continuity check before energization request.',
    isCompleted: false,
    evidence: [
      {
        id: 'ev-3',
        title: 'Training board setup · sample evidence · 00:18',
        type: 'video',
        timestamp: 'Today, 11:20 AM',
        isDemoSample: true,
        description: 'Short video clip: Ravi stripping conductor and terminating into modular switch terminal box.'
      }
    ],
    criteria: [
      {
        id: 'c3-1',
        title: 'Follows the provided wiring diagram',
        description: 'Reads basic schematic, identifies supply line, load return, and earthing path.',
        score: 2,
        category: 'practical',
        assessorObservation: 'Understood simple single-line diagram instantly; identified Phase routing to switch bottom terminal.'
      },
      {
        id: 'c3-2',
        title: 'Makes neat, secure connections on de-energized training board',
        description: 'Tightly secures screws without loose wire strands or excessive exposed copper.',
        score: 2,
        category: 'practical',
        assessorObservation: 'Very tidy loop terminations. No stray copper strands visible outside terminal housings.'
      },
      {
        id: 'c3-3',
        title: 'Checks work before requesting energization',
        description: 'Tug test on conductors, visual inspection of earth bonding, zero loose tools on board.',
        score: 1,
        category: 'safety',
        assessorObservation: 'Performed physical tug test on all wires, but did not perform multimeter continuity verification before calling assessor.'
      },
      {
        id: 'c3-4',
        title: 'Explains a basic fault-finding sequence',
        description: 'Articulates how to isolate and identify open circuit or tripped breaker in simple steps.',
        score: null, // Left for assessor during demo
        category: 'technical',
        assessorObservation: ''
      }
    ]
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-001',
    name: 'Ravi Kumar',
    age: 34,
    location: 'Kochi, Kerala',
    preferredLanguage: 'Malayalam (English/Hindi basic)',
    trade: 'Assistant Electrician',
    targetQualification: 'Assistant Electrician (Illustrative RPL)',
    status: 'in_progress',
    lastUpdated: 'Today, 11:25 AM',
    centre: 'Kochi Assessment Centre',
    hasFormalCertificate: false,
    declaration: {
      yearsExperience: 7,
      workSetting: 'Residential domestic wiring & small commercial repair',
      priorLearningType: 'Informal on-the-job apprenticeship with master electrician',
      activities: [
        'Domestic house wiring (PVC conduit & batten)',
        'Switch & socket installation and replacements',
        'MCB and distribution board installation under guidance',
        'Basic domestic fault identification (blown fuse, loose terminal)',
        'Ceiling fan and LED lighting fixture installation'
      ],
      toolsUsed: [
        'Insulated screwdrivers (Phillips & flat)',
        'Wire strippers and side cutting pliers',
        'Neon phase tester / voltage detector',
        'Basic digital multimeter (AC voltage, continuity buzzer)',
        'Crimping tool and utility knife'
      ],
      safetyPractices: [
        'Always isolates main DP switch before opening any socket plate',
        'Uses rubber-soled footwear at client sites',
        'Assessor noted: Needs formal practice on live-dead-live testing sequence',
        'Avoids working on energized overhead lines'
      ],
      narrative: 'I have worked alongside a local contractor electrician in Kochi for seven years. I install domestic switches, sockets, run PVC conduits, lay cables, and replace MCBs. I want my practical knowledge recognized so I can take independent jobs legally.',
      assessorNotes: 'Candidate is articulate and transparent about not having formal school certification. Muscle memory and tool handling appear strong.',
      lastSaved: 'Today, 10:00 AM'
    },
    mapping: {
      suggestedQualification: 'Assistant Electrician',
      matchScore: 86,
      isAccepted: true,
      acceptedAt: 'Today, 10:05 AM',
      supportingSignals: [
        '7 years continuous informal on-the-job experience',
        'Regular domestic wiring, modular switchboard & MCB assembly',
        'Daily usage of insulated 1000V hand tools & basic continuity tester',
        'Familiar with residential single-phase distribution boards'
      ],
      needsVerification: [
        'Formal live-dead-live safe isolation protocol must be verified on test bench',
        'Multimeter resistance & DC voltage range selection',
        'Independence in diagnosing multi-way switching or earthing loops'
      ],
      alternativeMatch: {
        qualification: 'Electrician (Full Scope / Three Phase)',
        matchScore: 62,
        reason: 'Requires demonstrated industrial three-phase distribution, motor starter wiring, and formal load calculations.'
      },
      note: 'Illustrative mapping based on candidate self-declaration. Does not confer certification or replace assessor assessment.'
    },
    tasks: INITIAL_TASKS_RAVI,
    aiReview: {
      generatedAt: 'Today, 11:05 AM',
      earnedPoints: 17,
      totalPoints: 24,
      completionPercentage: 83,
      technicalCompetencyPct: 83,
      safetyCompliancePct: 71,
      practicalSkillsPct: 90,
      overallCompetencyPct: 81,
      strengths: [
        'Excellent component identification speed: correctly differentiated MCB, switches, and terminal polarities.',
        'High practical craftsmanship: neat loop terminations with no exposed conductor strands.',
        'Extensive declared experience (7 yrs) clearly translates into confident tool posture.'
      ],
      riskFlags: [
        '⚠ Safety procedure verification incomplete: 1 safety criterion pending assessor score.',
        '⚠ Live-dead-live isolation sequence was explained verbally rather than systematically demonstrated.',
        '⚠ Pre-energization multimeter continuity test was skipped before calling assessor.'
      ],
      suggestedNextStep: 'Complete scoring for Criteria 2.4 and 3.4. Verify safe de-energization checks before recording the final assessor determination.',
      dataBasis: {
        rubricPointsRecorded: '17 points earned out of 24 possible points across 10 observed criteria (2 criteria pending)',
        keyDeclarationSignals: ['7 years domestic experience', 'Modular switchboards', 'Insulated tool mastery'],
        observationsEvaluated: 10,
        missingCriteriaCount: 2
      }
    }
  },
  {
    id: 'cand-002',
    name: 'Meera Das',
    age: 29,
    location: 'Ernakulam, Kerala',
    preferredLanguage: 'Malayalam & English',
    trade: 'Solar PV Installer Assistant',
    targetQualification: 'Solar PV Installer Assistant (Illustrative)',
    status: 'ready_for_review',
    lastUpdated: 'Yesterday, 4:15 PM',
    centre: 'Kochi Assessment Centre',
    hasFormalCertificate: false,
    declaration: {
      yearsExperience: 4,
      workSetting: 'Rooftop solar installations and DC cabling',
      priorLearningType: 'Field assistant on residential solar installations',
      activities: ['Panel mounting', 'MC4 connector crimping', 'DC string cable routing'],
      toolsUsed: ['MC4 crimper', 'Torque wrench', 'DC clamp meter'],
      safetyPractices: ['Full body harness on roofs', 'UV protection eyewear', 'Working in pairs'],
      narrative: 'Assisting solar rooftop installations for four years across Ernakulam district.'
    },
    mapping: {
      suggestedQualification: 'Solar PV Installer Assistant',
      matchScore: 91,
      isAccepted: true,
      supportingSignals: ['4 years rooftop solar mounting', 'Proficient with MC4 crimping & DC strings'],
      needsVerification: ['In-person verification of height safety harness inspection'],
      alternativeMatch: {
        qualification: 'Solar PV System Maintenance Technician',
        matchScore: 58,
        reason: 'Requires inverter troubleshooting and grid-synchronization logs.'
      },
      note: 'Demo data representation.'
    },
    tasks: [],
    aiReview: {
      generatedAt: 'Yesterday, 4:30 PM',
      earnedPoints: 22,
      totalPoints: 24,
      completionPercentage: 100,
      technicalCompetencyPct: 92,
      safetyCompliancePct: 94,
      practicalSkillsPct: 90,
      overallCompetencyPct: 92,
      strengths: ['Flawless DC connector assembly', 'Rigorous working-at-height harness protocol'],
      riskFlags: [],
      suggestedNextStep: 'Ready for assessor final sign-off.',
      dataBasis: {
        rubricPointsRecorded: '22 earned / 24 total points',
        keyDeclarationSignals: ['4 yrs rooftop solar', 'MC4 crimping'],
        observationsEvaluated: 12,
        missingCriteriaCount: 0
      }
    }
  },
  {
    id: 'cand-003',
    name: 'Suresh Patil',
    age: 41,
    location: 'Kozhikode, Kerala',
    preferredLanguage: 'Malayalam & Hindi',
    trade: 'Domestic Wireman',
    targetQualification: 'Domestic Wireman (Illustrative)',
    status: 'saved_offline',
    lastUpdated: '2 days ago',
    centre: 'Kochi Assessment Centre',
    hasFormalCertificate: false,
    declaration: {
      yearsExperience: 11,
      workSetting: 'Commercial & residential rewiring',
      priorLearningType: 'Informal trade apprenticeship since 2015',
      activities: ['Conduit bending', '3-phase board distribution', 'Earthing pit preparation'],
      toolsUsed: ['Pipe bender', 'Earth megger', 'Insulated pliers'],
      safetyPractices: ['Isolator lockouts', 'Safety helmets'],
      narrative: '11 years experience in building electrical wiring and repair.'
    },
    mapping: {
      suggestedQualification: 'Domestic Wireman',
      matchScore: 88,
      isAccepted: true,
      supportingSignals: ['11 years verified site references', 'Earthing pit installation'],
      needsVerification: ['Earth resistance measurement demonstration'],
      alternativeMatch: {
        qualification: 'Industrial Electrician',
        matchScore: 65,
        reason: 'Requires PLC/VFD familiarity not evidenced.'
      },
      note: 'Offline saved candidate record.'
    },
    tasks: []
  }
];

export const INITIAL_SYNC_RECORDS: SyncRecord[] = [
  {
    id: 'sync-01',
    candidateId: 'cand-001',
    candidateName: 'Ravi Kumar',
    action: 'Task 1 Rubric scored (8/8 pts) & evidence attached',
    timestamp: 'Today, 10:20 AM',
    status: 'synced'
  },
  {
    id: 'sync-02',
    candidateId: 'cand-001',
    candidateName: 'Ravi Kumar',
    action: 'Worker self-declaration saved',
    timestamp: 'Today, 10:02 AM',
    status: 'synced'
  },
  {
    id: 'sync-03',
    candidateId: 'cand-003',
    candidateName: 'Suresh Patil',
    action: 'Initial draft intake saved on local device',
    timestamp: '2 days ago',
    status: 'pending'
  }
];
