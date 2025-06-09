"use client"
import React, { useState, useEffect, useMemo } from 'react'
import DropBack from './DropBack'
import { authClient } from '@/lib/auth-client'
import { Nav } from './Nav'
import { PropertieInput, propertieSchema } from '@/lib/Zod'
import InputBox, { SwitchBox } from './InputBox'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/trpc'
import { toast } from 'sonner'
import ImgBox from './ImgBox'

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

    function Handle(identify: string, value: string, Type?: "number" | string) {

        setProperty(pre => ({
            ...pre,
            [identify]: Type === "number" ? Number(value) : value
        }))

    }
    function HandleSel(identify: string, value: string) {
        setProperty(pre => ({
            ...pre,
            [identify]: value
        }))
    }

    const finSel = useMemo(() => {
        if (property.typeOfSale === "sell" && property.margin > 0 && property.initialInvestment > 100) {


        }

        switch (property.typeOfSale) {
            case "sell": {
                if (property.margin > 0 && property.initialInvestment > 100) {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: pre.initialInvestment + (pre.initialInvestment * pre.margin / 100)
                    }))
                }
                break;
            }
            // Mp =  initialInvestment / 12
            // M =  mp + (mp * margin / 100)


            // get the initial investment back time line 
            //  investment back time line = initialInvestment / M

            case "rent": {
                const mp = property.initialInvestment / 12
                const M = mp + (mp * property.margin / 100)
                if (mp > 0 && M > 0) {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: M,
                        saleDuration: Math.ceil(pre.initialInvestment / M)
                    }))
                } else {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: 0,
                        saleDuration: 0
                    }))
                    toast.error("Please make sure the initial investment and margin are set correctly.")
                }

                break;
            }

            case "lease": {
                const mp = property.initialInvestment / property.leaseCycle
                const M = mp + (mp * property.margin / 100)
                if (mp > 0 && M > 0) {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: M,
                        saleDuration: Math.ceil(pre.initialInvestment / M)
                    }))
                } else {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: 0,
                        leaseCycle: 0
                    }))
                    toast.error("Please make sure the initial investment and margin are set correctly.")
                }
                break;
            }


            default:
                setProperty(pre => ({
                    ...pre,
                    finalResult: 0,
                    saleDuration: 0
                }))
                toast.error("Please select a valid type of sale.")
                break;
        }


    }, [property.typeOfSale, property.margin, property.initialInvestment])

    function HandleBool(identify: string, value: boolean) {
        setProperty(pre => ({
            ...pre,
            [identify]: value
        }))

    }

    return (
        <DropBack is={getProperty.isPending || postProperty.isPending}>
            <div className='relative flex flex-col  min-h-screen  overflow-hidden'>
                <Nav SignOut={authClient.signOut} session={Session.data} />

                <div>

                    {/* General information for the property */}
                    <div className=' w-[23rem] p-4 flex flex-col gap-2 '>
                        <h1 className='text-2xl font-bold'>Property Information</h1>
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

                        <div className=' fle8x flex-row flex-wrap gap-2 '>

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

                        <div className=' flex flex-row gap-2 items-center'>

                            <SwitchBox
                                className=''
                                value={property.hasPool}
                                setValue={(e) => HandleBool("hasPool", e)}
                                label={"Pool"}
                            />

                            <SwitchBox
                                className=''
                                value={property.hasGarden}
                                setValue={(e) => HandleBool("hasGarden", e)}
                                label={"Garden"}
                            />


                            <SwitchBox
                                className=''
                                value={property.hasGarage}
                                setValue={(e) => HandleBool("hasGarage", e)}
                                label={"Garage"}
                            />


                        </div>







                    </div>

                    <ImgBox
                        fileList={property.imageUrls}
                        disabled={postProperty.isPending}
                        setData={(list)=>{
                            setProperty(pre => ({
                                ...pre,
                                imageUrls: list
                            }))
                        }}
                        SetMainImg={(index: number) => {
                            setProperty(pre => ({
                                ...pre,
                                imageUrls: pre.imageUrls.map((img, i) => ({
                                    ...img,
                                    Thumbnail: i === index
                                }))
                            }))
                        }}
                    />

                    <div>

                    </div>


                </div>

            </div>
        </DropBack>
    )
}
