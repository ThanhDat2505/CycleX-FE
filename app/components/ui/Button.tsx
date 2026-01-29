interface ButtonProps {
    children: React.ReactNode; // toàn bộ kiểu dữ liệu bên trong button đều là children
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary'; // hiện màu sắc khác nhau
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const variantStyles = {
    primary: 'bg-brand-primary hover:bg-brand-primary-hover text-white',
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
                ${className} // cho thêm className từ bên ngoài
            `}
        >
            {loading ? 'Đang xử lý...' : children}
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
