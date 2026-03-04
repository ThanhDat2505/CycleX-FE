interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    className?: string;
}

const sizeMap = {
    sm: { icon: 'w-8 h-8', svg: 'w-5 h-5', text: 'text-xl' },
    md: { icon: 'w-10 h-10', svg: 'w-6 h-6', text: 'text-2xl' },
    lg: { icon: 'w-12 h-12', svg: 'w-7 h-7', text: 'text-3xl' }
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
    const sizes = sizeMap[size];

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`${sizes.icon} bg-brand-primary rounded-lg flex items-center justify-center`}>
                <svg className={`${sizes.svg} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            {showText && (
                <span className={`${sizes.text} font-bold text-gray-800`}>
                    Cycle<span className="text-brand-primary">X</span>
                </span>
            )}
        </div>
    );
}
