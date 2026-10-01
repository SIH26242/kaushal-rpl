# Kaushal RPL · Recognition of Prior Learning Assessment Workspace

> **Problem Statement ID:** SIH26242  
> **Problem Statement:** AI-Assisted Skill Assessment Tool for Recognition of Prior Learning (RPL)  
> **Theme:** Smart Education | **Category:** Software  
> **Demonstration Trade:** Assistant Electrician  
> **Demonstration Candidate:** Ravi Kumar (34, Kochi, Kerala · 7 years informal trade experience)  

---

## Overview

**Kaushal RPL** is a public-service skill assessment workspace that helps workers with informally acquired trade skills declare their experience, enables assessors to conduct standardized practical evaluations on de-energized test benches, and provides transparent, explainable AI-assisted scoring support.

**Crucial Architecture Principle:** AI provides decision-support and consistency checks; the human assessor makes the final determination and records the assessment outcome.

---

## Core Features & Workflow

1. **Overview & Queue Dashboard:**
   - Case-management view of active assessment center operations (Kochi Assessment Centre).
   - Real-time work queue of candidates across various stages: *In Progress*, *Ready for Review*, *Saved Offline*, and *Decision Recorded*.

2. **Structured Worker Prior Experience Declaration:**
   - Candidate self-declaration for informal/on-the-job experience.
   - Captures years of experience, work settings, learning pathways, tool familiarity, and reported safety habits.
   - Editable assessor observation notes.

3. **Illustrative Qualification Mapping:**
   - Suggests candidate qualification match (*Assistant Electrician — 86% correlation*).
   - Inspectable signals: domestic wiring experience, modular switchboard assembly, insulated hand tool handling.
   - Identifies assessor verification priorities (e.g. live-dead-live safe isolation demonstration).
   - Transparent disclaimer: illustrative prototype mapping, not an official NCVET qualification pack.

4. **Guided Practical Assessment with Anchored 0–2 Rubrics:**
   - **Task 1:** Identify components and tools (MCBs, switches, sockets, insulated screwdrivers, multimeter).
   - **Task 2:** Prepare a safe work area (isolation protocol, PPE inspection, tool condition checks, hazard handling).
   - **Task 3:** Demonstrate basic wiring procedure on de-energized training board (schematic reading, termination quality, pre-energization verification, fault finding).
   - Evidence records: Local attachment support (images, short video clips, inspection photos).
   - Clear mandatory safety protocol notice for de-energized testing benches.

5. **Explainable AI Decision-Support:**
   - Evaluates recorded rubric scores, observations, and candidate profile.
   - Generates breakdown scores: Technical Competency, Safety Compliance, Practical Skills, and Overall Suggested Rating.
   - Highlights observed strengths and flags critical gaps/pending criteria.
   - Inspectable data basis drawer detailing exact input signals.

6. **Assessor Final Determination & Printable Dossier:**
   - Formally captures assessor sign-off (*Competencies Demonstrated*, *Further Assessment Needed*, or *Refer for Additional Training*).
   - Mandatory assessor rationale notes and verified sign-off block.
   - Printable / PDF-ready Candidate Assessment Dossier summary.

7. **Offline-First Field Capability:**
   - Client-side persistence using browser `localStorage`.
   - Simulated online/offline field mode toggle.
   - Audit trail of queued local changes with simulated cloud synchronization.
   - Demo data reset button to restore initial benchmark data at any point.

---

## Quick Start / Running Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Execution
```bash
# Navigate to project directory
cd C:\Users\Vyshnav\.gemini\antigravity-ide\scratch\kaushal-rpl

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev -- --port 5173 --host
```

Open your browser at:  
👉 **`http://localhost:5173/`**

### Building for Production
```bash
npm run build
```

---

## Technology Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Custom accessible public-service CSS design system (Inter font, `#F7F8FA` background, `#173B63` deep navy, `#2E7774` accent teal)
- **Icons:** Lucide React
- **Persistence:** Local browser storage with offline sync queue emulation
