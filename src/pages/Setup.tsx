import React, { useState } from 'react';
import { GameConfig } from '../types/tambola';
import { getDefaultGameConfig } from '../services/gameEngine';
import { StepIndicator } from '../components/setup/StepIndicator';
import { GameModeSelector } from '../components/setup/GameModeSelector';
import { NumberRangeSelector } from '../components/setup/NumberRangeSelector';
import { PrizeConfigurator } from '../components/setup/PrizeConfigurator';
import { EligibilitySettings } from '../components/setup/EligibilitySettings';
import { VoiceSettingsComponent } from '../components/setup/VoiceSettings';
import { GameReview } from '../components/setup/GameReview';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Button } from '../components/common/Button';
import { ArrowLeft, ArrowRight, Play, Sparkles } from 'lucide-react';

export interface SetupProps {
  initialConfig?: GameConfig;
  onStartGame: (config: GameConfig) => void;
  onCancel: () => void;
}

const STEP_TITLES = [
  'Game Mode',
  'Number Range',
  'Prizes',
  'Eligibility',
  'Voice & Sound',
  'Review & Start',
];

export const Setup: React.FC<SetupProps> = ({
  initialConfig,
  onStartGame,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<GameConfig>(() => initialConfig || getDefaultGameConfig('physical'));

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  const handleFinish = () => {
    onStartGame(config);
  };

  return (
    <div className="min-h-screen theme-bg-page theme-text-primary py-8 px-4 sm:px-6 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Setup Top Navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b theme-border">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black font-heading theme-text-primary">
              Lucky <span className="theme-text-accent">House</span> Setup
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold theme-text-accent theme-bg-accent-subtle px-2.5 py-0.5 rounded-full border theme-border">
              Custom Game Wizard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Exit Setup
            </Button>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={6}
          stepTitles={STEP_TITLES}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* Wizard Step Content Container */}
        <div className="theme-bg-card border theme-border rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md mb-8 transition-colors">
          {currentStep === 1 && (
            <GameModeSelector
              selectedMode={config.mode}
              onSelectMode={(mode) => setConfig({ ...config, mode })}
            />
          )}

          {currentStep === 2 && (
            <NumberRangeSelector
              selectedRange={config.numberRange}
              onSelectRange={(range) => setConfig({ ...config, numberRange: range })}
            />
          )}

          {currentStep === 3 && (
            <PrizeConfigurator
              prizes={config.prizes}
              onChange={(prizes) => setConfig({ ...config, prizes })}
            />
          )}

          {currentStep === 4 && (
            <EligibilitySettings
              lineWinnerFullHouseEligibility={config.lineWinnerFullHouseEligibility}
              onChange={(eligible) =>
                setConfig({ ...config, lineWinnerFullHouseEligibility: eligible })
              }
            />
          )}

          {currentStep === 5 && (
            <VoiceSettingsComponent
              voiceSettings={config.voiceSettings}
              soundSettings={config.soundSettings}
              onVoiceChange={(voiceSettings) => setConfig({ ...config, voiceSettings })}
              onSoundChange={(soundSettings) => setConfig({ ...config, soundSettings })}
            />
          )}

          {currentStep === 6 && <GameReview config={config} />}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="secondary" size="lg" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </Button>

          {currentStep < 6 ? (
            <Button variant="primary" size="lg" onClick={handleNext}>
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="gold"
              size="lg"
              onClick={handleFinish}
              className="font-black px-8 shadow-xl"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START GAME</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
