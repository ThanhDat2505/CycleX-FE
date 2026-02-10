interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const variantStyles = {
    primary: 'bg-brand-primary hover:bg-brand-primary-hover text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
};

const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
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
                w-full font-semibold rounded-lg 
                transition-all duration-200 shadow-md hover:shadow-lg
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
                    {size !== 'sm' && 'Đang xử lý...'}
                </span>
            ) : children}
        </button>
    );
}

/**
* w-full - Width 100%
* font-semibold - Font đậm
* py-3 - Padding top/bottom 12px
* px-6 - Padding left/right 24px
* rounded-lg - Bo góc
* disabled:opacity-50 - Khi disabled → Mờ 50%
* disabled:cursor-not-allowed - Cursor 🚫
 */
