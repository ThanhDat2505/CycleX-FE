/**
 * Step Indicator Component
 * Shows current step in multi-step form (S-50)
 */

import { Check } from 'lucide-react';
import { MESSAGES } from '@/app/constants';

/** Step definitions — static, defined outside component to avoid re-creation */
const STEPS = [
    { number: 1, title: MESSAGES.S50_STEP_INFO },
    { number: 2, title: MESSAGES.S50_STEP_CONFIRM },
] as const;

/** Style constants */
const STYLES = {
    wrapper: 'w-full max-w-sm mx-auto mb-12',
    container: 'relative flex items-center justify-between',
    lineBg: 'absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100/80 rounded-full -z-10',
    lineActive: 'absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-400 via-brand-primary to-brand-primary rounded-full -z-10 transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    stepCol: 'flex flex-col items-center relative z-10 group',
    circle: (isActive: boolean, isCurrent: boolean) => `
        w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all duration-700 ease-out
        ${isActive
            ? 'bg-brand-primary border-brand-primary text-white scale-110 shadow-lg shadow-blue-200 rotate-6'
            : 'bg-white border-gray-100 text-gray-300'
        }
        ${isCurrent ? 'animate-pulse-slow shadow-[0_0_20px_rgba(59,130,246,0.5)] !rotate-0 !scale-125' : ''}
    `,
    label: (isActive: boolean, isCurrent: boolean) => `
        mt-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500
        ${isActive ? 'text-blue-900 opacity-100 translate-y-0' : 'text-gray-300 opacity-50 translate-y-1'}
        ${isCurrent ? 'scale-110 text-brand-primary' : ''}
    `,
} as const;

interface StepIndicatorProps {
    currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <div className={STYLES.wrapper}>
            <div className={STYLES.container}>
                {/* Connecting Line - Background */}
                <div className={STYLES.lineBg}></div>

                {/* Connecting Line - Active */}
                <div
                    className={STYLES.lineActive}
                    style={{ width: `${(currentStep - 1) / (STEPS.length - 1) * 100}%` }}
                ></div>

                {STEPS.map((step) => {
                    const isActive = currentStep >= step.number;
                    const isCurrent = currentStep === step.number;

                    return (
                        <div key={step.number} className={STYLES.stepCol}>
                            <div className={STYLES.circle(isActive, isCurrent)}>
                                {isActive && !isCurrent ? (
                                    <Check size={20} strokeWidth={3} className="animate-scale-in" />
                                ) : (
                                    <span className={isCurrent ? 'animate-scale-in' : ''}>{step.number}</span>
                                )}
                            </div>
                            <span className={STYLES.label(isActive, isCurrent)}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
