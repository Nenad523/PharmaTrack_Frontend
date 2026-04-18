'use client'

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function VerifyEmail(){
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'error' | 'success'> ('loading');

    useEffect(() => {

        const verify = async () => {
                
            if (!token){
                setStatus('error');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3001/api/v1/auth/verify-email?token=${token}`);

                if (!response.ok){
                    const text = await response.text();
                    console.log('Verification failed - Status:', response.status, 'Response:', text);
                    setStatus('error');
                    return;
                }

                await response.json();
                setStatus('success');
                setTimeout(() => {
                    window.close();
                    // fallback if window.close() is blocked
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 500);
                }, 3000);
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('error');
            }
        }
        
        verify();
                                         
    }, [token]);

   return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">

        {status === 'loading' && (
          <>
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800">
              Verifikacija u toku...
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Molimo sačekajte nekoliko sekundi
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-4xl mb-3">✓</div>
            <h2 className="text-xl font-semibold text-gray-800">
              Email verifikovan!
            </h2>
            <p className="text-gray-600 mt-2">
              Sada se možete prijaviti na svoj nalog.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Bićete preusmjereni na početnu stranicu za nekoliko sekundi...
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Ukoliko se to ne desi,{' '}
              <button
                onClick={() => window.close()}
                className="underline hover:text-gray-600 transition-colors"
              >
                zatvorite ovaj prozor
              </button>
              .
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-4xl mb-3">✕</div>
            <h2 className="text-xl font-semibold text-gray-800">
              Verifikacija nije uspjela
            </h2>
            <p className="text-gray-600 mt-2">
              Link nije validan ili je istekao.
            </p>

            <button
              className="mt-6 bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-lg transition"
              onClick={() => window.location.href = '/'}
            >
              Nazad na početnu
            </button>
          </>
        )}

      </div>
    </div>
  )
}