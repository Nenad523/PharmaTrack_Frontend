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
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('error');
            }
        }
        
        verify();
                                         
    }, [token]);

    return (
    <div className="flex items-center justify-center min-h-screen text-black">
      <div className="text-center">
        {status === 'loading' && <p>Verifikacija u toku...</p>}
        {status === 'success' && <p>Email uspješno verifikovan! Možete se prijaviti.</p>}
        {status === 'error' && (
          <>
            <p>Token nije validan ili je istekao.</p>
            <p className="text-xs text-gray-500 mt-2">Token: {token}</p>
          </>
        )}
      </div>
    </div>
  )
}