import React, { useState, useCallback, useMemo, useEffect } from 'react';
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

  // Effect to check for API_KEY on initial mount
  useEffect(() => {
    if (!API_KEY) {
      const keyMissingError = "API_KEY is not configured. AI features will be unavailable. Please check your setup.";
      console.warn(keyMissingError);
      setError(keyMissingError);
      setCurrentStage(AppStage.ERROR);
    }
  }, []); // Runs once on mount

  const ai = useMemo(() => {
    if (!API_KEY) {
      // Error display for this case is handled by the useEffect above
      return null;
    }
    try {
      return new GoogleGenAI({ apiKey: API_KEY });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI:", e);
      const message = e instanceof Error ? e.message : String(e);
      // Note: Calling setError and setCurrentStage from useMemo is a side effect.
      // For this minimal change, we keep it, but ideally, this would be handled differently (e.g., returning an error status from useMemo and reacting in useEffect).
      setError(`Failed to initialize AI services: ${message}. Please check API_KEY and network.`);
      setCurrentStage(AppStage.ERROR);
      return null;
    }
  }, []); // API_KEY is a module-level const, so effectively no deps for re-computation based on it.

  const handleUserInputChange = useCallback((value: string) => {
    setUserInputText(value);
  }, []);

  const handleGenerateBlueprint = useCallback(async () => {
    if (!userInputText.trim()) {
      setError("Please describe your UI project first.");
      return; 
    }
    if (!ai) {
      // This error should ideally be caught by the initial checks or handleRestart logic.
      // If AI initialization failed, currentStage should already be ERROR.
      setError("AI Service is not available. Please ensure your API_KEY is correctly configured and refresh the page.");
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
       // This error should ideally be caught by the initial checks or handleRestart logic.
      setError("AI Service is not available. Please ensure your API_KEY is correctly configured and refresh the page.");
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
    setIsLoading(false);

    if (!ai) { // If AI client isn't initialized, don't proceed to USER_INPUT
      if (!API_KEY) {
        setError("API_KEY is not configured. AI features will be unavailable. Please check your setup and refresh the page.");
      } else {
        // Assumes constructor failed if API_KEY was present but `ai` is null
        setError("AI Service initialization failed. Please check your API_KEY, network connection, and refresh the page.");
      }
      setCurrentStage(AppStage.ERROR); // Remain in error state
    } else {
      setError(null);
      setCurrentStage(AppStage.USER_INPUT);
    }
  }, [ai]); // Added `ai` as a dependency
  
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

    // If currentStage is ERROR, ensure ErrorMessage is shown regardless of other conditions
    if (currentStage === AppStage.ERROR) {
      return <ErrorMessage message={error || "An unknown error occurred."} onRestart={handleRestart} />;
    }
    
    switch (currentStage) {
      case AppStage.USER_INPUT:
        // If ai is null here, it means initialization failed and handleRestart should have kept stage as ERROR.
        // This check is a safeguard.
        if (!ai && API_KEY) { // API_KEY was present but init failed
             return <ErrorMessage message={error || "AI Service initialization failed. Please refresh."} onRestart={handleRestart} />;
        }
         if (!API_KEY) { // API_KEY was missing
             return <ErrorMessage message={error || "API_KEY is not configured. Please refresh after setup."} onRestart={handleRestart} />;
        }
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
        // If masterplan is null, something went wrong, likely an error occurred or was reset.
        // Restarting is a sensible default if we reach here unexpectedly.
        handleRestart(); 
        return <ErrorMessage message="No blueprint data found. Please start over." onRestart={handleRestart} />;

      case AppStage.DISPLAY_UI_DESIGN_PROMPT:
        return (
          <UIDesignPromptDisplay
            prompt={generatedUIDesignPrompt}
            onRestart={handleRestart}
          />
        );
      // ERROR case is handled above renderContent's switch statement.
      case AppStage.GENERATING_BLUEPRINT:
      case AppStage.GENERATING_UI_DESIGN_PROMPT:
        // LoadingIndicator is already shown at the top of renderContent for these stages
        return null; 

      default:
        console.warn("Invalid application state detected:", currentStage, "Resetting to USER_INPUT or ERROR.");
        // If ai is not available, default to error state from handleRestart
        if (!ai) {
            handleRestart(); // This will set to ERROR if ai is null
            return <ErrorMessage message={error || "Application state error. Resetting..."} onRestart={handleRestart} />;
        }
        // Otherwise, attempt to restart to a known good state.
        handleRestart();
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