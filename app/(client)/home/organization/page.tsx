import OrganizationDashboard from '@/components/(organizationFragments)/OrganizationDashboard'
import Loading from '@/components/Loading'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div className='relative flex flex-col min-h-screen p-9  overflow-hidden'>

      <Suspense fallback={<Loading full />}><OrganizationDashboard/></Suspense>

    </div>
  )
}
