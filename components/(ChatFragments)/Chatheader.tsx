import React from 'react'


interface ChatheaderProps { 
    Back:()=>void;
    title: string;
    mebers: string[];   // Define any props you need for the ChatHeader component
}
export default function Chatheader({ Back, title, mebers }: ChatheaderProps) {
  return (
    <div className='flex items-center h-56 justify-between p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
        <div>
            <button onClick={Back} className="text-gray-500 hover:text-gray-700">
                {/* Back icon or text */}
                Back
            </button>
        </div>

        <div className=' flex flex-col items-center gap-1'>
            <h1 className="text-lg font-semibold">{title}</h1>
            <p className="text-sm text-gray-500">Members: {mebers.join(', ')}</p>
        </div>
        
    </div>
  )
}
