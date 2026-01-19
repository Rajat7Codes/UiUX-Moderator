# Phase 1 — Naive Web Editor + AI Evaluation

## Goal
Validate that an AI model can evaluate frontend UX using rendered UI artifacts.

## In Scope
- React frontend
- Monaco editor (HTML, CSS, JS)
- iframe-based live preview
- Submit button
- Artifact extraction:
  - Rendered HTML (post-JS)
  - Serialized DOM snapshot
  - CSS snapshot (computed)
  - One desktop screenshot
- Single AI model evaluation
- UX score + short feedback

## Out of Scope
- Security / sandboxing
- Authentication
- Problem statements
- Multi-agent evaluation
- Performance optimization
- Accessibility audits
- Scoring normalization
- Docker / containers
- Spring Cloud components

## Fixed Decisions
- Desktop viewport: 1440x900
- UX score range: 1–10 (integers only)
- AI model: Gemini 1.5 Flash (direct API)

## Phase 1 Completion Criteria
Phase 1 is complete when:
1. A user can write HTML/CSS/JS and see a live preview.
2. On submit, the system captures DOM, CSS, and screenshot.
3. The AI returns:
   - A numeric UX score
   - Textual feedback referencing visible UI traits.
4. End-to-end evaluation completes in under 5 seconds.
