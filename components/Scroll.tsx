import React from 'react'
import clsx from 'clsx';

export default function ScrollBox({children , className , ref}:{children:React.ReactNode , className?:string , ref?:React.RefObject<HTMLDivElement>}) {
  return (
    <div
    ref={ref}
    className={clsx(
          "flex-1 basis-0 min-h-0 min-w-0",  
          "overflow-y-auto overflow-x-hidden overscroll-contain",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          "flex flex-col gap-0.5",
      className)}
    >
         {children}
    </div>
  )
}
