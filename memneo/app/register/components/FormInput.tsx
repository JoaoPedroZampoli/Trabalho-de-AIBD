interface FormInputProps {
    id: string;
    name: string;
    type: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    autoComplete?: string;
    required?: boolean;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
}

export default function FormInput({
    id,
    name,
    type,
    label,
    placeholder,
    value,
    onChange,
    error,
    autoComplete,
    required = false,
    showPasswordToggle = false,
    showPassword = false,
    onTogglePassword
}: FormInputProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
                    autoComplete={autoComplete}
                    required={required}
                    className={`w-full px-4 py-3 bg-white/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/25 focus:border-blue-500 dark:focus:border-white/30 transition-all duration-300 ${showPasswordToggle ? 'pr-12' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {showPasswordToggle && onTogglePassword && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={onTogglePassword}
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5 text-gray-600 dark:text-white/60 hover:text-gray-800 dark:hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-600 dark:text-white/60 hover:text-gray-800 dark:hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
