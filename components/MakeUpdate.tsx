"use client"
import React, { useState, useEffect } from 'react'
import DropBack from './DropBack'
import { authClient } from '@/lib/auth-client'
import { Nav } from './Nav'
import { PropertieInput, propertieSchema } from '@/lib/Zod'
import InputBox from './InputBox'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/trpc'

interface MakeUpdatePros {
    id: string | undefined
}
const defaultProperty: PropertieInput = {
    name: "",
    address: "",
    description: "",
    numBedrooms: 0,
    numBathrooms: 0,
    lotSize: 0,
    yearBuilt: new Date().getFullYear(),
    squareFootage: 0,
    hasGarage: false,
    hasGarden: false,
    hasPool: false,
    amenities: [],

    // Optional propertyType, status is optional but default is "active"
    status: "active",
    ownerName: "",
    contactInfo: "",
    typeOfSale: "sell",
    initialInvestment: 0,
    saleDuration: 0,
    margin: 0,
    leaseCycle: 0,
    leaseType: "Month",
    finalResult: 0,
    Leavingstatus: "active",

    imageUrls: [],
    videoTourUrl: "", // or omit if not required
};

export default function MakeUpdate({ id }: MakeUpdatePros) {
    const Session = authClient.useSession()
    const getProperty = useQuery(api().Propertie.getPropertie.queryOptions({ pID: id }))
    const postProperty = useMutation(api().Propertie.postPropertie.mutationOptions())


    const [property, setProperty] = useState<PropertieInput>(defaultProperty)


    useEffect(() => {
        if (getProperty.data) {
            setProperty(propertieSchema.parse(getProperty.data))

        }

        return () => {

        }
    }, [getProperty.data])

    function Handle(identify: string, value: string, Type: "number" | string) {
        setProperty(pre => ({
            ...pre,
            [identify]: Type === "number" ? Number(value) : value
        }))

    }

    return (
        <DropBack is={getProperty.isPending || postProperty.isPending}>
            <div className='relative flex flex-col  min-h-screen  overflow-hidden'>
                <Nav SignOut={authClient.signOut} session={Session.data} />

                <div>

                    {/* General information for the property */}
                    <div className=''>
                        <InputBox
                            disabled={postProperty.isPending}
                            label={"Name"}
                            type="text"
                            identify='name'
                            setValue={(e) => {
                                Handle("name", e.target.value, e.target.type)
                            }}
                            value={property.name}

                        />

                        <InputBox
                            label={"Address"}
                            disabled={postProperty.isPending}
                            type="text"
                            identify='address'
                            setValue={(e) => Handle("address", e.target.value, e.target.type)}
                            value={property.address}
                        />

                        <div  className=' flex flex-row flex-wrap gap-2 '>

                            <InputBox
                                label={"Bedrooms"}
                                disabled={postProperty.isPending}
                                type="number"
                                identify='numBedrooms'
                                setValue={(e) => Handle("numBedrooms", e.target.value, e.target.type)}
                                value={property.numBedrooms.toString()}
                                className='shrink-0 w-[8rem]'

                            />
                            <InputBox
                                label={"Bathrooms"}
                                disabled={postProperty.isPending}
                                type="number"
                                identify='numBathrooms'
                                setValue={(e) => Handle("numBathrooms", e.target.value, e.target.type)}
                                value={property.numBathrooms.toString()}
                                 className='shrink-0 w-[8rem]'
                            />
                            <InputBox
                                label={"Lot Size"}
                                disabled={postProperty.isPending}
                                type="number"
                                identify='lotSize'
                                setValue={(e) => Handle("lotSize", e.target.value, e.target.type)}
                                value={property.lotSize.toString()}
                                 className='shrink-0 w-[8rem]'
                            />
                            <InputBox
                                label={"Year Built"}
                                disabled={postProperty.isPending}
                                type="number"
                                identify='yearBuilt'
                                setValue={(e) => Handle("yearBuilt", e.target.value, e.target.type)}
                                value={property.yearBuilt.toString()}
                                min={1800}
                                 className='shrink-0 w-[8rem]'
                            />
                            <InputBox
                                label={"Square Footage"}
                                disabled={postProperty.isPending}
                                type="number"
                                identify='squareFootage'
                                setValue={(e) => Handle("squareFootage", e.target.value, e.target.type)}
                                value={property.squareFootage.toString()}
                                 className='shrink-0 w-[8rem]'
                            />

                        </div>




                    </div>


                </div>

            </div>
        </DropBack>
    )
}
