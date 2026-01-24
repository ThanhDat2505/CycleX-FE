import { authTheme } from "../auth.styles";

type Props = {
    label: string;
    id: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
};
export function FormField({
    label,
    id,
    type = 'text',
    value,
    onChange,
    disabled,
}: Props) {
    return (
        <div>
            <label htmlFor={id} className={authTheme.label}>
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={authTheme.input}
            />
        </div>
    );
}