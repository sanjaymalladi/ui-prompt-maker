import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppStage, Answers, MasterplanData } from './types';
import { EMPTY_ANSWERS, GEMINI_MODEL_NAME } from './constants';
import { PageLayout } from './components/PageLayout';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UserInputForm } from './components/UserInputForm';
import { MasterplanReview } from './components/MasterplanReview';
import { UIDesignPromptDisplay } from './components/UIDesignPromptDisplay';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ErrorMessage } from './components/ErrorMessage';
import { formatMasterplanDataForReview } from './utils/formatters';
import { generateUIDesignPrompt, generateBlueprintFromUserText } from './services/geminiService';

const API_KEY = process.env.API_KEY;

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<AppStage>(AppStage.USER_INPUT);
  const [userInputText, setUserInputText] = useState<string>('');
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS); // Will be populated by AI
  const [masterplan, setMasterplan] = useState<MasterplanData | null>(null);
  const [generatedUIDesignPrompt, setGeneratedUIDesignPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const ai = useMemo(() => {
    if (!API_KEY) {
      console.warn("API_KEY is not configured. Gemini API calls will fail.");
      // setError("API_KEY is not configured. AI features will be unavailable.");
      // setCurrentStage(AppStage.ERROR); // Optionally set error state here
      return null;
    }
    try {
      return new GoogleGenAI({ apiKey: API_KEY });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI:", e);
      setError("Failed to initialize AI services. Please check API_KEY and network.");
      setCurrentStage(AppStage.ERROR);
      return null;
    }
  }, []);

  const handleUserInputChange = useCallback((value: string) => {
    setUserInputText(value);
  }, []);

  const handleGenerateBlueprint = useCallback(async () => {
    if (!userInputText.trim()) {
      setError("Please describe your UI project first.");
      return; 
    }
    if (!ai) {
      setError("AI Service is not available. Please ensure your API_KEY is correctly configured.");
      setCurrentStage(AppStage.ERROR);
      return;
    }

    setCurrentStage(AppStage.GENERATING_BLUEPRINT);
    setError(null);
    setIsLoading(true);

    try {
      const generatedAnswers = await generateBlueprintFromUserText(ai, userInputText);
      setAnswers(generatedAnswers);
      const newMasterplan = formatMasterplanDataForReview(generatedAnswers);
      setMasterplan(newMasterplan);
      setCurrentStage(AppStage.REVIEW_MASTERPLAN);
    } catch (e: any) {
      console.error("Error generating blueprint:", e);
      setError(e.message || "Failed to generate UI blueprint. Please try adjusting your description or try again.");
      setCurrentStage(AppStage.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [userInputText, ai]);
  
  const handleEditBlueprint = useCallback(() => {
    setCurrentStage(AppStage.USER_INPUT);
  }, []);

  const handleConfirmAndGenerateUIDesignPrompt = useCallback(async () => {
    if (!masterplan) {
      setError("Masterplan data is missing. Please generate a blueprint first.");
      setCurrentStage(AppStage.ERROR);
      return;
    }
    if (!ai) {
      setError("AI Service is not available. Please ensure your API_KEY is correctly configured.");
      setCurrentStage(AppStage.ERROR);
      return;
    }

    setCurrentStage(AppStage.GENERATING_UI_DESIGN_PROMPT);
    setError(null);
    setIsLoading(true);

    try {
      const prompt = await generateUIDesignPrompt(ai, masterplan);
      setGeneratedUIDesignPrompt(prompt);
      setCurrentStage(AppStage.DISPLAY_UI_DESIGN_PROMPT);
    } catch (e: any) {
      console.error("Error generating UI design prompt:", e);
      setError(e.message || "Failed to generate UI design prompt. Please try again.");
      setCurrentStage(AppStage.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [masterplan, ai]);

  const handleRestart = useCallback(() => {
    setUserInputText('');
    setAnswers(EMPTY_ANSWERS);
    setMasterplan(null);
    setGeneratedUIDesignPrompt('');
    setError(null);
    setIsLoading(false);
    setCurrentStage(AppStage.USER_INPUT);
  }, []);
  
  const renderContent = () => {
    if (isLoading && 
        (currentStage === AppStage.GENERATING_BLUEPRINT || currentStage === AppStage.GENERATING_UI_DESIGN_PROMPT)) {
       let message = "Just a moment...";
       if (currentStage === AppStage.GENERATING_BLUEPRINT) {
           message = "AI is crafting your UI blueprint... This might take a few seconds.";
       } else if (currentStage === AppStage.GENERATING_UI_DESIGN_PROMPT) {
           message = "AI is generating your detailed UI Design Prompt... Please wait.";
       }
       return <LoadingIndicator message={message} />;
    }

    switch (currentStage) {
      case AppStage.USER_INPUT:
        return (
          <UserInputForm
            initialText={userInputText}
            onChange={handleUserInputChange}
            onSubmit={handleGenerateBlueprint}
            isProcessing={isLoading}
          />
        );
      case AppStage.REVIEW_MASTERPLAN:
        if (masterplan) {
          return (
            <MasterplanReview
              masterplanData={masterplan}
              onEdit={handleEditBlueprint}
              onConfirmAndGenerate={handleConfirmAndGenerateUIDesignPrompt}
            />
          );
        }
        handleRestart(); 
        return <ErrorMessage message="No blueprint data found. Please start over." onRestart={handleRestart} />;

      case AppStage.DISPLAY_UI_DESIGN_PROMPT:
        return (
          <UIDesignPromptDisplay
            prompt={generatedUIDesignPrompt}
            onRestart={handleRestart}
          />
        );
      case AppStage.ERROR:
        return <ErrorMessage message={error || "An unknown error occurred."} onRestart={handleRestart} />;
      
      case AppStage.GENERATING_BLUEPRINT:
      case AppStage.GENERATING_UI_DESIGN_PROMPT:
        // LoadingIndicator is already shown at the top of renderContent for these stages
        return null; 

      default:
        // Attempt to gracefully handle unknown state by restarting
        console.warn("Invalid application state detected:", currentStage, "Resetting to USER_INPUT.");
        handleRestart();
        // It might be better to show an error message here too or rely on UserInputForm to render
        return <ErrorMessage message="Invalid application state. Resetting..." onRestart={handleRestart} />;
    }
  };

  return (
    <PageLayout>
      <Header />
      <main className="flex-grow w-full px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
    </PageLayout>
  );
};

export default App;