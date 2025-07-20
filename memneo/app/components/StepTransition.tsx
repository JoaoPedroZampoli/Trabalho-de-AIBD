import React, { useEffect, useState } from 'react';

interface StepTransitionProps {
    children: React.ReactNode;
    currentStep: number;
    direction?: 'forward' | 'backward';
}

export const StepTransition: React.FC<StepTransitionProps> = ({ 
    children, 
    currentStep, 
    direction = 'forward' 
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [content, setContent] = useState(children);

    useEffect(() => {
        setIsVisible(false);
        
        const timeout = setTimeout(() => {
            setContent(children);
            setIsVisible(true);
        }, 150);

        return () => clearTimeout(timeout);
    }, [currentStep]);

    const slideClass = direction === 'forward' 
        ? isVisible ? 'translate-x-0' : 'translate-x-8' 
        : isVisible ? 'translate-x-0' : '-translate-x-8';

    return (
        <div className={`transition-all duration-300 ease-in-out transform ${slideClass} ${
            isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
            {content}
        </div>
    );
};
