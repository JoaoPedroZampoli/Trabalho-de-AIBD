import React from 'react';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex items-center justify-center mb-6">
            {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => (
                <div 
                    key={step} 
                    className={`w-8 h-2 mx-1 rounded-full transition-all duration-500 ease-in-out ${
                        currentStep === step 
                            ? 'bg-blue-600 dark:bg-cyan-400 transform scale-110' 
                            : currentStep > step
                                ? 'bg-blue-400 dark:bg-cyan-600'
                                : 'bg-gray-300 dark:bg-white/10'
                    }`}
                ></div>
            ))}
        </div>
    );
};
