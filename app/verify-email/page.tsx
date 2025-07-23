// pages/verify-email.tsx or app/verify-email/page.tsx
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    if (token) {
      // Call your verification endpoint
      fetch(`/api/auth/verify-email?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus('success');
            // Redirect to dashboard
            window.location.href = '/dashboard';
          } else {
            setStatus('error');
          }
        })
        .catch(() => setStatus('error'));
    }
  }, [token]);

  return (
    <div>
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && <p>Email verified successfully!</p>}
      {status === 'error' && <p>Verification failed. Please try again.</p>}
    </div>
  );
}