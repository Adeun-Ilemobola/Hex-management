import { LoaderCircle } from 'lucide-react'
import React from 'react'

export default function Loading() {
  return (
    <div className='flex flex-1 w-full h-full items-center justify-center'>


        <LoaderCircle size={60} className=' animate-spin text-5xl text-purple-900/55   dark:text-purple-300/55  l'/>
        
    </div>
  )
}
