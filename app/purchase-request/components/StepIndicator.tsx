/**
 * Step Indicator Component
 * Shows current step in multi-step form
 */

interface StepIndicatorProps {
    currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { number: 1, title: 'Thông tin' },
        { number: 2, title: 'Xác nhận' }
    ];

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            <div className="relative flex items-center justify-between">
                {/* Connecting Line - Background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>

                {/* Connecting Line - Active */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full -z-10 transition-all duration-500 ease-in-out"
                    style={{ width: `${(currentStep - 1) / (steps.length - 1) * 100}%` }}
                ></div>

                {steps.map((step) => {
                    const isActive = currentStep >= step.number;
                    const isCurrent = currentStep === step.number;

                    return (
                        <div key={step.number} className="flex flex-col items-center relative z-10">
                            <div
                                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ease-out
                                    ${isActive
                                        ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-glow'
                                        : 'bg-white border-gray-300 text-gray-400'
                                    }
                                `}
                            >
                                {isActive && !isCurrent ? (
                                    <svg className="w-5 h-5 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className={isCurrent ? 'animate-scale-in' : ''}>{step.number}</span>
                                )}
                            </div>
                            <span
                                className={`
                                    mt-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300
                                    ${isActive ? 'text-blue-700' : 'text-gray-400'}
                                `}
                            >
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
