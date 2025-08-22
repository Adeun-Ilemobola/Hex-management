import React from 'react'
import clsx from 'clsx';

export default function ScrollBox({children , className , ref}:{children:React.ReactNode , className?:string , ref?:React.RefObject<HTMLDivElement>}) {
  return (
    <div
    ref={ref}
    className={clsx("flex flex-col gap-2 h-full overflow-y-scroll overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ", className)}
    >
         {children}
    </div>
  )
}
