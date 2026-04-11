'use client';

import { useState } from "react";
import { X, Mail, Lock } from "lucide-react";
import InputField from "../ui/InputField";

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
    onSwitchToRegister: () => void
}

export default function LoginModal({
    isOpen, 
    onClose, 
    onSwitchToRegister
}: LoginModalProps){
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{email?: string, password?: string}>({});
    const [loading, setLoading] = useState(false);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    }

    const validate = () => {
        const newErrors : {email?: string, password?: string} = {};

        if (!email){
            newErrors.email = 'Email adresa je obavezna.';
        } else if (!/\S+@\S+\.\S+/.test(email)){
            newErrors.email = 'Unesite ispravnu email adresu.';
        }

        if (!password){
            newErrors.password = 'Lozinka je obavezna.';
        } else if (password.length < 6){
            newErrors.password = 'Lozinka mora imati minimum 6 karaktera.';
        }

        setErrors(newErrors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({ email, password })
            });

            if (!response.ok){
                const data = await response.json();
                setErrors({ email : data.error.message });
                return;
            }

            onClose();

        } catch (error) {
            setErrors({email: 'Došlo je do greške. Pokušajte ponovo.'})
        } finally{
            setLoading(true);
        }
    }

    if (!isOpen) return;

    return (
        <div
            className="fixed bg-black\60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>
 
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                    Prijavite se
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <InputField 
                        label="Email adresa"
                        type="email"
                        placeholder="email@gmail.com"
                        icon={<Mail size={18} />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                    />

                    <InputField 
                        label="Lozinka"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock size={18} />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                                   text-white font-semibold py-4 rounded-xl transition-colors
                                   mt-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loading ? 'Prijavljivanje' : 'Prijavi se'}
                    </button>

                    <p className="text-center text-gray-500 text-sm mt-4">
                        Nemate nalog? 
                        <button
                            onClick={onSwitchToRegister}
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Registrujte se
                        </button>
                    </p>
                </form>
            </div>
        </div>
    )
}