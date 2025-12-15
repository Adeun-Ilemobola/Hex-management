import { InvestmentBlockInput } from '@/lib/ZodObject'
import React from 'react'
import { NumberStepper } from './NumberStepper'
import { Settings } from 'lucide-react'
import { Field, FieldLabel } from './ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const typeOfSaleOP = [
    { value: 'SELL', label: 'SELL' },
    { value: 'RENT', label: 'RENT' },
    { value: 'LEASE', label: 'LEASE' },
]
type FinancialMetricsProps = {
    investmentBlock: InvestmentBlockInput,
    setInvestmentBlock: React.Dispatch<React.SetStateAction<InvestmentBlockInput>>,
    disable: boolean,
    allowed: boolean
}
export default function FinancialMetrics({ investmentBlock, setInvestmentBlock, disable , allowed }: FinancialMetricsProps) {
    const handleField = (field: keyof InvestmentBlockInput, val: string | boolean | number, type?: 'number') => {
        setInvestmentBlock(prev => ({ ...prev, [field]: type === 'number' ? Number(val) : val }))
    }
  return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-w-[56rem] max-w-[60rem]">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Investment Block</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Configure your investment parameters</p>
                        {allowed && <p className="text-sm text-red-600 dark:text-red-300">Locked</p>}
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex flex-row justify-center items-center gap-1.5">
                    <NumberStepper
                        label="initial Investment"
                        value={investmentBlock.initialInvestment}
                        disabled={allowed ? true : disable}
                        onChange={(val: number) => handleField('initialInvestment', val, 'number')}
                        className="w-40"
                        

                    />

                    <NumberStepper
                        label="Margin"
                        value={investmentBlock.margin}
                        disabled={allowed ? true : disable}
                        onChange={(val: number) => handleField('margin', val, 'number')}
                        className="w-40"
                    />
                    
                    <NumberStepper
                        label="Discount"
                        value={investmentBlock.discountPercentage}
                        disabled={allowed ? true : disable}
                        onChange={(val: number) => handleField('discountPercentage', val, 'number')}
                        className="w-28"
                    />

                    {(investmentBlock.typeOfSale === 'RENT' || investmentBlock.typeOfSale === 'LEASE') && (
                        <NumberStepper
                            label="Depreciation"
                            value={investmentBlock.depreciationYears}
                            disabled={allowed ? true : disable}
                            onChange={(val: number) => handleField('depreciationYears', val, 'number')}
                            className="w-28"
                        />
                        
                    )}
                    {investmentBlock.typeOfSale === 'LEASE' && (
                        <NumberStepper
                            label="Lease Cycle"
                            value={investmentBlock.leaseCycle}
                            disabled={allowed ? true : disable}
                            onChange={(val: number) => handleField('leaseCycle', val, 'number')}
                            className="w-28"
                        />
                    )}
                    
                    <Field className=" flex flex-col gap-2 w-30">
                    <FieldLabel htmlFor="propertyType">Property Type</FieldLabel>
                    <Select
                        value={investmentBlock.typeOfSale}
                        onValueChange={(val) => handleField("typeOfSale", val)}
                        disabled={allowed ? true : disable}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Property Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {typeOfSaleOP.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                </div>
            </div>
        </div>
    )
}
