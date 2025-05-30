"use client"

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import axios from "axios"
import { authClient } from '@/lib/auth-client'
import { Nav } from '../Nav'
import PropertySearchNav from './PropertySearchNav'
import DropBack from '../DropBack'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import { api } from '@/lib/trpc'
import PropertyCard from './propertyCard'
import Link from 'next/link'
const zSearch = z.object({
    status: z.string().min(4, "").optional(),
    searchText: z.string().min(2).optional(),


})

export default function PropertyFilterView({ data }: { data: { [key: string]: string | string[] | undefined; } }) {
    const router = useRouter();

    const { data: session, isPending, error } = authClient.useSession();
    console.log({ session, isPending, error, data });



    const getProperties = useQuery(api().Propertie.getUserProperties.queryOptions())



    function NavSearch(s: { status: string, searchText: string }) {
        const vSearch = zSearch.safeParse(s);
        if (!vSearch.success) {
            vSearch.error.errors.forEach(error => {
                toast.warning(`${error.path[0]}: ${error.message}`)
            })
            return
        }
        router.push(`/home?status=${s.status}&searchText=${s.searchText}`, {

        })



    }
    return (
        <DropBack is={isPending || getProperties.isPending}>
            <div className=' flex-1 flex flex-col gap-2.5'>
                <Nav session={session} SignOut={authClient.signOut} />

                <PropertySearchNav onSubmit={NavSearch} />

                {/* list  of card  */}
                <div className=' flex flex-row p-2.5 shrink-0 gap-2.5'>
                    {getProperties.data && getProperties.data.map((item , i)=>{
                        return(<Link href={`/property/${item.id}`}><PropertyCard data={item}/></Link>)
                    })}

                </div>

            </div>
        </DropBack>
    )
}
