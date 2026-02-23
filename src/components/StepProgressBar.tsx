import { Check } from "lucide-react";

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const StepProgressBar = ({ currentStep, totalSteps, labels }: StepProgressBarProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        {labels.map((label, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "bg-primary text-primary-foreground glow-border"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center max-w-[80px] leading-tight ${
                  isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgressBar;
