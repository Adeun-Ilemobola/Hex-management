import { Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { defaultExternalInvestorInput, ExternalInvestorInput, externalInvestorSchema } from '@/lib/Zod'
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Command,

    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,


} from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import InputBox, { NumberBox } from '../InputBox';
import InvestorCard from './InvestorCard';
import { api } from '@/lib/trpc';


interface propertyIFProps {
    mebers: ExternalInvestorInput[];
    setMebers: React.Dispatch<React.SetStateAction<ExternalInvestorInput[]>>;
    reLoad: () => void; // Optional prop to reload data after mutation
    Locked: () => boolean
}
export default function PoolInvestorsSection({ mebers, setMebers, Locked }: propertyIFProps) {
    const [investor, setInvestor] = useState<ExternalInvestorInput | null>(null)
    const [showInvestorMod, setShowInvestorMod] = useState(false)
    const [maxContribution, setMaxContribution] = useState(0)
    const [mode, setMode] = useState<"edit" | "add">("add")

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
        const newInvestor: ExternalInvestorInput = defaultExternalInvestorInput;
        setInvestor(newInvestor)
        setShowInvestorMod(true)
        setMode("add")

    }

    function SubmintInvestors() {
        // add the new investor to the list


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
        if (mode === "add") {
            if (maxContribution == 0) {
                toast.error("Maximum contribution percentage reached. Cannot add more investors.");
                return;
            }


            if (investor) {
                setMebers(prev => [...prev, investor]);
                setInvestor(null)
                setShowInvestorMod(false)
                return
            } else {
                toast.error("Invalid Investor")
            }
        }

        if (mode === "edit") {
            // update the existing investor
            if (investor) {
                const updatedMembers = mebers.map(member => {
                    if (member.id === investor.id || member.email === investor.email) {
                        return investor;
                    }
                    return member;
                });
                setMebers(updatedMembers);
                setShowInvestorMod(false)
                setInvestor(null)
                toast.success("Investor updated successfully", {
                    id: "update"
                }

                );

                return
            }

        }

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
                    <div className="flex flex-col gap-4 py-1">
                        {mebers.map((member, index) => (
                            <InvestorCard
                                key={index}
                                member={member}
                                locked={Locked()}

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
    const [searchMode, setSearchMode] = useState<"Manuel" | "Search">("Manuel");
    const [textSearch, setTextSearch] = useState<string>("");
    const foundUsers = api.user.SearchUserByEmail.useMutation();

    return (
        <Dialog open={showInvestorMod} onOpenChange={setShowInvestorMod} >
            <DialogOverlay className='bg-purple-800/50 backdrop-blur-md  ' />
            <DialogContent className='border border-white/20 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60 rounded-3xl shadow-xl'>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "edit" ? "Edit Investor" : "Add Investor"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "edit" ? "Edit existing investor" : "Add new investor"}
                    </DialogDescription>
                </DialogHeader>
                <div className='p-3 flex flex-col gap-2'>
                    <Button
                        className='w-[38%] ml-auto'
                        variant={"outline"}
                        onClick={() => setSearchMode(searchMode === "Manuel" ? "Search" : "Manuel")}>
                        
                        {searchMode}
                    </Button>
                    <div className='flex flex-col gap-4'>
                        {searchMode === "Manuel" && (
                            <>
                                <InputBox
                                    label="Name"
                                    value={investor.name}
                                    onChange={(e) => setInvestor({ ...investor, name: e , investorUserId: null })}
                                />
                                <InputBox
                                    label="Email"
                                    value={investor.email}
                                    onChange={(e) => setInvestor({ ...investor, email: e , investorUserId: null })}
                                />
                            </>
                        )}


                        {searchMode === "Search" && (
                            <>
                                <Command>
                                    <CommandInput
                                        placeholder="Type a command or search..."
                                        value={textSearch}
                                        onValueChange={(e) => {
                                            setTextSearch(e);
                                            foundUsers.mutate({ email: e });
                                        }}
                                    />
                                    <CommandList>
                                        <CommandEmpty>No user found.</CommandEmpty>
                                        <CommandGroup heading="Users">
                                            {foundUsers.data?.value.map((user , i) => (
                                                <CommandItem
                                                    key={i}
                                                    value={user.email}
                                                    onSelect={() => {
                                                        setInvestor({ ...investor, name: user.name, email: user.email , investorUserId: user.id });
                                                       setSearchMode("Manuel");
                                                    }}
                                                >

                                                    <div className='flex flex-row gap-2 p-2.5'>
                                                        <Avatar className="h-12 w-12 rounded-md" >
                                                            <AvatarImage src={user.image ?? undefined} />
                                                            <AvatarFallback 
                                                            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold"
                                                            >{user.name.substring(0, 1)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className='flex flex-col'>
                                                            <span className='font-bold'>{user.name}</span>
                                                            <span className='text-sm text-gray-500 dark:text-gray-400'>{user.email}</span>
                                                        </div>

                                                    </div>
                                                </CommandItem>
                                            ))}


                                        </CommandGroup>
                                    </CommandList>
                                </Command>



                            </>
                        )}




                        <NumberBox
                            label="Contribution Percentage"
                            value={investor.contributionPercentage}
                            setValue={(e) => setInvestor({ ...investor, contributionPercentage: e })}
                            max={maxContribution}
                            min={0}
                        />

                    </div>
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