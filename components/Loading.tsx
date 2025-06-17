import { LoaderCircle } from 'lucide-react'
import React from 'react'

interface LoadingProps {
 text?: string| React.ReactNode; 
}

export default function Loading({text}: LoadingProps) {
  return (
    <div className='flex flex-row flex-1 w-full h-full items-center justify-center'>


        <LoaderCircle size={60} className=' animate-spin text-5xl text-purple-900/55   dark:text-purple-300/55  l'/>
        { text && <p className='text-2xl text-purple-900/55 dark:text-purple-300/55'>{text}</p>}
    </div>
  )
}
