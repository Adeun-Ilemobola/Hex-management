'use client'

import React, { useState } from 'react'
import { authClient } from '@/lib/auth-client'

import PropertySearchNav from './PropertySearchNav'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import PropertyCard from './PropertyCard'
import { trpc as api } from '@/lib/client'
import { CleanProperty, SaleTypeEnum, StatusEnum } from '@/lib/ZodObject'

const zSearch = z.object({
    status: z.string().min(4).nullable(),
    searchText: z.string().min(2).nullable()
})


export default function PropertyFilterView({ data }: { data: { [key: string]: string | string[] | undefined; } }) {
    const { isPending: subscriptionLoading } = api.user.getUserPlan.useQuery();
    const { data: getProperties, isPending: getPropertiesPending } = api.Propertie.getUserProperties.useQuery({ data: data }, {
        enabled: !!data,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 2
    })
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const { isPending: planLoading } = api.user.getUserPlan.useQuery();
    const [isEdit, setIsEdit] = useState(false)

    function NavSearch(urlData: { status: string | null, searchText: string | null }) {
        const vSearch = zSearch.safeParse(urlData);
        if (!vSearch.success) {
            vSearch.error.issues.forEach(error => {
                toast.warning(`${error.path}: ${error.message}`)
            })
        }
        router.push(`/home?${urlData.status ? `status=${urlData.status} ` : ""}${urlData.searchText ? `&searchText=${urlData.searchText}` : ""}`)

    }
    return (
        <>
            <div className=' flex-1 flex flex-col gap-2.5'>

                <PropertySearchNav
                    onSubmit={NavSearch}
                    changeMode={(mode) => setIsEdit(mode)}
                    mode={isEdit}
                />


                <div className=' flex-1 flex flex-row flex-wrap justify-center p-2.5 shrink-0 gap-2.5'>
                    {getProperties?.data && (getProperties.data as CleanProperty[]).map((item, i) => {
                        return (<PropertyCard mode={isEdit} key={i} data={{
                            id: item.id,
                            img: item.img,
                            name: item.name,
                            address: item.address,
                            status: item.status as z.infer<typeof StatusEnum>,
                            saleStatus: item.saleStatus as z.infer<typeof SaleTypeEnum> 
                        }} />)
                    })}

                </div>


            </div>

        </>
    )
}
