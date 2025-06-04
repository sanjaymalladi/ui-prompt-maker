
import { Answers, MasterplanData } from '../types';

export const formatMasterplanDataForReview = (answers: Answers): MasterplanData => {
  return {
    projectOverview: {
      primaryGoal: answers.mainPurpose,
      targetAudience: answers.targetAudience,
      desiredVibe: answers.desiredVibe,
      coreMessage: answers.coreMessage,
    },
    targetAudienceAnalysis: {
      details: answers.audienceDetails,
    },
    keyUISectionsAndFlows: {
      actions: answers.essentialActions,
      journeys: answers.userJourneys,
    },
    contentStrategy: {
      details: answers.contentStrategy,
    },
    visualAndInteractionStyle: {
      inspiration: answers.visualInspirations,
    },
    responsivenessAndAccessibility: {
      details: answers.responsivenessAccessibility,
    },
  };
};

export const formatMasterplanDataForGeminiPrompt = (masterplanData: MasterplanData): string => {
  return `
**Project Overview & Core Message:**
- Primary Goal: ${masterplanData.projectOverview.primaryGoal || 'N/A'}
- Target Audience: ${masterplanData.projectOverview.targetAudience || 'N/A'}
- Desired Vibe/Emotional Impact: ${masterplanData.projectOverview.desiredVibe || 'N/A'}
- Single Most Important Message: ${masterplanData.projectOverview.coreMessage || 'N/A'}

**Target Audience Deep Dive:**
- Behaviors, Comfort Levels, Expectations, Accessibility: ${masterplanData.targetAudienceAnalysis.details || 'N/A'}

**Key UI Sections, Functionality & User Flows:**
- Essential Actions/Tasks: ${masterplanData.keyUISectionsAndFlows.actions || 'N/A'}
- Typical User Journeys: ${masterplanData.keyUISectionsAndFlows.journeys || 'N/A'}

**Content Strategy:**
- Primary Content Types & Organization: ${masterplanData.contentStrategy.details || 'N/A'}

**Visual & Emotional Direction (Vibe Coding):**
- Visual Inspirations, Colors, Typography, Imagery: ${masterplanData.visualAndInteractionStyle.inspiration || 'N/A'}

**Responsiveness & Accessibility Basics:**
- Cross-Device Adaptation & Specific Needs: ${masterplanData.responsivenessAndAccessibility.details || 'N/A'}
  `.trim();
};
