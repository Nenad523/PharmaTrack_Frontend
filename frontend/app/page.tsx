'use client';

import { useState } from 'react';
import LoginModal from './_components/modals/LoginModal';
import RegisterModal from './_components/modals/RegisterModal';

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-4xl font-bold text-gray-900">PharmaTrack</h1>
      <p className="text-gray-600 text-lg">Pronađite ljekove brzo i lako</p>

      <div className="flex gap-4">
        <button
          onClick={() => setLoginOpen(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Prijava
        </button>
        <button
          onClick={() => setRegisterOpen(true)}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
        >
          Registracija
        </button>
      </div>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </div>
  );
}