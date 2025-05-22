"use client"

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import React from 'react'

export default function Page() {
  const {data} = authClient.useSession()
  return (
    <div className='relative flex flex-col items-center justify-center min-h-screen  overflow-hidden'>
        <h1 className=' text-6xl'>{data ? ` welcome ${data.user.name}` : "no session"}</h1>


        {data && (<Button onClick={()=>{authClient.signOut()}}>
          Logout
        </Button>)}
        
        
    </div>
  )
}
