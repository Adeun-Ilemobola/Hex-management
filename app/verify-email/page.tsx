// app/(client)/home/account/page.tsx
import Loading from '@/components/Loading';
import VerifyEmail from '@/components/VerifyEmail';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<Loading full />}>
      <VerifyEmail />
    </Suspense>
  );
}
