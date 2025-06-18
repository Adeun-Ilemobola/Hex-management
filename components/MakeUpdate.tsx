"use client"
import React, { useState, useEffect, useMemo } from 'react'
import DropBack from './DropBack'
import { authClient } from '@/lib/auth-client'
import { Nav } from './Nav'
import { PropertieInput, propertieSchema } from '@/lib/Zod'
import InputBox, { NumberBox, SelectorBox, SwitchBox } from './InputBox'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/lib/trpc'
import { toast } from 'sonner'
import ImgBox from './ImgBox'
import { Button } from './ui/button'
import { DeleteImages, UploadImage, UploadImageList } from '@/lib/supabase'
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
    const api = useTRPC();
    const Session = authClient.useSession()
    const getProperty = useQuery(api.Propertie.getPropertie.queryOptions({ pID: id }))
    const postProperty =useMutation( api.Propertie.postPropertie.mutationOptions())

   


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
                        finalResult: pre.initialInvestment + (pre.initialInvestment * pre.margin / 100)
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
                if (MonthlyPaymentBase > 0 && MonthlyPayment > 0) {
                    setProperty(pre => ({
                        ...pre,
                        finalResult: MonthlyPayment,
                        saleDuration: Math.ceil(pre.initialInvestment / MonthlyPayment)
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
        const currency = (val: number) =>
            val.toLocaleString("en-US", { style: "currency", currency: "USD" });

        if (property.typeOfSale === "sell") {
            const profit = property.finalResult - property.initialInvestment;
            return (
                <div className="p-4 rounded-xl border border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-900 space-y-2">
                    <p className="text-lg font-semibold text-black dark:text-white">
                        🏷️ <span className="text-green-600 dark:text-green-400">Selling Price:</span>{" "}
                        {currency(property.finalResult)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        💸 Initial Investment: <span className="font-medium">{currency(property.initialInvestment)}</span>
                        {property.margin > 0 && (
                            <>
                                {" "}
                                ➕ Margin: <span className="font-medium text-yellow-600 dark:text-yellow-400">{property.margin}%</span>
                            </>
                        )}
                    </p>
                    <p className="text-indigo-600 dark:text-indigo-300 font-medium">
                        📈 Expected Profit: {currency(profit)}
                    </p>
                </div>
            );
        }

        if (property.typeOfSale === "rent") {
            const monthly = property.finalResult;
            const yearlyProfit = monthly * 12 - property.initialInvestment;
            const timeline = property.saleDuration > 0 ? property.saleDuration : 0;

            return (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-900 space-y-2">
                    <p className="text-lg font-semibold text-black dark:text-white">
                        🏠 <span className="text-green-600 dark:text-green-400">Monthly Rent:</span>{" "}
                        {currency(monthly)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        💸 Initial Investment: <span className="font-medium">{currency(property.initialInvestment)}</span>{" "}
                        ➕ Margin: <span className="font-medium text-yellow-600 dark:text-yellow-400">{property.margin}%</span>
                    </p>
                    <p className="text-indigo-600 dark:text-indigo-300 font-medium">
                        📈 Expected Annual Profit: {currency(yearlyProfit)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        ⏳ Estimated recovery time: {timeline} month(s)
                    </p>
                </div>
            );
        }

        if (property.typeOfSale === "lease") {
            const leaseCycle = property.leaseCycle;
            const cycles = property.saleDuration > 0 ? property.saleDuration : 0;
            const totalMonths = cycles * leaseCycle;

            return (
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50 dark:border-purple-500/30 dark:bg-purple-900 space-y-2">
                    <p className="text-lg font-semibold text-black dark:text-white">
                        📄 <span className="text-green-600 dark:text-green-400">Lease Payment (every {leaseCycle} month(s)):</span>{" "}
                        {currency(property.finalResult)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        💸 Initial Investment: <span className="font-medium">{currency(property.initialInvestment)}</span>{" "}
                        ➕ Margin: <span className="font-medium text-yellow-600 dark:text-yellow-400">{property.margin}%</span>
                    </p>
                    <p className="text-indigo-600 dark:text-indigo-300 font-medium">
                        ⏳ Recovery Time: {cycles} cycle(s) (~{totalMonths} month(s))
                    </p>
                </div>
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
                    imageUrls: [ ...uploadedImages , ...property.imageUrls.filter(img => img.supabaseID && img.supabaseID !== "")],
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
        <DropBack is={(getProperty.isPending || postProperty.isPending)}>
            <div className="relative flex flex-col min-h-screen overflow-hidden">
                <Nav SignOut={authClient.signOut} session={Session.data} />

                <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">

                    {/* Property Info */}
                    <div className="p-4 rounded-lg shadow-sm ring-1 ring-gray-200 bg-gray-50 dark:ring-gray-700 dark:bg-gray-900">
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

                        <div className="flex flex-wrap gap-3 mt-4">
                            <NumberBox label="Bedrooms" disabled={postProperty.isPending} value={property.numBedrooms} setValue={(e) => Handle("numBedrooms", e.toString(), "number")} className="w-40" />
                            <NumberBox label="Bathrooms" disabled={postProperty.isPending} value={property.numBathrooms} setValue={(e) => Handle("numBathrooms", e.toString(), "number")} className="w-40" />
                            <NumberBox label="Lot Size" disabled={postProperty.isPending} min={2} value={property.lotSize} setValue={(e) => Handle("lotSize", e.toString(), "number")} className="w-40" />
                            <NumberBox label="Year Built" disabled={postProperty.isPending} min={1800} max={new Date().getFullYear()} step={1} value={property.yearBuilt} setValue={(e) => Handle("yearBuilt", e.toString(), "number")} className="w-40" />
                            <NumberBox label="Square Footage" disabled={postProperty.isPending} min={2} max={50000} step={1} value={property.squareFootage} setValue={(e) => Handle("squareFootage", e.toString(), "number")} className="w-40" />
                            <SelectorBox options={propertyTypeOP} label="Property Type" identify="propertyType" value={property.propertyType} setValue={(e) => HandleSel("propertyType", e)} isDisable={postProperty.isPending} ClassName="w-40" />
                        </div>

                        <div className="flex gap-4 mt-4">
                            <SwitchBox value={property.hasPool} setValue={(e) => HandleBool("hasPool", e)} label="Pool" />
                            <SwitchBox value={property.hasGarden} setValue={(e) => HandleBool("hasGarden", e)} label="Garden" />
                            <SwitchBox value={property.hasGarage} setValue={(e) => HandleBool("hasGarage", e)} label="Garage" />
                        </div>

                        <div className="flex gap-3 mt-4">
                            <SelectorBox options={LeavingstatusOP} label="Leaving Status" identify="Leavingstatus" value={property.Leavingstatus} setValue={(e) => HandleSel("Leavingstatus", e)} isDisable={postProperty.isPending} ClassName="w-40" />
                            <SelectorBox options={statusOP} label="Status" identify="status" value={property.status} setValue={(e) => HandleSel("status", e)} isDisable={postProperty.isPending} ClassName="w-40" />
                        </div>
                    </div>


                    <div className='flex flex-col gap-3 '>
                        {/* Image Box */}
                        <div className="p-4 rounded-lg shadow-sm ring-1 ring-gray-200 bg-gray-50 dark:ring-gray-700 dark:bg-gray-900 flex flex-col gap-4 w-full max-w-2xl">
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

                        {/* Sale and Calculation Section */}
                        <div className="p-4 rounded-lg shadow-sm ring-1 ring-gray-200 bg-gray-50 dark:ring-gray-700 dark:bg-gray-900 flex flex-col gap-4 w-full max-w-2xl">
                            <div className="flex flex-wrap gap-3">
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
                                {property.typeOfSale === "lease" && (
                                    <NumberBox
                                        label="Lease Cycle (Months)"
                                        disabled={postProperty.isPending}
                                        value={property.leaseCycle}
                                        setValue={(e) => Handle("leaseCycle", e.toString(), "number")}
                                        className="w-44"
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
                                    ClassName="w-40"
                                    defaultValue="sell"
                                />
                            </div>

                            {/* Financial Summary Output */}
                            <div className="pt-2">
                                {typeOfSaleMode()}
                            </div>

                            <Button className="ml-auto w-32" onClick={() => FinalCalculation()}>
                                Recalculate
                            </Button>
                        </div>
                    </div>



                    {/* Final Submission */}
                    <div className="flex justify-end w-full max-w-2xl">
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
