interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const variantStyles = {
    primary: 'bg-[#FF6B00] hover:bg-[#E55F00] text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
};

export function Button({
    children,
    onClick,
    loading = false,
    disabled = false,
    variant = 'primary',
    type = 'button',
    className = ''
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={`
                w-full font-semibold py-3 px-6 rounded-lg 
                transition-all duration-200 shadow-md hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variantStyles[variant]}
                ${className}
            `}
        >
            {loading ? 'Đang xử lý...' : children}
        </button>
    );
}
