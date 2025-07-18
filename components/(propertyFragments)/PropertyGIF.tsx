import { InvestmentBlockInput, PropertyInput } from '@/lib/Zod'
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
        <>

            <div className="flex flex-col gap-4">
                <InputBox
                    label="Name"
                    value={propertyInfo.name}
                    disabled={disable}
                    onChange={e => handleField('name', e)}
                />
                <InputBox
                    label="Address"
                    value={propertyInfo.address}
                    disabled={disable}
                    onChange={e => handleField('address', e)}
                />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
                <NumberBox
                    label="Bedrooms"
                    value={propertyInfo.numBedrooms}
                    disabled={disable}
                    setValue={val => handleField('numBedrooms', val, 'number')}
                    className="w-28"
                />
                <NumberBox
                    label="Bathrooms"
                    value={propertyInfo.numBathrooms}
                    disabled={disable}
                    setValue={val => handleField('numBathrooms', val, 'number')}
                    className="w-28"
                />
                <NumberBox
                    label="Lot Size"
                    value={propertyInfo.lotSize}
                    disabled={disable}
                    setValue={val => handleField('lotSize', val, 'number')}
                    className="w-28"
                />
                <NumberBox
                    label="Year Built"
                    value={propertyInfo.yearBuilt}
                    disabled={disable}
                    setValue={val => handleField('yearBuilt', val, 'number')}
                    className="w-32"
                />
                <NumberBox
                    label="Sq. Footage"
                    value={propertyInfo.squareFootage}
                    disabled={disable}
                    setValue={val => handleField('squareFootage', val, 'number')}
                    className="w-28"
                />
                <SelectorBox
                    label="propertyInfo Type"
                    options={propertyTypeOP}
                    value={propertyInfo.propertyType}
                    isDisable={disable}
                    setValue={val => handleField('propertyType', val)}

                />
            </div>
            <div className="flex space-x-4 mt-4">
                <SwitchBox label="Pool" value={propertyInfo.hasPool} setValue={val => handleField('hasPool', val)} />
                <SwitchBox label="Garden" value={propertyInfo.hasGarden} setValue={val => handleField('hasGarden', val)} />
                <SwitchBox label="Garage" value={propertyInfo.hasGarage} setValue={val => handleField('hasGarage', val)} />
            </div>

            <div className=' flex flex-row gap-1 p-1.5 items-center  w-0 max-w-90'>
                <p className='flex-1 text-lg font-bold tracking-[.15em]'>{propertyInfo.accessCode}</p>
                <Button
                onClick={()=>{
                    setPropertyInfo(pre=>({...pre , accessCode: nanoid(12)}))
                }}
                >
                    Generator Code
                </Button>
            </div>

        </>
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
