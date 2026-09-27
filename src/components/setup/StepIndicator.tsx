import React from 'react';
import { Check } from 'lucide-react';

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  onStepClick,
}) => {
  return (
    <div className="w-full mb-8">
      {/* Step Numbers & Labels Bar */}
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 -z-0" />

        {/* Filled progress line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-indigo-500 to-amber-500 transition-all duration-300 -z-0"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          const title = stepTitles[step - 1] || `Step ${step}`;

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <button
                type="button"
                onClick={() => onStepClick && step < currentStep && onStepClick(step)}
                disabled={step > currentStep}
                aria-current={isActive ? 'step' : undefined}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                  isCompleted
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 cursor-pointer'
                    : isActive
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30 shadow-lg shadow-indigo-600/40'
                    : 'bg-slate-800 dark:bg-slate-800 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-500 border border-slate-700 dark:border-slate-700 light:border-slate-300'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step}
              </button>

              <span
                className={`text-xs mt-2 font-medium hidden sm:block ${
                  isActive ? 'text-amber-500 dark:text-amber-400 light:text-amber-600 font-semibold' : isCompleted ? 'text-slate-300 dark:text-slate-300 light:text-slate-700' : 'text-slate-500'
                }`}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
