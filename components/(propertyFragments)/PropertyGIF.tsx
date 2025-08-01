import { PropertyInput } from '@/lib/Zod'
import { nanoid } from 'nanoid'

import React from 'react'
import InputBox, { NumberBox, SelectorBox, SwitchBox } from '../InputBox'
import { Button } from '../ui/button'

interface PropertyGIFProps {
    propertyInfo: PropertyInput,
    setPropertyInfo: React.Dispatch<React.SetStateAction<PropertyInput>>,
    disable: boolean
}

export default function PropertyGIF({ propertyInfo, setPropertyInfo, disable }: PropertyGIFProps) {

    const handleField = (field: keyof PropertyInput, val: string | boolean | number, type?: 'number') => {
        setPropertyInfo(prev => ({ ...prev, [field]: type === 'number' ? Number(val) : val }))
    }

    return (
        <div className="space-y-6 p-3">
            {/* Basic Information */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold border-b border-gray-200 pb-1.5">
                    Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputBox
                        label="Property Name"
                        value={propertyInfo.name}
                        disabled={disable}
                        onChange={(e) => handleField('name', e)}
                    />
                    <InputBox
                        label="Address"
                        value={propertyInfo.address}
                        disabled={disable}
                        onChange={(e) => handleField('address', e)}
                    />
                </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">
                    Property Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                    <NumberBox
                        label="Bedrooms"
                        value={propertyInfo.numBedrooms}
                        disabled={disable}
                        setValue={(val) => handleField('numBedrooms', val, 'number')}
                        className="min-w-0"
                    />
                    <NumberBox
                        label="Bathrooms"
                        value={propertyInfo.numBathrooms}
                        disabled={disable}
                        setValue={(val) => handleField('numBathrooms', val, 'number')}
                        className="min-w-0"
                    />
                    <NumberBox
                        label="Lot Size"
                        value={propertyInfo.lotSize}
                        disabled={disable}
                        setValue={(val) => handleField('lotSize', val, 'number')}
                        className="min-w-0"
                    />
                    <NumberBox
                        label="Year Built"
                        value={propertyInfo.yearBuilt}
                        disabled={disable}
                        setValue={(val) => handleField('yearBuilt', val, 'number')}
                        className="min-w-0"
                    />
                    <NumberBox
                        label="Sq. Footage"
                        value={propertyInfo.squareFootage}
                        disabled={disable}
                        setValue={(val) => handleField('squareFootage', val, 'number')}
                        className="min-w-0"
                    />
                </div>
            </div>

            {/* Property Type & Status */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b border-gray-200 pb-1">
                    Type & Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SelectorBox
                        label="Property Type"
                        options={propertyTypeOP}
                        value={propertyInfo.propertyType}
                        isDisable={disable}
                        setValue={(val) => handleField('propertyType', val)}
                    />
                    <SelectorBox
                        label="Status"
                        options={typeOfSaleOP}
                        value={propertyInfo.status}
                        isDisable={disable}
                        setValue={(val) => handleField('status', val)}
                    />
                </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">
                    Features
                </h3>
                <div className="flex flex-wrap gap-4">
                    <SwitchBox
                        label="Pool"
                        value={propertyInfo.hasPool}
                        setValue={(val) => handleField('hasPool', val)}
                    />
                    <SwitchBox
                        label="Garden"
                        value={propertyInfo.hasGarden}
                        setValue={(val) => handleField('hasGarden', val)}
                    />
                    <SwitchBox
                        label="Garage"
                        value={propertyInfo.hasGarage}
                        setValue={(val) => handleField('hasGarage', val)}
                    />
                </div>
            </div>

            {/* Access Code */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold border-gray-200 pb-2">Access Code</h3>
                <div className="flex flex-wrap items-center gap-4 p-4 bg-yellow-500/5 rounded-lg border border-gray-200/20">
                    <div className="flex-1 min-w-[200px]">
                        <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">Current Access Code</p>
                        <p className="text-xl font-mono font-bold tracking-wider text-gray-800 dark:text-gray-100">
                            {propertyInfo.accessCode}
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setPropertyInfo((prev) => ({
                                ...prev,
                                accessCode: nanoid(12)
                            }));
                        }}
                        className="whitespace-nowrap"
                    >
                        Generate New Code
                    </Button>
                </div>
            </div>
        </div>

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
    { value: 'active', label: 'active' },
    { value: 'pending', label: 'pending' },
    { value: 'sold', label: 'sold' },


]
