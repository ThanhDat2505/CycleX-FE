interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}

export function Checkbox({ id, label, checked, onChange, className = '' }: CheckboxProps) {
    return (
        <div className={`flex items-center ${className}`}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 text-[#FF6B00] bg-gray-100 border-gray-300 rounded focus:ring-[#FF6B00] focus:ring-2 cursor-pointer"
            />
            <label
                htmlFor={id}
                className="ml-2 text-sm text-gray-600 cursor-pointer select-none"
            >
                {label}
            </label>
        </div>
    );
}
