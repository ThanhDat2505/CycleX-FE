import { authTheme } from "../auth.styles";

type Props = {
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
};

export function SubmitButton({
    loading,
    disabled,
    children,
    onClick,
}: Props) {
    return (
        <button
            type="submit"
            onClick={onClick}
            disabled={loading || disabled}
            className={`${authTheme.button} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {loading ? 'Đang xử lý...' : children}
        </button>
    );
}