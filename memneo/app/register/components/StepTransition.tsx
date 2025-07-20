import { ReactNode } from 'react';

interface StepTransitionProps {
    children: ReactNode;
    currentStep: number;
    targetStep: number;
}

export default function StepTransition({ children, currentStep, targetStep }: StepTransitionProps) {
    const isVisible = currentStep === targetStep;
    const isNext = currentStep > targetStep;
    const isPrev = currentStep < targetStep;
    
    return (
        <div 
            className={`transition-all duration-700 ease-in-out transform ${
                isVisible 
                    ? 'opacity-100 translate-x-0 scale-100' 
                    : isNext
                    ? 'opacity-0 -translate-x-8 scale-95 pointer-events-none absolute'
                    : 'opacity-0 translate-x-8 scale-95 pointer-events-none absolute'
            }`}
        >
            <div className={`transition-all duration-500 delay-100 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
                {children}
            </div>
        </div>
    );
}
