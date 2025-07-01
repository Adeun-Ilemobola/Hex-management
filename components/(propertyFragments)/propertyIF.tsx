import { InvestmentBlockInput } from '@/lib/Zod'
import React from 'react'
import { NumberBox, SelectorBox } from '../InputBox'


interface propertyIFProps {
    investmentBlock: InvestmentBlockInput,
    setInvestmentBlock: React.Dispatch<React.SetStateAction<InvestmentBlockInput>>,
    disable: boolean
}

export default function PropertyIF({ investmentBlock, setInvestmentBlock, disable }: propertyIFProps) {
    const handleField = (field: keyof InvestmentBlockInput, val: string | boolean | number, type?: 'number') => {
            setInvestmentBlock(prev => ({ ...prev, [field]: type === 'number' ? Number(val) : val }))
        }
    return (
        <>

        <div className=' flex  flex-row gap-1.5'>
             <NumberBox
                label="Investment"
                value={investmentBlock.initialInvestment}
                disabled={disable}
                setValue={val => handleField('initialInvestment', val, 'number')}
                className="w-52"
                max={9999999999999}
            />
            <NumberBox
                label="Margin (%)"
                value={investmentBlock.margin}
                disabled={disable}
                setValue={val => handleField('margin', val, 'number')}
                className="w-28"
            />
            <NumberBox
                label="Discount (%)"
                value={investmentBlock.discountPercentage}
                disabled={disable}
                setValue={val => handleField('discountPercentage', val, 'number')}
                className="w-28"
            />
            {investmentBlock.typeOfSale === 'LEASE' && (
                <NumberBox
                    label="Cycle (mo)"
                    value={investmentBlock.leaseCycle}
                    disabled={disable}
                    setValue={val => handleField('leaseCycle', val, 'number')}
                    className="w-28"
                />
            )}
            <SelectorBox
                label="Sale Type"
                options={typeOfSaleOP}
                value={investmentBlock.typeOfSale}
                isDisable={disable}
                setValue={val => handleField('typeOfSale', val)}
                ClassName=' w-30 '

            />

        </div>


           

        </>
    )
}


const typeOfSaleOP = [
    { value: 'SELL', label: 'SELL' },
    { value: 'RENT', label: 'RENT' },
    { value: 'LEASE', label: 'LEASE' },
]
