
export interface Question {
  id: keyof Answers;
  text: string;
  longText?: string; // Optional longer description for the question
  placeholder?: string;
  type: 'text' | 'textarea';
}

// This interface will now be populated by AI based on user's single input
export interface Answers {
  mainPurpose: string;
  targetAudience: string;
  desiredVibe: string;
  coreMessage: string;
  audienceDetails: string;
  visualInspirations: string;
  essentialActions: string;
  userJourneys: string;
  contentStrategy: string;
  responsivenessAccessibility: string;
}

export type PartialAnswers = Partial<Answers>;

export interface MasterplanData {
  projectOverview: {
    primaryGoal: string;
    targetAudience: string;
    desiredVibe: string;
    coreMessage: string;
  };
  targetAudienceAnalysis: {
    details: string;
  };
  keyUISectionsAndFlows: {
    actions: string;
    journeys: string;
  };
  contentStrategy: {
    details: string;
  };
  visualAndInteractionStyle: {
    inspiration: string;
  };
  responsivenessAndAccessibility: {
    details:string;
  };
}

export enum AppStage {
  USER_INPUT = 'USER_INPUT', // Initial stage for user's free-form input
  GENERATING_BLUEPRINT = 'GENERATING_BLUEPRINT', // AI is generating the initial Masterplan/Blueprint
  REVIEW_MASTERPLAN = 'REVIEW_MASTERPLAN',
  GENERATING_UI_DESIGN_PROMPT = 'GENERATING_UI_DESIGN_PROMPT', // AI is generating the detailed UI design prompt
  DISPLAY_UI_DESIGN_PROMPT = 'DISPLAY_UI_DESIGN_PROMPT', // Displaying the generated UI design prompt
  ERROR = 'ERROR',
}
