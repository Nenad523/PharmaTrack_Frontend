'use client';

import { useState } from "react";
import { X, Mail, Lock } from "lucide-react";
import InputField from "../ui/InputField";
import { fetchCurrentUser, getAuthUserFromResponse, loginUser } from "../auth/api";
import type { AuthUser } from "../auth/types";

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
    onLoginSuccess?: (user: AuthUser) => void
    onSwitchToRegister: () => void
}

export default function LoginModal({
    isOpen, 
    onClose, 
    onLoginSuccess,
    onSwitchToRegister

}: LoginModalProps){
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{email?: string, password?: string}>({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    
    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSwitchToRegister = () => {
        resetForm();
        onSwitchToRegister();
    };

    const getErrorMessage = async (response: Response) => {
        try {
            const contentType = response.headers.get('content-type') || '';

            if (contentType.includes('application/json')) {
                const data = await response.json();
                return data?.error?.message || data?.message || 'Greška pri prijavi';
            }

            const text = await response.text();
            return text || 'Greška pri prijavi';

        } catch {
            return 'Greška pri prijavi';
        }
    };
    
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) handleClose();
    }

    const validate = () => {
        const newErrors : {email?: string, password?: string} = {};
        const trimmedEmail = email.trim();

        if (!trimmedEmail){
            newErrors.email = 'Email adresa je obavezna.';
        } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)){
            newErrors.email = 'Unesite ispravnu email adresu.';
        }

        if (!password){
            newErrors.password = 'Lozinka je obavezna.';
        } else if (password.length < 6){
            newErrors.password = 'Lozinka mora imati minimum 6 karaktera.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setErrors({});
        setGeneralError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGeneralError('');
        
        if (!validate()) return;

        setLoading(true);

        try {
            const trimmedEmail = email.trim();

            const response = await loginUser(trimmedEmail, password);

            if (!response.ok){
                const errorMessage = await getErrorMessage(response);
                setGeneralError(errorMessage);
                return;
            }

            const user = await getAuthUserFromResponse(response) ?? await fetchCurrentUser();

            if (!user) {
                setGeneralError('Prijava je uspjela, ali podaci korisnika nisu učitani.');
                return;
            }

            onLoginSuccess?.(user);
            handleClose();

          } catch (err) {
           console.error('[LoginModal] handleSubmit error:', err);
           setGeneralError('Došlo je do greške. Pokušajte ponovo.');
        } finally{
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
        >
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-2xl animate-slide-in-bottom">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-smooth cursor-pointer"
                    aria-label="Zatvori modal"
                >
                    <X size={20} />
                </button>
 
                <h2 
                    id="login-modal-title" 
                    className="text-2xl font-bold text-gray-900 text-center mb-6"
                >
                    Prijavite se
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      {generalError && (
                            <p className="text-red-500 text-sm text-center">
                                {generalError}
                            </p>
                      )}

                    <InputField 
                        label="Email adresa"
                        type="email"
                        placeholder="email@gmail.com"
                        icon={<Mail size={18} />}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors(prev => ({ ...prev, email: undefined }));
                            setGeneralError('');
                        }}
                        error={errors.email}
                        disabled={loading}
                    />

                    <InputField 
                        label="Lozinka"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock size={18} />}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors(prev => ({ ...prev, password: undefined }));
                            setGeneralError('');
                        }}
                        error={errors.password}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                                   text-white font-semibold py-3 rounded-xl transition-smooth
                                   mt-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loading ? 'Prijavljivanje...' : 'Prijavi se'}
                    </button>

                    <p className="text-center text-gray-500 text-sm mt-2">
                        Nemate nalog? 
                        <button
                            type="button"
                            onClick={handleSwitchToRegister}
                            className="text-blue-600 font-semibold hover:underline pl-1 cursor-pointer transition-smooth"
                        >
                            Registrujte se
                        </button>
                    </p>
                </form>
            </div>
        </div>
    )
}
