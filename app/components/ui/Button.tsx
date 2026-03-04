interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const variantStyles = {
    primary: 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
};

const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-5 text-base', // Adjusted slightly for better proportions
    lg: 'py-3.5 px-7 text-lg'
};

export function Button({
    children,
    onClick,
    loading = false,
    disabled = false,
    variant = 'primary',
    size = 'md',
    type = 'button',
    className = ''
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={`
                font-semibold
                inline-flex items-center justify-center
                rounded-lg 
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${className}
            `}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {size !== 'sm' && '...'}
                </span>
            ) : children}
        </button>
    );
}
