import { DollarSign, Edit2, Mail, TrendingUp, User, Users, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ExternalInvestorInput, externalInvestorSchema } from '@/lib/Zod'
import { toast } from 'sonner';
// import { api } from '@/lib/trpc';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
    DialogFooter
} from "@/components/ui/dialog"
import InputBox, { NumberBox } from '../InputBox';


interface propertyIFProps {
    mebers: ExternalInvestorInput[];
    setMebers: React.Dispatch<React.SetStateAction<ExternalInvestorInput[]>>;
}
export default function PoolInvestorsSection({ mebers, setMebers }: propertyIFProps) {
    const [investor, setInvestor] = useState<ExternalInvestorInput | null>(null)
    const [showInvestorMod, setShowInvestorMod] = useState(false)
    const [maxContribution, setMaxContribution] = useState(0)

    const [mode, setMode] = useState<"edit" | "add">("add")
    // const updateExternalInvestorMut = api.Propertie.updataExternalInvestor.useMutation({
    //     onMutate() {
    //         toast.loading("Updating Investors", { id: "update" });
    //     },
    //     onSuccess(data) {
    //         console.log(showInvestorMod);

    //         if (data && data.success) {
    //             toast.success(data.message, { id: "update" });
    //         } else {
    //             toast.error(data.message, { id: "update" });
    //         }
    //     }
    // })
    useEffect(() => {
        // Calculate the maximum contribution percentage based on existing members
        const totalContribution = mebers.reduce((acc, member) => acc + member.contributionPercentage, 0);
        setMaxContribution(100 - totalContribution);
    }, [mebers]);
    console.log(maxContribution);
    




    const addNewInvestor = () => {
        if (maxContribution == 0) {
            toast.error("Maximum contribution percentage reached. Cannot add more investors.");
            return;
        }
        const newInvestor: ExternalInvestorInput = {
            name: "",
            email: "",
            contributionPercentage: 0,
            returnPercentage: 0,
            isInternal: false,
            accessRevoked: false,
            dollarValueReturn: 0,
            investmentBlockId: "",
            id: "",
        };
        setInvestor(newInvestor)
        setShowInvestorMod(true)
        setMode("add")

    }

    function SubmintInvestors() {
        // add the new investor to the list
        if (maxContribution == 0) {
            toast.error("Maximum contribution percentage reached. Cannot add more investors.");
            return;
        }

        const vInvestor = externalInvestorSchema.safeParse(investor)

        if (!vInvestor.success) {
            if (vInvestor.error.errors.length > 0) {
                vInvestor.error.errors.forEach(err => {
                    toast.error(`Error in ${err.path.join(",")}: ${err.message}`);
                }
                );
            }
            return
        }

        if (investor && investor.id.length <= 0 && investor.investmentBlockId.length <= 0) {
            setMebers(prev => [...prev, investor]);
            setInvestor(null)
            setShowInvestorMod(false)
            return
        }

        // // update the existing investor
        // if (investor && (investor.id.length > 0 || investor.investmentBlockId.length > 0)) {
        //     updateExternalInvestorMut.mutate({
        //         externalInvestors: investor
        //     })
        //     return
        // }


    }

    const removeInvestor = (index: number) => {
        setMebers(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-w-[56rem] max-w-[60rem]">
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
                            if (maxContribution == 100) {
                                toast.error("Maximum contribution percentage reached. Cannot add more investors.");
                                return;
                            }
                            addNewInvestor()

                        }}
                    >
                        Add Investors
                    </Button>
                </div>
            </div>

            <div className="p-6 flex flex-col gap-2 overflow-auto">
                {mebers.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {mebers.map((member, index) => (
                            <InvestorCard
                                key={index}
                                member={member}

                                onEdit={() => {
                                    console.log('edit investors')
                                    setInvestor(member)
                                    setMode("edit")
                                    setShowInvestorMod(true)
                                }}
                                onRemove={() => {
                                    console.log('remove investors')
                                    removeInvestor(index)
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState onAddInvestor={() => {

                        addNewInvestor()
                        setShowInvestorMod(true)

                    }} />
                )}

            </div>

            {investor && (
                <InvestorConfig
                    investor={investor}
                    setInvestor={setInvestor}
                    showInvestorMod={showInvestorMod}
                    setShowInvestorMod={setShowInvestorMod}
                    mode={mode}
                    onSubmit={SubmintInvestors}
                    maxContribution={maxContribution}

                />
            )}
        </div>
    )
}



// Empty State Component
function EmptyState({ onAddInvestor }: { onAddInvestor: () => void }) {
    return (
        <div className="text-center py-12 shrink-0">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center">
                <Users className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Investors Yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                Start building your investment pool by adding investors. Each investor can contribute a percentage of the total investment.
            </p>
            <Button
                onClick={onAddInvestor}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
                Add Your First Investor
            </Button>
        </div>
    );
}

// Individual Investor Card Component
function InvestorCard({
    member,
    onEdit,
    onRemove
}: {
    member: ExternalInvestorInput;
    onEdit: () => void;
    onRemove: () => void;
}) {
    return (
        <div className="group shrink-0 relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600 hover:-translate-y-1">
            {/* Decorative gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

            <div className="flex items-center justify-between">
                {/* Left side - Investor Info */}
                <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <User className="h-4 w-4 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {member.name || 'Unnamed Investor'}
                            </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {member.email || 'No email provided'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side - Financial Info & Actions */}
                <div className="flex items-center space-x-6">
                    {/* Financial Stats */}
                    <div className="text-right space-y-2">
                        <div className="flex items-center justify-end space-x-2">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            <div>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {member.contributionPercentage.toFixed(1)}%
                                </span>
                                <div className="text-xs text-gray-500 dark:text-gray-400">contribution</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    ${member.dollarValueReturn.toFixed(2)}
                                </span>
                                <div className="text-xs text-gray-500 dark:text-gray-400">expected return</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onEdit}
                            className="hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 w-10 h-10 p-0"
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onRemove}
                            className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 w-10 h-10 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}




interface InvestorConfigProps {
    investor: ExternalInvestorInput;
    setInvestor: React.Dispatch<React.SetStateAction<ExternalInvestorInput | null>>;
    showInvestorMod: boolean;
    setShowInvestorMod: React.Dispatch<React.SetStateAction<boolean>>;
    mode: "edit" | "add",
    onSubmit: () => void;
    maxContribution: number; //  prop to limit contribution percentage 

}



function InvestorConfig({ investor, setInvestor, showInvestorMod, setShowInvestorMod, mode, onSubmit, maxContribution }: InvestorConfigProps) {

    return (
        <Dialog open={showInvestorMod} onOpenChange={setShowInvestorMod} >
            <DialogOverlay className='bg-purple-800/70 backdrop-blur-xl  ' />
            <DialogContent className='border border-white/20 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60 rounded-3xl shadow-xl'>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "edit" ? "Edit Investor" : "Add Investor"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "edit" ? "Edit existing investor" : "Add new investor"}
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-4'>

                    <InputBox
                        label="Name"
                        value={investor.name}
                        onChange={(e) => setInvestor({ ...investor, name: e })}
                    />
                    <InputBox
                        label="Email"
                        value={investor.email}
                        onChange={(e) => setInvestor({ ...investor, email: e })}
                    />


                    <NumberBox
                        label="Contribution Percentage"
                        value={investor.contributionPercentage}
                        setValue={(e) => setInvestor({ ...investor, contributionPercentage: e })}
                        max={maxContribution}
                        min={0}
                    />



                </div>
                <DialogFooter className='flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onSubmit();

                        }}
                    >

                        {mode === "edit" ? "Save Changes" : "Add Investor"}
                    </Button>

                </DialogFooter>
            </DialogContent>


        </Dialog>
    )



}