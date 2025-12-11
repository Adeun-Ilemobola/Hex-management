
import React from 'react'
import Loading from './Loading'

interface DropBackProps {
    is: boolean;
    children: React.ReactNode;
    isTextMessage?:{
        data: string |React.ReactNode;
        show?: boolean;
    };

}

export default function DropBack({ is, children , isTextMessage }: DropBackProps) {

    if (is || isTextMessage?.show) {
        return (<Loading text={isTextMessage?.data} full /> )
    }
    return (
        <>
            {children}
        </>
    )
}
