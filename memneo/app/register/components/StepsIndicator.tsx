interface StepsIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export default function StepsIndicator({ currentStep, totalSteps }: StepsIndicatorProps) {
    const stepTitles = ['Dados Pessoais', 'Educação', 'Segurança', 'Finalizar'];
    
    return (
        <div className="mb-8">
            {/* Progress Bar */}
            <div className="flex items-center justify-center mb-4">
                {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => (
                    <div key={step} className="flex items-center">
                        <div 
                            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ease-out ${
                                currentStep === step 
                                    ? 'bg-blue-600 dark:bg-cyan-400 text-white shadow-lg scale-110' 
                                    : currentStep > step
                                    ? 'bg-green-500 dark:bg-green-400 text-white shadow-md'
                                    : 'bg-gray-300 dark:bg-white/10 text-gray-500 dark:text-white/40'
                            }`}
                        >
                            {currentStep > step ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span className="text-sm font-semibold">{step}</span>
                            )}
                        </div>
                        {step < totalSteps && (
                            <div 
                                className={`h-0.5 w-16 mx-2 transition-all duration-500 ${
                                    currentStep > step 
                                        ? 'bg-green-500 dark:bg-green-400' 
                                        : 'bg-gray-300 dark:bg-white/10'
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>
            
            {/* Current Step Title */}
            <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-white/70 transition-all duration-300">
                    Etapa {currentStep} de {totalSteps}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1 transition-all duration-300">
                    {stepTitles[currentStep - 1]}
                </h3>
            </div>
        </div>
    );
}
