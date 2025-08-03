'use client'

import React , {useState} from 'react'
import { authClient } from '@/lib/auth-client'
import { Nav } from '../Nav'
import PropertySearchNav from './PropertySearchNav'
import DropBack from '../DropBack'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import { api } from '@/lib/trpc'
import PropertyCard from './propertyCard'
const zSearch = z.object({
    status: z.string().min(4).nullable(),
    searchText: z.string().min(2).nullable(),


})
export interface CleanProperty {
  id: string;
  img?: string;
  name: string;
  address: string;
  status: string;
  saleStatus: string;
}

export default function PropertyFilterView({ data }: { data: { [key: string]: string | string[] | undefined; } }) {
    
    const router = useRouter();

    const { data: session, isPending, error } = authClient.useSession();
    console.log({ session, isPending, error, data });

    const {data:getProperties , isPending:getPropertiesPending} = api.Propertie.getUserProperties.useQuery({data: data })
     const [isEdit, setIsEdit] = useState(false)

    function NavSearch(urlData: { status: string | null, searchText: string | null }) {
        const vSearch = zSearch.safeParse(urlData);
        if (!vSearch.success) {
            vSearch.error.errors.forEach(error => {
                toast.warning(`${error.path[0]}: ${error.message}`)
            })
            
        }
        router.push(`/home?${urlData.status ? `status=${urlData.status} ` : ""}${urlData.searchText ? `&searchText=${urlData.searchText}` : ""}`)



    }
    return (
        <DropBack 
        is={isPending || getPropertiesPending}
        isTextMessage={{data:"" }}
        >
            <div className=' flex-1 flex flex-col gap-2.5'>
                <Nav session={session} SignOut={authClient.signOut} />

                <PropertySearchNav 
                onSubmit={NavSearch} 
                changeMode={(mode) => setIsEdit(mode)}
                mode={isEdit}
                />

                {/* list  of card  */}
                <div className=' flex-1 flex flex-row flex-wrap justify-center p-2.5 shrink-0 gap-2.5'>
                    {getProperties?.data && (getProperties.data as CleanProperty[]).map((item , i)=>{
                        return(<PropertyCard mode={isEdit} key={i} data={{
                            id: item.id,
                            img: item.img,
                            name: item.name,
                            address: item.address,
                            status: item.status,
                            saleStatus: item.saleStatus
                        }}/>)
                    })}

                </div>

            </div>
        </DropBack>
    )
}
