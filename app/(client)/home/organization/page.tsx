import OrganizationDashbord from '@/components/(organizationFragments)/organizationDashbord'
import Loading from '@/components/Loading'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div className='relative flex flex-col min-h-screen overflow-hidden'>

      <Suspense fallback={<Loading full />}><OrganizationDashbord/></Suspense>

    </div>
  )
}
