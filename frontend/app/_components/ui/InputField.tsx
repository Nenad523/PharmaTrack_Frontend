"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";  

interface InputFieldProps {
    label: string
    type: 'email' | 'password' | 'text'
    placeholder: string
    icon: React.ReactNode
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string,
    disabled?: boolean
}

export default function InputField({
    label,
    type,
    placeholder,
    icon,
    value,
    onChange,
    error,
    disabled
} : InputFieldProps){
    
    const [showPassword, setShowPassword] = useState(false);
    const inputId = useId();
    const errorId = `${inputId}-error`;

    const inputType = type === 'password' 
    ? showPassword ? 'text' : 'password' 
    : type;

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={inputId} className="text-sm font-semibold text-gray-800">
                {label}
            </label>
            <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border bg-gray-50 transition-smooth
                ${error
                ? 'border-red-400'
                : 'border-gray-200 focus-within:border-blue-500'
                }
            `}>
                <span className="text-gray-400">{icon}</span>
                <input
                    id={inputId}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    name={type}
                    disabled={disabled}
                    onChange={onChange}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 text-sm"
                />
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={disabled}
                        aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                        className="text-gray-400 hover:text-gray-600 transition-smooth cursor-pointer"
                    >
                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                         
                    </button>
                )}

            </div>
            {error && (
                <p id={errorId} className="text-red-500 text-xs">
                    {error}
                </p>
            )}
        </div>
    )
}