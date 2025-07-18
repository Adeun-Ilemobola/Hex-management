import { InvestmentBlockInput } from '@/lib/Zod'
import React from 'react'
import { NumberBox, SelectorBox } from '../InputBox'
import { Settings } from 'lucide-react'


interface propertyIFProps {
    investmentBlock: InvestmentBlockInput,
    setInvestmentBlock: React.Dispatch<React.SetStateAction<InvestmentBlockInput>>,
    disable: boolean
}

export default function InvestmentBlockSection({ investmentBlock, setInvestmentBlock, disable }: propertyIFProps) {
    const handleField = (field: keyof InvestmentBlockInput, val: string | boolean | number, type?: 'number') => {
        setInvestmentBlock(prev => ({ ...prev, [field]: type === 'number' ? Number(val) : val }))
    }
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-w-[50rem] max-w-[55rem]">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Investment Block</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Configure your investment parameters</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex flex-row gap-1.5">
                    <NumberBox
                        label="Investment"
                        value={investmentBlock.initialInvestment}
                        disabled={disable}
                        setValue={(val: number) => handleField('initialInvestment', val, 'number')}
                        className="w-52"
                        max={9999999999999}
                    />
                    <NumberBox
                        label="Margin (%)"
                        value={investmentBlock.margin}
                        disabled={disable}
                        setValue={(val: number) => handleField('margin', val, 'number')}
                        className="w-28"
                    />
                    <NumberBox
                        label="Discount (%)"
                        value={investmentBlock.discountPercentage}
                        disabled={disable}
                        setValue={(val: number) => handleField('discountPercentage', val, 'number')}
                        className="w-28"
                    />
                    {investmentBlock.typeOfSale === 'LEASE' && (
                        <NumberBox
                            label="Cycle (mo)"
                            value={investmentBlock.leaseCycle}
                            disabled={disable}
                            setValue={(val: number) => handleField('leaseCycle', val, 'number')}
                            className="w-28"
                        />
                    )}
                    <SelectorBox
                        label="Sale Type"
                        options={typeOfSaleOP}
                        value={investmentBlock.typeOfSale}
                        isDisable={disable}
                        setValue={(val: string) => handleField('typeOfSale', val)}
                        ClassName="w-30"
                    />
                </div>
            </div>
        </div>
    )
}


const typeOfSaleOP = [
    { value: 'SELL', label: 'SELL' },
    { value: 'RENT', label: 'RENT' },
    { value: 'LEASE', label: 'LEASE' },
]