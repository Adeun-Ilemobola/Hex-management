"use client"
import React, { useState, useEffect, useMemo } from 'react'
import DropBack from './DropBack'
import { authClient } from '@/lib/auth-client'
import { Nav } from './Nav'
import { PropertieInput, propertieSchema } from '@/lib/Zod'
import ImgBox from './ImgBox'
import InputBox, { NumberBox, SelectorBox, SwitchBox } from './InputBox'
import { api } from '@/lib/trpc'
import { toast } from 'sonner'
import { FileUploadResult } from '@/lib/utils'
import { Button } from './ui/button'
import { DeleteImages, UploadImageList } from '@/lib/supabase'

interface MakeUpdateProps {
    id?: string
}

const defaultProperty: PropertieInput = {
    name: '',
    address: '',
    description: '',
    numBedrooms: 0,
    numBathrooms: 0,
    lotSize: 0,
    yearBuilt: new Date().getFullYear(),
    squareFootage: 0,
    hasGarage: false,
    hasGarden: false,
    hasPool: false,
    amenities: [],
    status: 'pending',
    ownerName: '',
    contactInfo: '',
    typeOfSale: 'sell',
    initialInvestment: 0,
    saleDuration: 0,
    margin: 1,
    leaseCycle: 0,
    leaseType: 'Month',
    finalResult: 0,
    leavingstatus: 'Developing',
    propertyType: 'House',
    discountPercentage: 0,
    imageUrls: [],
    videoTourUrl: '',
}

export default function MakeUpdate({ id }: MakeUpdateProps) {
    const Session = authClient.useSession()
    const getProperty = api.Propertie.getPropertie.useQuery({ pID: id })
    const postProperty = api.Propertie.postPropertie.useMutation()

    const [property, setProperty] = useState<PropertieInput>(defaultProperty)


    const financials = useMemo(() => {
        const { typeOfSale, initialInvestment, margin, discountPercentage, leaseCycle, } = property;
        let result = 0;
        let duration = 0;

        if (typeOfSale === 'sell') {
            // 1) compute markup
            const markedUpPrice = initialInvestment * (1 + margin / 100);
            // 2) apply discount to the marked-up price
            result = markedUpPrice * (1 - discountPercentage / 100);
            // one‐time sale → 1 payment
            duration = 1;
        }
        else if (typeOfSale === 'rent') {
            const base = initialInvestment / 12;               // monthly cost before markup
            const pay = base * (1 + margin / 100);            // after markup
            result = pay * (1 - discountPercentage / 100);
            duration = Math.ceil(initialInvestment / result);
        }
        else if (typeOfSale === 'lease') {
            const base = initialInvestment / leaseCycle;       // per‐cycle cost
            const pay = base * (1 + margin / 100);
            result = pay * (1 - discountPercentage / 100);
            duration = Math.ceil(initialInvestment / result);
        }
        else {
            throw new Error(`Unknown typeOfSale "${typeOfSale}"`);
        }

        // Round to cents
        result = Math.round(result * 100) / 100;

        // Now compute the other summary values
        const base =
            typeOfSale === 'sell'
                ? initialInvestment
                : typeOfSale === 'rent'
                    ? initialInvestment / 12
                    : leaseCycle > 0
                        ? initialInvestment / leaseCycle
                        : 0;

        const marginAmount = base * (margin / 100);
        const discountAmount = (base + marginAmount) * (discountPercentage / 100);
        const netPayment = base + marginAmount - discountAmount;

        return {
            result,
            duration,
            base,
            marginAmount,
            discountAmount,
            netPayment,
        };
    }, [
        property.typeOfSale,
        property.initialInvestment,
        property.margin,
        property.discountPercentage,
        property.leaseCycle,
    ]);

    // load existing data
    useEffect(() => {
        if (getProperty.data) setProperty(propertieSchema.parse(getProperty.data))
    }, [getProperty.data])

    // field handlers
    const handleField = (field: keyof PropertieInput, val: string | boolean | number, type?: 'number') => {
        setProperty(prev => ({ ...prev, [field]: type === 'number' ? Number(val) : val }))
    }

    // auto-calc financials
    useEffect(() => {

        setProperty(prev => ({
            ...prev,
            finalResult: financials.result,
            saleDuration: financials.duration,
        }));
    }, [property.initialInvestment, property.margin, property.discountPercentage, property.leaseCycle, property.typeOfSale])





    // format currency
    const formatCurrency = (val: number) =>
        val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

    // submit handler
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
        <DropBack is={getProperty.isPending || postProperty.isPending}>
            <Nav SignOut={authClient.signOut} session={Session.data} />
            <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
                {/* Property Information */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-4">Property Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputBox
                            label="Name"
                            value={property.name}
                            disabled={postProperty.isPending}
                            setValue={e => handleField('name', e.target.value)}
                        />
                        <InputBox
                            label="Address"
                            value={property.address}
                            disabled={postProperty.isPending}
                            setValue={e => handleField('address', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <NumberBox
                            label="Bedrooms"
                            value={property.numBedrooms}
                            disabled={postProperty.isPending}
                            setValue={val => handleField('numBedrooms', val, 'number')}
                            className="w-28"
                        />
                        <NumberBox
                            label="Bathrooms"
                            value={property.numBathrooms}
                            disabled={postProperty.isPending}
                            setValue={val => handleField('numBathrooms', val, 'number')}
                           className="w-28"
                        />
                        <NumberBox
                            label="Lot Size"
                            value={property.lotSize}
                            disabled={postProperty.isPending}
                            setValue={val => handleField('lotSize', val, 'number')}
                            className="w-28"
                        />
                        <NumberBox
                            label="Year Built"
                            value={property.yearBuilt}
                            disabled={postProperty.isPending}
                            setValue={val => handleField('yearBuilt', val, 'number')}
                            className="w-32"
                        />
                        <NumberBox
                            label="Sq. Footage"
                            value={property.squareFootage}
                            disabled={postProperty.isPending}
                            setValue={val => handleField('squareFootage', val, 'number')}
                             className="w-28"
                        />
                        <SelectorBox
                            label="Property Type"
                            options={propertyTypeOP}
                            value={property.propertyType}
                            isDisable={postProperty.isPending}
                            setValue={val => handleField('propertyType', val)}

                        />
                    </div>
                    <div className="flex space-x-4 mt-4">
                        <SwitchBox label="Pool" value={property.hasPool} setValue={val => handleField('hasPool', val)} />
                        <SwitchBox label="Garden" value={property.hasGarden} setValue={val => handleField('hasGarden', val)} />
                        <SwitchBox label="Garage" value={property.hasGarage} setValue={val => handleField('hasGarage', val)} />
                    </div>
                </div>

                {/* Images & Financials */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-4">Images & Financials</h2>
                    <ImgBox
                        fileList={property.imageUrls}
                        disabled={postProperty.isPending}
                        setData={list => setProperty(prev => ({ ...prev, imageUrls: list }))}
                        SetMainImg={idx => setProperty(prev => ({
                            ...prev,
                            imageUrls: prev.imageUrls.map((img, i) => ({ ...img, Thumbnail: i === idx }))
                        }))}
                    />

                    <div className="flex flex-wrap gap-2 mt-4">
                        <NumberBox
                            label="Investment"
                            value={property.initialInvestment}
                            disabled={postProperty.isPending}
                            setValue={val => handleField('initialInvestment', val, 'number')}
                            className="w-52"
                            max={9999999999999}
                        />
                        <NumberBox
                            label="Margin (%)"
                            value={property.margin}
                            disabled={postProperty.isPending}
                            setValue={val => handleField('margin', val, 'number')}
                           className="w-28"
                        />
                        <NumberBox
                            label="Discount (%)"
                            value={property.discountPercentage}
                            disabled={postProperty.isPending}
                            setValue={val => handleField('discountPercentage', val, 'number')}
                            className="w-28"
                        />
                        {property.typeOfSale === 'lease' && (
                            <NumberBox
                                label="Cycle (mo)"
                                value={property.leaseCycle}
                                disabled={postProperty.isPending}
                                setValue={val => handleField('leaseCycle', val, 'number')}
                                className="w-28"
                            />
                        )}
                        <SelectorBox
                            label="Sale Type"
                            options={typeOfSaleOP}
                            value={property.typeOfSale}
                            isDisable={postProperty.isPending}
                            setValue={val => handleField('typeOfSale', val)}

                        />
                    </div>

                    {/* FinalCalculation Summary */}
                    <div className="mt-6 bg-indigo-50 dark:bg-indigo-900 border-l-4 border-indigo-500 dark:border-indigo-300 rounded-lg p-3">
                        <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                            Financial Summary
                        </h3>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Initial Investment:</span>
                                <span className="font-medium">
                                    {formatCurrency(property.initialInvestment)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Base (
                                    {property.typeOfSale === 'sell'
                                        ? 'Full Price'
                                        : property.typeOfSale === 'rent'
                                            ? 'Monthly Base'
                                            : 'Per Cycle'}
                                    ):
                                </span>
                                <span className="font-medium">
                                    {formatCurrency(financials.base)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Margin Amount ({property.margin}%):</span>
                                <span className="font-medium">
                                    {formatCurrency(financials.marginAmount)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Discount Amount ({property.discountPercentage}%):</span>
                                <span className="font-medium">
                                    {formatCurrency(financials.discountAmount)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Net Payment:</span>
                                <span className="font-bold">
                                    {formatCurrency(financials.result)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Payback Duration:</span>
                                <span className="font-bold">
                                    {financials.duration} month
                                    {financials.duration > 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>


                    <div className="mt-6 text-right">
                        <Button onClick={handleSubmit} disabled={postProperty.isPending}>{postProperty.isPending ? 'Saving...' : 'Save Property'}</Button>
                    </div>
                </div>
            </div>
        </DropBack>
    )
}

// Helper option arrays
const propertyTypeOP = [
    { value: 'House', label: 'House' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Condo', label: 'Condo' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Other', label: 'Other' },
]

const typeOfSaleOP = [
    { value: 'sell', label: 'Sell' },
    { value: 'rent', label: 'Rent' },
    { value: 'lease', label: 'Lease' },
]
