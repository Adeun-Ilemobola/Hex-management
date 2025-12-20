'use client'
import PropertyListing from "@/components/Property/PropertyListing"



export default async function Page({ params, }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    //get the propertie id from params
    return (
     

           <PropertyListing id={id} />  


    )
}