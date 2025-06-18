"use client"
import React, { useState, useEffect, useMemo } from 'react'
import DropBack from './DropBack'
import { authClient } from '@/lib/auth-client'
import { Nav } from './Nav'
import { PropertieInput, propertieSchema } from '@/lib/Zod'
import InputBox, { NumberBox, SelectorBox, SwitchBox } from './InputBox'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/trpc'
import { toast } from 'sonner'
import ImgBox from './ImgBox'
import { Button } from './ui/button'
import { set } from 'date-fns'
import { log } from 'console'

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
    status: "pending",
    ownerName: "",
    contactInfo: "",
    typeOfSale: "sell",
    initialInvestment: 0,
    saleDuration: 0,
    margin: 0,
    leaseCycle: 0,
    leaseType: "Month",
    finalResult: 0,
    Leavingstatus: "Developing",
    propertyType: "House", // Default value, can be changed

    imageUrls: [],
    videoTourUrl: "", // or omit if not required
};

const propertyTypeOP = [{ value: "House", label: "House" },
{ value: "Apartment", label: "Apartment" },
{ value: "Condo", label: "Condo" },
{ value: "Commercial", label: "Commercial" },
{ value: "Other", label: "Other" },
{ value: "None", label: "None" }
]
const LeavingstatusOP = [
    { value: "active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Renovation", label: "Renovation" },
    { value: "Developing", label: "Developing" },
    { value: "Purchase Planning", label: "Purchase Planning" },
    { value: "None", label: "None" }
]


const statusOP = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "sold", label: "Sold" },
    { value: "None", label: "None" }
]

const typeOfSaleOP = [
    { value: "sell", label: "Sell" },
    { value: "rent", label: "Rent" },
    { value: "lease", label: "Lease" },
    { value: "None", label: "None" }
]
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

    const FinalCalculation  =() => {
        console.log("Final Calculation triggered with typeOfSale:", property.typeOfSale, "and margin:", property.margin);
        

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

                const basePerCycle = property.initialInvestment / property.leaseCycle;
                const paymentPerCycle = basePerCycle + (basePerCycle * property.margin / 100);
                const saleDuration = Math.ceil(property.initialInvestment / paymentPerCycle);

                if (basePerCycle > 0 && paymentPerCycle > 0) {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: paymentPerCycle,
                        saleDuration: saleDuration,
                    }))
                } else {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: 0,
                        leaseCycle: 0
                    }))
                    toast.warning("Please make sure the initial investment and margin lease Cycle   are set correctly.")
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


    }



    function HandleBool(identify: string, value: boolean) {
        setProperty(pre => ({
            ...pre,
            [identify]: value
        }))

    }

    function typeOfSaleMode() {
    

        if (property.typeOfSale === "sell") {
            return (
                <div className='r'>
                    <p className='text-lg font-semibold'>
                        <span className='text-gray-500'>
                            <span className='text-green-500'>Selling Price:</span> {property.finalResult.toLocaleString("en-US", { style: "currency", currency: "USD" })}. 
                             Initial investment of {property.initialInvestment.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                            {property.margin > 0 ? ` with a margin of ${property.margin}%` : ""}  
                              is expected to yield a profit of <span className=' text-indigo-500'>{(property.initialInvestment - property.finalResult).toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>


                        </span>

                    </p>

                </div>
            )
        }
        if (property.typeOfSale === "rent") {
            const monthlyPayment = property.finalResult.toLocaleString("en-US", { style: "currency", currency: "USD" })
            const investmentBackTimeLine = property.saleDuration > 0 ? property.saleDuration : 0;
            return (
                <div>
                    <p className='text-lg font-semibold'>
                        <span className='text-green-500'>Monthly Rent:</span> {monthlyPayment}
                        <span className='text-gray-500'>
                            Initial investment of {property.initialInvestment.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                            with a margin of {property.margin}% is expected to yield a profit of <span className=' text-indigo-500'>{((property.finalResult * 12) - property.initialInvestment).toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
                            over an estimated period of {investmentBackTimeLine} months.
                        </span>
                    </p>
                </div>
            )
        }
        if (property.typeOfSale === "lease") {
            const leaseRevenuePerCycle = property.finalResult.toLocaleString("en-US", { style: "currency", currency: "USD" });
            const leaseCycle = property.leaseCycle;
            const leaseCyclesToRecover = property.saleDuration > 0 ? property.saleDuration : 0;
            const totalMonthsToRecover = leaseCyclesToRecover * leaseCycle;

            return (
                <div>
                    <p className='text-lg font-semibold'>
                        <span className='text-green-500'>Lease Payment Every {leaseCycle} Month(s):</span> {leaseRevenuePerCycle}
                        <span className='text-gray-500'>
                            Initial investment of {property.initialInvestment.toLocaleString("en-US", { style: "currency", currency: "USD" })},
                            with a margin of {property.margin}%, is expected to be recovered after
                            <span className='text-indigo-500'> {leaseCyclesToRecover} lease cycle(s)</span>
                            (approximately <span className='text-indigo-500'>{totalMonthsToRecover} month(s)</span>).
                        </span>
                    </p>
                </div>
            );

        }
        return null;


    }


    // Function to handle the submission of the property data
    async function handleSubmit() {
        setProperty(pre => ({
            ...pre,
            ownerName: Session.data?.user?.name || "",
            contactInfo: Session.data?.user?.email || ""

        }))
        try {
            const validatedProperty = await propertieSchema.safeParseAsync(property);
            if (!validatedProperty.success) {
                validatedProperty.error.errors.forEach(err => {
                    toast.error(`Error in ${err.path.join(".")}: ${err.message}`);
                }
                );
                return;
            }
            await postProperty.mutateAsync({ pID: id, data: validatedProperty.data });
            toast.success("Property updated successfully!");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    }





    return (
        <DropBack is={(getProperty.isPending || postProperty.isPending)}>
            <div className='relative flex-1 flex flex-col  min-h-screen  overflow-hidden'>
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

                        <div className=' flex flex-row flex-wrap gap-2 '>

                            <NumberBox
                                label={"Bedrooms"}
                                disabled={postProperty.isPending}

                                setValue={(e) => Handle("numBedrooms", e.toString(), "number")}
                                value={property.numBedrooms}
                                className='shrink-0 w-[10rem]'

                            />
                            <NumberBox
                                label={"Bathrooms"}
                                disabled={postProperty.isPending}

                                setValue={(e) => Handle("numBathrooms", e.toString(), "number")}
                                value={property.numBathrooms}
                                className='shrink-0 w-[10rem]'
                            />
                            <NumberBox
                                label={"Lot Size"}
                                disabled={postProperty.isPending}
                                setValue={(e) => Handle("lotSize", e.toString(), "number")}
                                value={property.lotSize}
                                className='shrink-0 w-[10rem]'
                                min={2}

                            />
                            <NumberBox
                                label={"Year Built"}
                                disabled={postProperty.isPending}
                                setValue={(e) => Handle("yearBuilt", e.toString(), "number")}
                                value={property.yearBuilt}
                                min={1800}
                                max={new Date().getFullYear()}
                                step={1}

                                className='shrink-0 w-[10rem]'
                            />

                            <NumberBox
                                label={"Square Footage"}
                                disabled={postProperty.isPending}
                                max={50000}
                                min={2}
                                step={1}
                                value={property.squareFootage}
                                setValue={(e) => Handle("squareFootage", e.toString(), "number")}
                                className='shrink-0 w-[10rem]'

                            />

                            <SelectorBox
                                options={propertyTypeOP}
                                label={"Property Type"}
                                identify='propertyType'
                                setValue={(e) => HandleSel("propertyType", e)}
                                value={property.propertyType}
                                isDisable={postProperty.isPending}
                                ClassName='shrink-0 w-[9rem]'

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
                        <SelectorBox
                            options={LeavingstatusOP}
                            label={"Leaving Status"}
                            identify='Leavingstatus'
                            setValue={(e) => HandleSel("Leavingstatus", e)}
                            value={property.Leavingstatus}
                            isDisable={postProperty.isPending}
                            ClassName='shrink-0 w-[9rem]'
                        />
                        <SelectorBox
                            options={statusOP}
                            label={"Status"}
                            identify='status'
                            setValue={(e) => HandleSel("status", e)}
                            value={property.status}
                            isDisable={postProperty.isPending}
                            ClassName='shrink-0 w-[9rem]'
                        />







                    </div>

                    <ImgBox
                        fileList={property.imageUrls}
                        Class=' w-[30rem] '
                        disabled={postProperty.isPending}
                        setData={(list) => {
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

                    <div className=' w-[30rem] p-4 flex flex-col gap-2 '>
                        <Button className=' ml-auto w-32' onClick={() => FinalCalculation}> Recalculate</Button>
                        <div className=' flex flex-row gap-2 items-center'>
                            <InputBox
                                disabled={postProperty.isPending}
                                label={"initial Investment"}
                                type="number"
                                identify='initialInvestment'
                                setValue={(e) => {
                                    Handle("initialInvestment", e.target.value, e.target.type);
                                    FinalCalculation(); // Recalculate when initial investment changes
                                }}
                                value={property.initialInvestment.toString()}
                                className='shrink-0 w-[10rem]'

                            />
                            <NumberBox
                                label={"Margin (%)"}
                                disabled={postProperty.isPending}
                                setValue={(e) => {
                                    Handle("margin", e.toString(), "number");
                                    FinalCalculation(); // Recalculate when margin changes
                                }}
                                value={property.margin}
                                className='shrink-0 w-[8rem]'

                            />
                            {property.typeOfSale === "lease" && (
                                <NumberBox
                                    label={"Lease Cycle (Months)"}
                                    disabled={postProperty.isPending}
                                    setValue={(e) => Handle("leaseCycle", e.toString(), "number")}
                                    value={property.leaseCycle}
                                    className='shrink-0 w-[10rem]'
                                />
                            )}





                            <SelectorBox
                                options={typeOfSaleOP}
                                label={"Type of Sale"}
                                identify='typeOfSale'
                                setValue={(e) => {
                                    HandleSel("typeOfSale", e);
                                    FinalCalculation(); // Recalculate when type of sale changes
                                }}
                                value={property.typeOfSale}
                                isDisable={postProperty.isPending}
                                ClassName='shrink-0 w-[9rem]'
                                defaultValue='sell'
                            />
                        </div>

                        <div className=' flex flex-col gap-2'>
                            {typeOfSaleMode()}
                        </div>








                    </div>


                </div>
                <Button onClick={handleSubmit} disabled={postProperty.isPending} className=' w-[30rem] ml-auto mb-4'>
                    <div className=' flex flex-row gap-2 items-center'>

                        <span>Update or make Property</span>
                        {postProperty.isPending && <span className='animate-spin'>🔄</span>}
                    </div>
                </Button>

            </div>
        </DropBack>
    )
}
