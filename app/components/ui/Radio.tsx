interface RadioOption {
    label: string;
    value: string;
}

interface RadioGroupProps {
    label?: string;
    name: string;
    options: RadioOption[];
    selectedValue: string;
    onChange: (value: any) => void;
    disabled?: boolean;
    className?: string;
}

export function RadioGroup({
    label,
    name,
    options,
    selectedValue,
    onChange,
    disabled = false,
    className = ''
}: RadioGroupProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <span className="block text-sm font-semibold text-gray-700">
                    {label}
                </span>
            )}
            <div className="flex flex-wrap gap-4">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`
                            flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-all
                            ${selectedValue === option.value
                                ? 'border-brand-primary bg-brand-primary/5 text-brand-primary ring-1 ring-brand-primary'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }
                            ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                        `}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={() => !disabled && onChange(option.value)}
                            className="hidden"
                            disabled={disabled}
                        />
                        <div className={`
                            w-4 h-4 rounded-full border flex items-center justify-center mr-3
                            ${selectedValue === option.value
                                ? 'border-brand-primary'
                                : 'border-gray-300'
                            }
                        `}>
                            {selectedValue === option.value && (
                                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                            )}
                        </div>
                        <span className="text-sm font-medium">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
