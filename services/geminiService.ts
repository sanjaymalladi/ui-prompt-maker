
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MasterplanData, Answers } from '../types';
import { GEMINI_MODEL_NAME, BLUEPRINTING_PRINCIPLES_TEXT } from '../constants';
import { formatMasterplanDataForGeminiPrompt } from '../utils/formatters';

export const generateBlueprintFromUserText = async (
  ai: GoogleGenAI,
  userText: string
): Promise<Answers> => {
  const systemInstruction = `You are an expert UI/UX Architect. The user will provide a description of their UI/project.
Your task is to analyze this description and, by applying the provided UI/UX design principles, extract and infer all necessary details to populate a comprehensive UI blueprint.
If the user's description is brief or lacks specific details for some blueprint sections, use your expertise and the provided principles to make logical inferences and fill in those gaps.
The goal is to create a complete starting blueprint even from a high-level user request.

You MUST output a single JSON object. The JSON object must strictly conform to the following TypeScript interface structure:

interface Answers {
  mainPurpose: string; // e.g., "To help users track their daily fitness goals."
  targetAudience: string; // e.g., "Young professionals aged 25-35, tech-savvy, busy schedules."
  desiredVibe: string; // e.g., "Professional, playful, trustworthy, innovative, calming, energetic."
  coreMessage: string; // e.g., "'Achieve your fitness goals effortlessly.'"
  audienceDetails: string; // Describe audience behaviors, tech comfort, expectations, accessibility needs. e.g., "Expect intuitive mobile-first design, familiar with swipe gestures. Need high contrast for readability."
  visualInspirations: string; // Admired designs, preferred colors, typography, imagery. e.g., "Inspired by minimalist Scandinavian design. Prefer muted blues, clean sans-serif fonts, abstract geometric patterns."
  essentialActions: string; // Key tasks users must perform. e.g., "Log workout, view progress, set reminders, update profile."
  userJourneys: string; // Typical user flows. e.g., "1. User opens app -> taps 'Log Workout' -> selects activity -> enters duration -> saves."
  contentStrategy: string; // Content types and organization. e.g., "Primarily data visualizations (charts, graphs) and short textual summaries. Organized by date and activity type."
  responsivenessAccessibility: string; // Screen adaptation, other accessibility needs. e.g., "Fully responsive, mobile-first. Ensure keyboard navigation and ARIA landmarks."
}

Do NOT include any explanatory text before or after the JSON object.
Ensure all string fields in the JSON are populated with meaningful content. If information is missing from the user's input for a field, infer it based on the project type and principles, or provide a sensible placeholder like "To be defined" or "General Audience" if no reasonable inference can be made. Avoid empty strings unless truly appropriate.

UI/UX Design Principles to Guide Your Blueprint Generation:
${BLUEPRINTING_PRINCIPLES_TEXT}
`;

  const userPrompt = `User's Project Description:
"${userText}"

Based on this description and the UI/UX principles provided in the system instruction, generate the JSON blueprint.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.5, 
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    try {
      const parsedData = JSON.parse(jsonStr);
      if (typeof parsedData.mainPurpose !== 'string' || typeof parsedData.targetAudience !== 'string') {
        throw new Error("AI response is not in the expected JSON format for Answers.");
      }
      return parsedData as Answers;
    } catch (e) {
      console.error("Failed to parse JSON response from AI:", e, "Raw response:", jsonStr);
      throw new Error("AI returned an invalid data structure. Please try rephrasing your project description.");
    }

  } catch (error: any) {
    console.error("Gemini API Error (generateBlueprintFromUserText):", error);
    if (error.message && error.message.includes('API key not valid')) {
        throw new Error("Gemini API key is not valid. Please check your configuration.");
    }
    if (error.message && error.message.includes('json')) { 
        throw new Error("The AI had trouble formatting its response. Please try again, or rephrase your request.");
    }
    throw new Error(error.message || "An unknown error occurred while communicating with the Gemini API.");
  }
};


export const generateUIDesignPrompt = async (
  ai: GoogleGenAI,
  masterplanData: MasterplanData
): Promise<string> => {
  if (!masterplanData || !masterplanData.projectOverview) {
    throw new Error("Masterplan data is incomplete or missing for generating UI design prompt.");
  }
  const masterplanText = formatMasterplanDataForGeminiPrompt(masterplanData);

  const systemInstruction = `You are an expert UI/UX Architect and Design Lead, tasked with creating a comprehensive UI Design Prompt/Specification.
This document will serve as the foundational guide for designing and developing a user interface.
It should be detailed, actionable, and firmly rooted in the UI/UX principles outlined in the 'Blueprinting Intuitive User Interfaces' methodology (Nielsen, Norman, Krug, Laws of UX, Ogilvy).
The input will be a 'UI Masterplan'. Your role is to expand on this masterplan, elaborating on each section to provide clear directives for UI design.
The final output should be a well-structured textual document, NOT JSON.
Ensure the specification clearly articulates how core UI/UX principles should be practically applied in the design of specific UI elements, layouts, and interactions.
The tone should be professional, inspiring, and highly descriptive to enable a designer (or another AI) to accurately bring the vision to life.
`;
  
  const userPrompt = `
Based on the following UI Masterplan, generate a comprehensive UI Design Prompt/Specification.

UI Masterplan Details:
${masterplanText}

---
Using the Masterplan above, expand it into a full UI Design Specification. Structure your response according to the following sections, providing detailed guidance for each. Ensure each section is thoroughly addressed with actionable insights:

I. Project Overview and Core Objective:
   - Elaborate on the UI's primary goal, the specific problem it solves, and the unique value it provides to users.
   - Provide a detailed profile of the primary target audience: include demographics, typical behaviors, technical proficiency, key needs, and expectations (reference Jakob's Law for meeting existing user mental models).
   - Define the desired 'vibe' (e.g., professional, playful, minimalist, futuristic, calming) and articulate how visual design elements (color, typography, imagery) and interaction patterns will collectively achieve this emotional impact.
   - State the single most important message the UI must convey (Ogilvy's "Big Idea"). Explain how the overall design and content strategy will reinforce this core message at every user touchpoint.

II. Key UI Sections and Conceptual Content Outline:
   - List and describe all critical UI sections or views (e.g., Home/Dashboard, Profile, Settings, Product Listing, Article View, Search Results, Checkout Process).
   - For each section:
     - Define its primary purpose and key user goals within that section.
     - Outline the essential content, data, and functionalities that must be present (apply Miller's Law for information chunking and clarity).
   - Describe high-level navigation flows between these sections. How will users intuitively move from one part of the UI to another? (Consider Nielsen's "Visibility of system status" and "User control and freedom" for clear navigation paths, breadcrumbs, back buttons).

III. Wireframe-Level Layout and Information Hierarchy:
   - Propose general layout principles (e.g., use of a responsive grid system, common patterns like F-pattern or Z-pattern for content scanning).
   - Specify the strategic placement of key UI elements: global navigation (header/sidebar), primary calls-to-action, main content areas, and secondary information. Emphasize Fitts's Law for sizing and placement of interactive targets.
   - Detail strategies for establishing a clear information hierarchy within sections and across the UI (e.g., typographic scale, visual weight, spacing). Explain how progressive disclosure will be used to manage complexity and reduce cognitive load (Krug's "Don't Make Me Think", Hick's Law).
   - Explain how Gestalt principles (e.g., Proximity, Similarity, Common Region) will be applied to group related items and create visual coherence.
   - Describe how interactive elements (buttons, input fields, links) will clearly afford their use (Norman's Principles of Affordance and Signifiers). What visual cues will indicate interactivity?

IV. Visual and Interaction Style Guide (Conceptual):
   - Color Palette: Propose a primary, secondary, and accent color palette. Justify choices based on the desired 'vibe', brand identity (if any), and accessibility (contrast).
   - Typography: Suggest specific font families (e.g., sans-serif for body, serif for headings), weights, and sizes. Explain how typography will contribute to the UI's personality, readability, and information hierarchy.
   - Imagery & Iconography: Describe the style for images, illustrations, and icons (e.g., realistic photos, abstract illustrations, line icons, filled icons). How will they support the content and 'vibe'?
   - Interaction Design Details:
     - Feedback: Specify how the system will provide immediate and clear feedback for user actions (e.g., visual cues for button presses, loading indicators, success/error messages, notifications - Norman's Feedback).
     - Consistency: Emphasize the importance of consistent design and behavior for all interactive elements (buttons, links, forms, navigation menus) across the UI (Nielsen's "Consistency and standards").
     - Animations & Transitions: Suggest subtle animations or transitions that enhance user experience, guide attention, or provide smooth state changes without being distracting.

V. Usability and Accessibility Checklist (Application Guidance):
   - For each of the following principles, provide specific, actionable examples of HOW they will be implemented in THIS UI design:
     - Nielsen's Heuristics: Visibility of system status; Match between system and real world; User control and freedom; Consistency and standards; Error prevention; Recognition rather than recall; Flexibility and efficiency of use; Aesthetic and minimalist design.
     - Krug's Principles: "Don't Make Me Think"; Clear navigation; Instructions must die.
     - Norman's Principles: Affordances; Signifiers; Feedback; Conceptual Model.
     - Accessibility (WCAG AA as a minimum target): Perceivable (e.g., alt text for images, sufficient color contrast, resizable text); Operable (e.g., full keyboard navigability, clear focus indicators, no keyboard traps); Understandable (e.g., clear language, predictable navigation); Robust (e.g., use of ARIA landmarks and roles where appropriate).
     - Example: "Error Prevention: All input fields will feature real-time inline validation with constructive error messages appearing next to the field. Critical actions like 'Delete Account' will use a confirmation dialog with a clearly marked primary action to proceed and a secondary action to cancel."
     - Example: "Accessibility - Keyboard Navigation: All interactive elements will be focusable and operable via keyboard using Tab/Shift+Tab for navigation and Enter/Space for activation. Focus order will be logical."

VI. Content and Asset Considerations (Conceptual):
   - Key Copy Elements: Identify needs for headlines, body text, microcopy (button labels, tooltips, error messages), calls-to-action. Emphasize a clear, concise, and user-centric tone (Ogilvy's "Give the facts").
   - Graphics & Imagery: List types of graphics or images needed (e.g., product photos, user avatars, feature illustrations, background textures).
   - Icons: Specify needs for a consistent set of UI icons.
   - Multimedia: Note if any video or audio content is planned and its purpose.

VII. Potential Future Enhancements (Optional):
   - Briefly suggest 1-2 logical next steps for features or scalability, based on the core UI concept.

Generate ONLY the UI Design Prompt/Specification as a structured text. Be creative, highly descriptive, and practical. Ensure the output is comprehensive and directly usable for UI design.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7, 
            topP: 0.9,
            topK: 40,
        }
    });
    
    const text = response.text;
    if (!text || text.trim() === "") {
        throw new Error("Received an empty response from Gemini API when generating UI design prompt.");
    }
    return text.trim();

  } catch (error: any) {
    console.error("Gemini API Error (generateUIDesignPrompt):", error);
    if (error.message && error.message.includes('API key not valid')) {
        throw new Error("Gemini API key is not valid. Please check your configuration.");
    }
    throw new Error(error.message || "An unknown error occurred while communicating with the Gemini API for UI design prompt generation.");
  }
};
