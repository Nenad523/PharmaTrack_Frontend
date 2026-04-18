'use client'

import { useState } from "react"
import { X, User, Mail, Lock } from "lucide-react"
import InputField from "../ui/InputField"

interface RegisterModalProps {
    isOpen: boolean
    onClose: () => void
    onSwitchToLogin: () => void
}

export default function RegisterModal({
    isOpen,
    onClose,
    onSwitchToLogin
}: RegisterModalProps){

    const [username, setUsername]  = useState('');
    const [email, setEmail]  = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{email?: string, password?: string, username?: string}>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setErrors({});
        setSuccess(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSwitchToLogin = () => {
        resetForm();
        onSwitchToLogin();
    };

    const getErrorMessage = async (response: Response) => {
        try {
            const contentType = response.headers.get('content-type') || '';

            if (contentType.includes('application/json')) {
                const data = await response.json();
                return data?.error?.message || data?.message || 'Greška pri registraciji';
            }

            const text = await response.text();
            return text || 'Greška pri registraciji';
        } catch {
            return 'Greška pri registraciji';
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) handleClose();
    }

    const validate = () => {
        const newErrors : {email?: string, password?: string, username?: string} = {};
        const trimmedEmail = email.trim();
        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            newErrors.username = 'Ime i prezime je obavezno.';
        }

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        try {
            e.preventDefault();
            if (!validate()) return;

            setLoading(true);
            const trimmedEmail = email.trim();
            const fullName = username.trim();

            const response = await fetch(`${API_URL}/api/v1/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type' : 'application/json'},
                body: JSON.stringify({ email: trimmedEmail, password: password, fullName })
            });
            
            if (!response.ok){
                const errorMessage = await getErrorMessage(response);
                setErrors({ email: errorMessage });
                return;
            }

            setSuccess(true);

        } catch (err) {
            console.error('[RegisterModal] handleSubmit error:dd', err);
            setErrors({ email : 'Došlo je do greške. Pokušajte ponovo.'});
        } finally {
            setLoading(false);
        }
    }
    
    if (!isOpen) return null;
    
    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-modal-title"
        >
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label="Zatvori modal"
                >
                    <X size={20} />
                </button>
                <h2 id="register-modal-title" className="text-2xl font-bold text-gray-900 text-center mb-6">
                    Kreirajte nalog
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                    noValidate
                >
                    {success && (
                        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center">
                            <p className="text-green-700 font-semibold">Nalog kreiran.</p>
                            <p className="text-green-600 text-sm mt-1">Posjetite svoj gmail nalog za verifikaciju.</p>
                        </div>
                    )}
                    <InputField
                        label="Ime i Prezime"
                        type="text"
                        placeholder="Vaše ime i prezime"
                        icon={<User size={18} />}
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setErrors(prev => ({ ...prev, username: undefined }));
                        }}
                        error={errors.username}
                        disabled={loading}
                    />

                    <InputField
                        label="Email Adresa"
                        type="email"
                        placeholder="email@gmail.com"
                        icon={<Mail size={18} />}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors(prev => ({ ...prev, email: undefined }));
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
                        }}
                        error={errors.password}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                                   text-white font-semibold py-3 rounded-2xl transition-colors
                                   mt-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loading ? 'Kreiranje naloga...' : 'Registruj se'}
                    </button>

                    <p className="text-center text-gray-500 text-sm mt-2">
                        Već imate nalog?
                        <button
                            type="button"
                            onClick={handleSwitchToLogin}
                            className="text-blue-600 font-semibold hover:underline pl-1 cursor-pointer"
                        >
                            Prijavite se
                        </button>
                    </p>
                </form>
            </div>
        </div>
    )
}