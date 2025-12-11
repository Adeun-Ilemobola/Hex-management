import Loading from '@/components/Loading';
import { Suspense } from 'react';
import VerifyExternalInvestorView from '@/components/verifyExternalInvestorView'; 

export default function Page() {
    return (

        <Suspense fallback={<Loading full />}>
            <VerifyExternalInvestorView />

        </Suspense>

    );
}