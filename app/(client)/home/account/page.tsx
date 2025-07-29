// app/(client)/home/account/page.tsx
import { Suspense } from 'react';
import AccountResultPage from '@/components/AccountResultPage';
import Loading from '@/components/Loading';

export default function Page() {
  return (
    <Suspense fallback={<Loading full />}>
      <AccountResultPage />
    </Suspense>
  );
}
