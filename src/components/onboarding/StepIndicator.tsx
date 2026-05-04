import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/lib/constants";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {ONBOARDING_STEPS.map(({ step, label }, index) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                  isCompleted && "bg-neutral-900 text-white",
                  isCurrent && "bg-neutral-900 text-white ring-4 ring-neutral-200",
                  !isCompleted && !isCurrent && "bg-neutral-100 text-neutral-400"
                )}
              >
                {isCompleted ? <Check size={14} /> : step}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  isCurrent ? "text-neutral-900" : "text-neutral-400"
                )}
              >
                {label}
              </span>
            </div>
            {index < ONBOARDING_STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-12 sm:w-16 mb-4",
                  step < currentStep ? "bg-neutral-900" : "bg-neutral-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
