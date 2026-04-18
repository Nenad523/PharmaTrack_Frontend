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

            const response = await fetch(`/api/v1/auth/verify-email?token=${token}`);

            if (!response.ok){
                setStatus('error');
                return;
            }

            const data = await response.json();
            setStatus('success');
        }
                                         
    }, [token]);

    return (
    <div className="flex items-center justify-center min-h-screen">
      {status === 'loading' && <p>Verifikacija u toku...</p>}
      {status === 'success' && <p>Email uspješno verifikovan! Možete se prijaviti.</p>}
      {status === 'error' && <p>Token nije validan ili je istekao.</p>}
    </div>
  )
}