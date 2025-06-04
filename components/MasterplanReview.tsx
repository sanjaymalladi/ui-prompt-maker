
import React from 'react';
import { MasterplanData } from '../types';

interface MasterplanReviewProps {
  masterplanData: MasterplanData;
  onEdit: () => void;
  onConfirmAndGenerate: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6 p-4 border border-slate-700 rounded-lg bg-slate-800/50">
    <h3 className="text-xl font-semibold mb-2 text-sky-400">{title}</h3>
    <div className="text-slate-300 space-y-1 whitespace-pre-wrap">{children}</div>
  </div>
);

export const MasterplanReview: React.FC<MasterplanReviewProps> = ({ masterplanData, onEdit, onConfirmAndGenerate }) => {
  return (
    <div className="bg-slate-800 shadow-2xl rounded-lg p-6 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Review Your AI-Generated UI Blueprint</h2>
      <p className="text-slate-400 mb-6 text-center">The AI has generated this blueprint based on your description and UI/UX best practices. Review the details. If you'd like to refine your initial description, click "Edit Description". Otherwise, proceed to generate the detailed UI Design Prompt.</p>

      <div className="space-y-4">
        <Section title="Project Overview">
          <p><strong>Primary Goal:</strong> {masterplanData.projectOverview.primaryGoal || 'N/A'}</p>
          <p><strong>Target Audience:</strong> {masterplanData.projectOverview.targetAudience || 'N/A'}</p>
          <p><strong>Desired Vibe:</strong> {masterplanData.projectOverview.desiredVibe || 'N/A'}</p>
          <p><strong>Core Message:</strong> {masterplanData.projectOverview.coreMessage || 'N/A'}</p>
        </Section>

        <Section title="Target Audience Deep Dive">
          <p>{masterplanData.targetAudienceAnalysis.details || 'N/A'}</p>
        </Section>

        <Section title="Key UI Sections & Flows">
          <p><strong>Essential Actions:</strong> {masterplanData.keyUISectionsAndFlows.actions || 'N/A'}</p>
          <p><strong>User Journeys:</strong> {masterplanData.keyUISectionsAndFlows.journeys || 'N/A'}</p>
        </Section>

        <Section title="Content Strategy">
          <p>{masterplanData.contentStrategy.details || 'N/A'}</p>
        </Section>

        <Section title="Visual & Interaction Style">
          <p><strong>Inspiration:</strong> {masterplanData.visualAndInteractionStyle.inspiration || 'N/A'}</p>
        </Section>

        <Section title="Responsiveness & Accessibility">
          <p>{masterplanData.responsivenessAndAccessibility.details || 'N/A'}</p>
        </Section>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onEdit}
          className="w-full sm:w-auto px-8 py-3 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-md transition-colors"
        >
          Edit Description
        </button>
        <button
          onClick={onConfirmAndGenerate}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-md transition-all transform hover:scale-105"
        >
          Confirm &amp; Generate UI Design Prompt
        </button>
      </div>
    </div>
  );
};
