
import { Answers } from './types';

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

// Condensed UI/UX Blueprinting Principles for AI guidance
export const BLUEPRINTING_PRINCIPLES_TEXT = `
Core Objective: Define the UI's main purpose, problem it solves, or value it provides.
Target Audience: Understand who the UI is for (demographics, tech-savviness, roles) and their existing expectations (Jakob's Law).
Desired 'Vibe': Determine the intended emotional impact (e.g., professional, playful, trustworthy, innovative).
Core Message: Identify the single most important message the UI should convey. Clarity is key (Ogilvy).
User-centricity: Design for the user. Consider their behaviors, technical comfort, and accessibility needs (Nielsen's heuristics, Krug's "Don't Make Me Think").

Key Design Considerations:
1.  Visibility of System Status: Keep users informed with appropriate feedback.
2.  Match between System & Real World: Speak the user's language. Use familiar concepts.
3.  User Control & Freedom: Allow easy exit, undo, redo.
4.  Consistency & Standards: Maintain consistent design and behavior. Follow conventions.
5.  Error Prevention & Recovery: Design to prevent errors; help users recover easily.
6.  Recognition rather than Recall: Minimize memory load by making options visible.
7.  Flexibility & Efficiency of Use: Cater to both novice and expert users (e.g., accelerators).
8.  Aesthetic & Minimalist Design: Avoid clutter. Focus on essential information.
9.  "Don't Make Me Think" (Krug): Make UI self-explanatory and intuitive.
10. Jakob's Law: Users prefer UIs that work like others they know.
11. Hick's Law: More choices lead to longer decision times. Simplify choices.
12. Fitts's Law: Target size and distance affect interaction time. Make targets easy to hit.
13. Miller's Law: Chunk information (approx. 7 items) to avoid cognitive overload.
14. Accessibility: Design for everyone (contrast, alt text, keyboard navigation, ARIA).
15. Content Strategy: Plan content types (text, image, video) and organization for clarity.
16. Responsiveness: Ensure usability across devices (mobile, tablet, desktop).
17. Visual & Interaction Style: Define color palette, typography, imagery, icon style, and interaction patterns (feedback, button behavior) to align with the 'vibe'. Gestalt principles (Proximity, Similarity) for visual harmony.
18. Functionality & User Flows: Define essential tasks and map typical user journeys. Ensure clear navigation and calls to action (Norman's Visibility & Affordance).

Process: Initial Discovery -> Deep Dive (Why, Audience, Vibe, Functionality, Content, Responsiveness) -> Synthesis -> Masterplan (Overview, UI Sections, Layout, Visual Style, Usability Checklist).
The goal is a UI that is usable, intuitive, effective, and emotionally resonant.
`;

// Default empty answers structure, to be filled by AI
export const EMPTY_ANSWERS: Answers = {
  mainPurpose: '',
  targetAudience: '',
  desiredVibe: '',
  coreMessage: '',
  audienceDetails: '',
  visualInspirations: '',
  essentialActions: '',
  userJourneys: '',
  contentStrategy: '',
  responsivenessAccessibility: '',
};
