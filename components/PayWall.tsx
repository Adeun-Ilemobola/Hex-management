
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
interface Props {
    children: React.ReactNode,
    allowed: boolean
}
export default function PayWall({ children, allowed }: Props) {

    if (!allowed) {
        return <div className='relative'>
            <div className="absolute inset-0 h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-600/90 to-purple-800/75 dark:from-purple-900/20 dark:to-purple-900/20 backdrop-blur-md">

                <Link href={'/home/subscription'}>
                    <Button variant={"outline"}>
                        Subscribe to Unlock
                    </Button>
                </Link>

            </div>
            {children}
        </div>
    }
    return (
        <>
            {children}
        </>
    )

}
