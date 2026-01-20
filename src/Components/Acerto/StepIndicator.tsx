import { CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Linha de conexão */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-[var(--border-default)]" style={{ zIndex: 0 }}>
          <div
            className="h-full bg-[var(--color-primary)] transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={index} className="flex flex-col items-center relative" style={{ zIndex: 1 }}>
              {/* Círculo do step */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-300 border-4 border-[var(--bg-primary)]
                  ${isCompleted ? 'bg-[var(--color-primary)] text-white' : ''}
                  ${isCurrent ? 'bg-[var(--color-primary)] text-white shadow-lg scale-110' : ''}
                  ${isUpcoming ? 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-default)]' : ''}
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label do step */}
              <div className="mt-3 text-center max-w-[120px]">
                <p
                  className={`
                    text-sm font-medium transition-colors
                    ${isCurrent ? 'text-[var(--color-primary)]' : ''}
                    ${isCompleted ? 'text-[var(--text-secondary)]' : ''}
                    ${isUpcoming ? 'text-[var(--text-muted)]' : ''}
                  `}
                >
                  {step}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
