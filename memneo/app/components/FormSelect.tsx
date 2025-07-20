import React from 'react';

interface FormSelectProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    required?: boolean;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
    id,
    name,
    label,
    value,
    onChange,
    error,
    required = false,
    options,
    placeholder = "Selecione uma opção"
}) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    id={id}
                    name={name}
                    required={required}
                    className="w-full px-4 py-3 pr-12 bg-white/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/25 focus:border-blue-500 dark:focus:border-white/30 transition-all duration-300 cursor-pointer appearance-none"
                    value={value}
                    onChange={onChange}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em'
                    }}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};
