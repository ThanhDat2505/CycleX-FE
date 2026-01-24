interface InputProps {
    label: string;
    id: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
    className?: string;
}

export function Input({
    label,
    id,
    type = 'text',
    value,
    onChange,
    disabled = false,
    placeholder,
    error,
    className = ''
}: InputProps) {
    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="block text-gray-700 font-medium mb-2 text-sm"
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={placeholder}
                className={`
                    w-full px-4 py-3 border rounded-lg 
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                    outline-none transition-all
                    ${error ? 'border-red-500' : 'border-gray-300'}
                    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                `}
            />
            {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}
