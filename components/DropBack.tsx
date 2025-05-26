
import React from 'react'
import Loading from './Loading'

export default function DropBack({ is, children }: { is: boolean, children: React.ReactNode }) {

    if (is) {
        return (<Loading /> )

    }
    return (
        <>
            {children}
        </>
    )
}
