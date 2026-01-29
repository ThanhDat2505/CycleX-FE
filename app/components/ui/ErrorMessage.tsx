interface ErrorMessageProps {
    message: string;
    className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div className={`text-red-600 text-sm mt-1 ${className}`}>
            {message}
        </div>
    );
}
