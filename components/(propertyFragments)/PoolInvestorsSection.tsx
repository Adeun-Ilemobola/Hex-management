import { Users } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

export default function PoolInvestorsSection() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-w-[50rem] max-w-[55rem]">
            <div className=" flex flex-row px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-1 items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pool Investors</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Manage investor pool and distributions</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-sm font-medium"
                        onClick={() => {
                            console.log('add investors')
                        }}
                    >
                        Add Investors
                    </Button>
                </div>
            </div>

            <div className="p-6">
                <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Pool Investors Section</h3>
                    <p className="text-gray-600 dark:text-gray-300">This section will be added in the future for managing investor pools and profit distributions.</p>
                </div>
            </div>
        </div>
    )
}