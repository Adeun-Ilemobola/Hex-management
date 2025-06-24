"use client"
import React, { useState, useEffect, useMemo } from 'react'
import DropBack from './DropBack'
import { authClient } from '@/lib/auth-client'
import { Nav } from './Nav'
import { PropertieInput, propertieSchema } from '@/lib/Zod'
import InputBox, { NumberBox, SelectorBox, SwitchBox } from './InputBox'
import { Card, CardContent } from "@/components/ui/card";
import { api } from '@/lib/trpc'
import { toast } from 'sonner'
import ImgBox from './ImgBox'
import { Button } from './ui/button'
import { DeleteImages, UploadImageList } from '@/lib/supabase'


import { FileUploadResult } from '@/lib/utils'
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
    margin: 1,
    leaseCycle: 0,
    leaseType: "Month",
    finalResult: 0,
    leavingstatus: "Developing",
    propertyType: "House", // Default value, can be changed
    discountPercentage: 0, // Default value for discount percentage

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
    const getProperty = api.Propertie.getPropertie.useQuery({ pID: id })
    const postProperty = api.Propertie.postPropertie.useMutation({

    })
    const testMutation = api.testM.useMutation({
        onSuccess: (data) => {
            console.log("Test mutation success:", data);
            toast.success(data.message);
        },
        onError: (error) => {
            console.error("Test mutation error:", error);
            toast.error(error.message);
        }
    })




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

    const FinalCalculation = () => {


        switch (property.typeOfSale) {
            case "sell": {

                if (property.margin > 0 && property.initialInvestment > 100) {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: (pre.initialInvestment + (pre.initialInvestment * pre.margin / 100)) - (pre.initialInvestment * pre.discountPercentage / 100),
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
            // Mp =  initialInvestment / 12
            // M =  mp + (mp * margin / 100)


            // get the initial investment back time line 
            //  investment back time line = initialInvestment / M

            case "rent": {
                const MonthlyPaymentBase = property.initialInvestment / 12
                const MonthlyPayment = MonthlyPaymentBase + (MonthlyPaymentBase * (property.margin / 100))
                const discount = (MonthlyPayment * (property.discountPercentage / 100));
                if (MonthlyPaymentBase > 0 && MonthlyPayment > 0) {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: MonthlyPayment - discount,
                        saleDuration: Math.ceil(pre.initialInvestment / (MonthlyPayment - discount))
                    }))
                } else {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: 0,
                        saleDuration: 0
                    }))
                    toast.warning("Please make sure the initial investment and margin are set correctly.")
                }

                break;
            }

            case "lease": {

                const basePerCycle = property.initialInvestment / property.leaseCycle;
                const paymentPerCycle = basePerCycle + (basePerCycle * property.margin / 100);
                const discount = (paymentPerCycle * (property.discountPercentage / 100));
                const saleDuration = Math.ceil(property.initialInvestment / (paymentPerCycle - discount));

                if (basePerCycle > 0 && paymentPerCycle > 0) {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: paymentPerCycle - discount,
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
        const currency = (val: number) =>
            val.toLocaleString("en-US", { style: "currency", currency: "USD" });

        if (property.typeOfSale === "sell") {
            const profit = property.finalResult - property.initialInvestment;
            const discount = (property.finalResult * (property.discountPercentage / 100));
            return (
                <Card className="border-green-200 bg-green-50/70 dark:border-green-500/30 dark:bg-green-900/50 mb-2 shadow-none">
                    <CardContent className="py-4 px-5 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🏷️</span>
                            <span className="font-bold text-green-700 dark:text-green-300">Selling Price</span>
                            <span className="ml-auto text-lg font-bold">{currency(property.finalResult)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>💸 Initial Investment:</span>
                            <span className="font-medium text-foreground">{currency(property.initialInvestment)}</span>
                            {property.margin > 0 && (
                                <>
                                    <span>➕ Margin:</span>
                                    <span className="font-medium text-yellow-600 dark:text-yellow-300">{property.margin}%</span>
                                    <span>➖ Discount:</span>
                                    <span className="font-medium text-red-600 dark:text-red-300">{property.discountPercentage}%</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-base text-indigo-700 dark:text-indigo-300 font-medium">
                            <span>📈 Expected Profit:</span>
                            <span>{currency(profit)}</span>

                        </div>
                    </CardContent>
                </Card>
            );
        }

        if (property.typeOfSale === "rent") {
            const monthly = property.finalResult;
            const yearlyProfit = monthly * 12 - property.initialInvestment;
            const timeline = property.saleDuration > 0 ? property.saleDuration : 0;
            const discount = (monthly * (property.discountPercentage / 100));

            return (
                <Card className="border-blue-200 bg-blue-50/70 dark:border-blue-500/30 dark:bg-blue-900/50 mb-2 shadow-none">
                    <CardContent className="py-4 px-5 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🏠</span>
                            <span className="font-semibold text-blue-700 dark:text-blue-300">Monthly Rent</span>
                            <span className="ml-auto text-lg font-bold">{currency(monthly)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>💸 Initial Investment:</span>
                            <span className="font-medium text-foreground">{currency(property.initialInvestment)}</span>
                            <span>➕ Margin:</span>
                            <span className="font-medium text-yellow-600 dark:text-yellow-300">{property.margin}%</span>
                            <span>➖ Discount:</span>
                            <span className="font-medium text-red-600 dark:text-red-300">{property.discountPercentage}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-base text-indigo-700 dark:text-indigo-300 font-medium">
                            <span>📈 Expected Annual Profit:</span>
                            <span>{currency(yearlyProfit)}</span>

                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>⏳ Estimated recovery time:</span>
                            <span>{timeline} month(s)</span>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        if (property.typeOfSale === "lease") {
            const leaseCycle = property.leaseCycle;
            const cycles = property.saleDuration > 0 ? property.saleDuration : 0;
            const totalMonths = cycles * leaseCycle;
            const discount = (property.finalResult * (property.discountPercentage / 100));

            return (
                <Card className="border-purple-200 bg-purple-50/70 dark:border-purple-500/30 dark:bg-purple-900/50 mb-2 shadow-none">
                    <CardContent className="py-4 px-5 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📄</span>
                            <span className="font-semibold text-purple-700 dark:text-purple-300">
                                Lease Payment (every {leaseCycle} month{leaseCycle > 1 ? "s" : ""})
                            </span>
                            <span className="ml-auto text-lg font-bold">{currency(property.finalResult)}</span>

                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>💸 Initial Investment:</span>
                            <span className="font-medium text-foreground">{currency(property.initialInvestment)}</span>
                            <span>➕ Margin:</span>
                            <span className="font-medium text-yellow-600 dark:text-yellow-300">{property.margin}%</span>
                            <span>➖ Discount:</span>
                            <span className="font-medium text-red-600 dark:text-red-300">{property.discountPercentage}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-base text-indigo-700 dark:text-indigo-300 font-medium">
                            <span>⏳ Recovery Time:</span>
                            <span>
                                {cycles} cycle{cycles > 1 ? "s" : ""} (~{totalMonths} month{totalMonths > 1 ? "s" : ""})
                            </span>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return null;
    }




    // Function to handle the submission of the property data
    async function handleSubmit() {
        if (Session.data?.user?.id === undefined) {
            toast.error("User session not found. Please log in.");
            return;
        }
        console.log("Submitting property data:", property);
        let uploadedImages: FileUploadResult[] = [];
        try {
            const validatedProperty = await propertieSchema.safeParseAsync({
                ...property,
                ownerName: Session.data?.user?.name,
                contactInfo: Session.data?.user?.email,
            });
            //
            if (!validatedProperty.success) {
                validatedProperty.error.errors.forEach(err => {
                    toast.error(`Error in ${err.path.join(".")}: ${err.message}`);
                }
                );
                return;
            }
            // Prevent duplications uploads
            const imagesToUpload = property.imageUrls.filter(img => !img.supabaseID || img.supabaseID === "");
            uploadedImages = await UploadImageList(imagesToUpload, Session.data?.user?.id)

            console.log("Uploading property:", validatedProperty.data);
            const post = await postProperty.mutateAsync({
                data: {
                    ...validatedProperty.data,
                    imageUrls: [...uploadedImages, ...property.imageUrls.filter(img => img.supabaseID && img.supabaseID !== "")],
                }
            });

            console.log("Post response:", post);
            if (post.success) {
                setProperty(defaultProperty);
                if (getProperty.data) {
                    toast.success("Property updated successfully!");
                }
            } else {
                toast.error("Failed to update property.");
                await DeleteImages(uploadedImages.map(img => img.supabaseID));
            }
        } catch (error) {
            if (uploadedImages.length > 0) {
                await DeleteImages(uploadedImages.map(img => img.supabaseID));
            }
            if (error instanceof Error) {

                console.log("Error in handleSubmit:", error);
                toast.error(error.message);
            } else {
                console.log("Unexpected error:", error);
                toast.error("An unexpected error occurred.");
            }
        }
    }





    return (
        <DropBack is={(getProperty.isPending || postProperty.isPending)} isTextMessage={{ data: "" }} >
            <div className="relative flex flex-col min-h-screen overflow-hidden">
                <Nav SignOut={authClient.signOut} session={Session.data} />
                {/* Property Info */}

                <div className="flex flex-col gap-6 p-2 sm:p-4 flex-1 min-w-full items-center  ">


                    <div className= "flex flex-row gap-4 ">
                        <Card className="ring-1 ring-gray-200 bg-gray-50 dark:ring-gray-700 min-w-xl dark:bg-gray-900 ">
                            <CardContent>
                                <h2 className="text-xl font-bold mb-4">🏠 Property Information</h2>

                                <div className="flex flex-col gap-3 w-full max-w-md">
                                    <InputBox
                                        disabled={postProperty.isPending}
                                        label="Name"
                                        type="text"
                                        identify="name"
                                        setValue={(e) => Handle("name", e.target.value, e.target.type)}
                                        value={property.name}
                                    />

                                    <InputBox
                                        label="Address"
                                        disabled={postProperty.isPending}
                                        type="text"
                                        identify="address"
                                        setValue={(e) => Handle("address", e.target.value, e.target.type)}
                                        value={property.address}
                                    />
                                    
                                </div>

                                <div className=" flex flex-row gap-2 flex-wrap  w-[420px] ">
                                    <NumberBox label="Bedrooms" disabled={postProperty.isPending} value={property.numBedrooms} setValue={(e) => Handle("numBedrooms", e.toString(), "number")} className=" w-40 shrink-0" />
                                    <NumberBox label="Bathrooms" disabled={postProperty.isPending} value={property.numBathrooms} setValue={(e) => Handle("numBathrooms", e.toString(), "number")} className="w-40 shrink-0" />
                                    <NumberBox label="Lot Size" disabled={postProperty.isPending} min={2} value={property.lotSize} setValue={(e) => Handle("lotSize", e.toString(), "number")} className="w-40 shrink-0" />
                                    <NumberBox label="Year Built" disabled={postProperty.isPending} min={1800} max={new Date().getFullYear()} step={1} value={property.yearBuilt} setValue={(e) => Handle("yearBuilt", e.toString(), "number")} className="w-40 shrink-0" />
                                    <NumberBox label="Square Footage" disabled={postProperty.isPending} min={2} max={50000} step={1} value={property.squareFootage} setValue={(e) => Handle("squareFootage", e.toString(), "number")} className="w-40 shrink-0" />
                                    <SelectorBox options={propertyTypeOP} label="Property Type" identify="propertyType" value={property.propertyType} setValue={(e) => HandleSel("propertyType", e)} isDisable={postProperty.isPending} ClassName="w-40 shrink-0" />
                                </div>

                                <div className="flex gap-4 mt-4">
                                    <SwitchBox value={property.hasPool} setValue={(e) => HandleBool("hasPool", e)} label="Pool" />
                                    <SwitchBox value={property.hasGarden} setValue={(e) => HandleBool("hasGarden", e)} label="Garden" />
                                    <SwitchBox value={property.hasGarage} setValue={(e) => HandleBool("hasGarage", e)} label="Garage" />
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <SelectorBox options={LeavingstatusOP} label="Leaving Status" identify="leavingstatus" value={property.leavingstatus} setValue={(e) => HandleSel("leavingstatus", e)} isDisable={postProperty.isPending} ClassName="w-40" />
                                    <SelectorBox options={statusOP} label="Status" identify="status" value={property.status} setValue={(e) => HandleSel("status", e)} isDisable={postProperty.isPending} ClassName="w-40" />
                                </div>

                            </CardContent>

                        </Card>




                        <div className='flex flex-col gap-10 min-w-3xl'>

                            {/* {Image Box } */}
                            <div className=' flex gap-2 flex-col'>
                                <h2 className="text-xl font-bold">🖼️ Property Images</h2>

                                <ImgBox
                                    fileList={property.imageUrls}
                                    Class="w-full"
                                    disabled={postProperty.isPending}
                                    setData={(list) => setProperty(prev => ({ ...prev, imageUrls: list }))}
                                    SetMainImg={(index) => setProperty(prev => ({
                                        ...prev,
                                        imageUrls: prev.imageUrls.map((img, i) => ({ ...img, Thumbnail: i === index }))
                                    }))}
                                />
                            </div>

                            <Card className="ring-1 ring-gray-200 bg-gray-50 dark:ring-gray-700 dark:bg-gray-900">
                                <CardContent>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        <InputBox
                                            disabled={postProperty.isPending}
                                            label="Initial Investment"
                                            type="number"
                                            identify="initialInvestment"
                                            value={property.initialInvestment.toString()}
                                            setValue={(e) => {
                                                Handle("initialInvestment", e.target.value, e.target.type);
                                                FinalCalculation();
                                            }}
                                            className="w-40"
                                        />
                                        <NumberBox
                                            label="Margin (%)"
                                            disabled={postProperty.isPending}
                                            value={property.margin}
                                            setValue={(e) => {
                                                Handle("margin", e.toString(), "number");
                                                FinalCalculation();
                                            }}
                                            className="w-32"
                                        />
                                        <NumberBox
                                            label="Discount (%)"
                                            disabled={postProperty.isPending}
                                            value={property.discountPercentage}
                                            setValue={(e) => {
                                                Handle("discountPercentage", e.toString(), "number");
                                                FinalCalculation();
                                            }}
                                            className="w-28"
                                            min={0}
                                            max={100}
                                        />
                                        {property.typeOfSale === "lease" && (
                                            <NumberBox
                                                label="Cycle(Months)"
                                                disabled={postProperty.isPending}
                                                value={property.leaseCycle}
                                                setValue={(e) => Handle("leaseCycle", e.toString(), "number")}
                                                className="w-28"
                                            />
                                        )}
                                        <SelectorBox
                                            options={typeOfSaleOP}
                                            label="Type of Sale"
                                            identify="typeOfSale"
                                            value={property.typeOfSale}
                                            setValue={(e) => {
                                                HandleSel("typeOfSale", e);
                                                FinalCalculation();
                                            }}
                                            isDisable={postProperty.isPending}
                                            ClassName="w-28"
                                            defaultValue="sell"
                                        />
                                    </div>

                                    {/* Financial Summary Output */}
                                    <div className="pt-2">
                                        {typeOfSaleMode()}
                                    </div>

                                    <div className='flex flex-row-reverse'>
                                        <Button size={"lg"} className="ml-auto w-32" onClick={() => FinalCalculation()}>
                                            Recalculate
                                        </Button>
                                    </div>


                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Final Submission */}
                    <div className="">
                        <Button
                            onClick={handleSubmit}
                            disabled={postProperty.isPending}
                            className="w-full sm:w-80"
                        >
                            <span className="flex items-center gap-2">
                                {postProperty.isPending && <span className="animate-spin">🔄</span>}
                                Update or Make Property
                            </span>
                        </Button>
                    </div>

                </div>
            </div>
        </DropBack>

    )
}
