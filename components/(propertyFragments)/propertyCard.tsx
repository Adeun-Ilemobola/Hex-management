import Image from 'next/image'
import React from 'react'
import { Badge } from '../ui/badge'
import Link from 'next/link'

interface PropertyCardProp {
    data: {
        img?: string,
        name: string,
        address: string,
        status: string,
        saleStatus: string,
        id:string
    },
    mode?: boolean


}

export default function PropertyCard({ data  , mode}: PropertyCardProp) {
    const { img, name, address, saleStatus, status } = data
    return (
    <Linker id={data.id} mode={mode === undefined ? true : mode}>
        <div className=' relative flex flex-col gap-0.5 w-[18rem] h-[23rem]  border border-transparent   rounded-lg transition-all duration-500  hover:border-fuchsia-400/20  hover:shadow-lg  '>
            <Badge className=' absolute top-0 right-0 z-10'>{status}</Badge>
            <div className={`flex ${img && " items-center justify-center"} rounded-lg overflow-hidden w-full flex-1 bg-amber-600/30`}>

                {img ?
                    <Image alt='sdsdsd' src={img} className=' w-full h-full object-cover' height={500} width={500} />
                    :
                    (<>
                    
                    </>)

                }


            </div>
            <div className=' p-0.5'>
                <h1 className=' text-2xl font-bold'>{name}</h1>
                <h2 className=' text-base text-gray-600'>{address}</h2>
                <Badge className=' ml-auto'>{saleStatus}</Badge>

            </div>

        </div>
    </Linker>
    )
}



function Linker({ children, id , mode }: { children: React.ReactNode, mode: boolean, id: string }) {
    if (mode) {
        return (
            <Link href={`/property/${id}`} >
                {children}
            </Link>
        )
    }
    return ( <>{children}</>)
    
}
