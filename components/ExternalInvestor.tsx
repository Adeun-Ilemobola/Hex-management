import { Users, Search, UserPen } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { Button } from './ui/button'
import { defaultExternalInvestorInput, ExternalInvestorInput, externalInvestorSchema } from '@/lib/ZodObject'
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
import InvestorCard from './InvestorCard';
import { trpc as api } from '@/lib/client'; 
import { NumberStepper } from './NumberStepper';
import { TextField } from './TextField';

interface PoolInvestorsSectionProps {
    members: ExternalInvestorInput[]; // Fixed typo: mebers -> members
    setMembers: React.Dispatch<React.SetStateAction<ExternalInvestorInput[]>>;
    reLoad: () => void;
    removeInvestor: (email: string, name: string) => void
    Locked: () => boolean
}

export default function PoolInvestorsSection({ members, setMembers, Locked, removeInvestor }: PoolInvestorsSectionProps) {
    const [investor, setInvestor] = useState<ExternalInvestorInput | null>(null)
    const [showInvestorMod, setShowInvestorMod] = useState(false)
    const [mode, setMode] = useState<"edit" | "add">("add")

    // 1. Calculate totals dynamically (No useEffect needed)
    const totalContribution = useMemo(() => 
        members.reduce((acc, member) => acc + (member.contributionPercentage || 0), 0)
    , [members]);

    const remainingAllocation = 100 - totalContribution;

    const addNewInvestor = () => {
        if (remainingAllocation <= 0) {
            toast.error("Maximum contribution percentage reached. Cannot add more investors.");
            return;
        }
        setInvestor({ ...defaultExternalInvestorInput });
        setMode("add")
        setShowInvestorMod(true)
    }

    const handleEditInvestor = (member: ExternalInvestorInput) => {
        setInvestor({ ...member });
        setMode("edit");
        setShowInvestorMod(true);
    };

    function submitInvestors() {
        // Validate Schema
        const vInvestor = externalInvestorSchema.safeParse(investor)
        
        if (!vInvestor.success) {
            vInvestor.error.issues.forEach(err => {
                toast.error(`Error in ${err.path.join(",")}: ${err.message}`);
            });
            return
        }

        if (!investor) return;

        // Logic Check: Allocation
        // For add: Amount <= Remaining
        // For edit: Amount <= Remaining + PreviousAmount (But this is handled by NumberStepper max prop usually)
        
        const currentAmount = Number(investor.contributionPercentage);
        let allowedSpace = remainingAllocation;
        
        if (mode === 'edit') {
            // Find the original user to see what they held before
            const originalUser = members.find(m => m.id === investor.id || m.email === investor.email);
            if (originalUser) {
                allowedSpace += Number(originalUser.contributionPercentage);
            }
        }

        if (currentAmount > allowedSpace) {
            toast.error(`Allocation exceeds limit. Max available: ${allowedSpace}%`);
            return;
        }

        if (mode === "add") {
            setMembers(prev => [...prev, investor]);
            toast.success("Investor added successfully");
        }

        if (mode === "edit") {
            const updatedMembers = members.map(member => {
                const isMatch = (member.id && member.id === investor.id) || member.email === investor.email;
                return isMatch ? investor : member;
            });
            setMembers(updatedMembers);
            toast.success("Investor updated successfully");
        }

        setInvestor(null)
        setShowInvestorMod(false)
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-w-[56rem] max-w-[60rem]">
            {/* Header */}
            <div className="flex flex-row px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-1 items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pool Investors</h2>
                        <div className="flex gap-2 items-center">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Manage investor pool</p>
                            {/* Visual indicator of pool health */}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${remainingAllocation === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {totalContribution}% Allocated
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-sm font-medium"
                        disabled={remainingAllocation <= 0} // Disable if full
                        onClick={addNewInvestor}
                    >
                        Add Investors
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-2 overflow-auto">
                {members.length > 0 ? (
                    <div className="flex flex-col gap-4 py-1">
                        {members.map((member, index) => (
                            <InvestorCard
                                key={member.id || index}
                                member={member}
                                locked={Locked()}
                                onEdit={() => handleEditInvestor(member)}
                                onRemove={() => removeInvestor(member.email, member.name)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState onAddInvestor={addNewInvestor} />
                )}
            </div>

            {/* Config Modal */}
            {investor && (
                <InvestorConfig
                    investor={investor}
                    setInvestor={setInvestor}
                    showInvestorMod={showInvestorMod}
                    setShowInvestorMod={setShowInvestorMod}
                    mode={mode}
                    onSubmit={submitInvestors}
                    // CRITICAL FIX: Pass the specific logic for max value
                    maxAllowed={mode === 'add' 
                        ? remainingAllocation 
                        : remainingAllocation + Number(investor.contributionPercentage)
                    }
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
                Start building your investment pool by adding investors.
            </p>
            <Button
                onClick={onAddInvestor}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 text-white px-6 py-2.5 rounded-lg"
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
    maxAllowed: number; // Renamed to clarify this is the cap for this specific user
}

function InvestorConfig({ investor, setInvestor, showInvestorMod, setShowInvestorMod, mode, onSubmit, maxAllowed }: InvestorConfigProps) {
    const [searchMode, setSearchMode] = useState<"Manual" | "Search">("Manual");
    const [textSearch, setTextSearch] = useState<string>("");
    const foundUsers = api.user.SearchUserByEmail.useMutation();

    // Reset search mode when modal closes/opens or mode changes if needed
    // (Optional optimization)

    return (
        <Dialog open={showInvestorMod} onOpenChange={setShowInvestorMod}>
            <DialogOverlay className='bg-purple-800/50 backdrop-blur-md' />
            <DialogContent className='border border-white/20 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60 rounded-3xl shadow-xl'>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "edit" ? "Edit Investor" : "Add Investor"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "edit" ? "Adjust contribution details" : "Add a new external or internal investor"}
                    </DialogDescription>
                </DialogHeader>
                
                <div className='p-3 flex flex-col gap-4'>
                    {/* Toggle Search/Manual */}
                    <div className="flex justify-end">
                         <Button
                            size="sm"
                            variant="secondary"
                            className="text-xs"
                            onClick={() => setSearchMode(searchMode === "Manual" ? "Search" : "Manual")}>
                            {searchMode === "Manual" ? (
                                <><Search className="w-3 h-3 mr-2" /> Switch to Search</>
                            ) : (
                                <><UserPen className="w-3 h-3 mr-2" /> Switch to Manual Input</>
                            )}
                        </Button>
                    </div>

                    <div className='flex flex-col gap-4'>
                        {searchMode === "Manual" && (
                            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                <TextField
                                    label="Name"
                                    value={investor.name}
                                    onChange={(e) => setInvestor(prev => prev ? ({ ...prev, name: e }) : null)}
                                />
                                <TextField
                                    label="Email"
                                    value={investor.email}
                                    onChange={(e) => setInvestor(prev => prev ? ({ ...prev, email: e }) : null)}
                                />
                            </div>
                        )}

                        {searchMode === "Search" && (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <Command className="border rounded-lg shadow-sm">
                                    <CommandInput
                                        placeholder="Search user by email..."
                                        value={textSearch}
                                        onValueChange={(e) => {
                                            setTextSearch(e);
                                            // Debouncing suggested here in real app
                                            if(e.length > 2) foundUsers.mutate({ email: e });
                                        }}
                                    />
                                    <CommandList className="max-h-[200px]">
                                        <CommandEmpty>No user found.</CommandEmpty>
                                        <CommandGroup heading="Users">
                                            {foundUsers.data?.value.map((user, i) => (
                                                <CommandItem
                                                    key={i}
                                                    value={user.email}
                                                    onSelect={() => {
                                                        setInvestor(prev => prev ? ({ 
                                                            ...prev, 
                                                            name: user.name, 
                                                            email: user.email, 
                                                            investorUserId: user.id 
                                                        }) : null);
                                                        setSearchMode("Manual");
                                                    }}
                                                >
                                                    <div className='flex flex-row gap-2 items-center'>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={user.image ?? undefined} />
                                                            <AvatarFallback className="bg-purple-600 text-white text-xs">
                                                                {user.name.substring(0, 1)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className='flex flex-col'>
                                                            <span className='font-medium text-sm'>{user.name}</span>
                                                            <span className='text-xs text-gray-500'>{user.email}</span>
                                                        </div>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </div>
                        )}

                        <div className="pt-2">
                            <NumberStepper
                                label="Contribution Percentage (%)"
                                value={Number(investor.contributionPercentage)}
                                min={0}
                                max={maxAllowed} // Uses the corrected math
                                onChange={(e) => setInvestor(prev => prev ? ({ ...prev, contributionPercentage: e }) : null)}
                            />
                            <p className="text-xs text-right text-gray-500 mt-1">
                                Max allowed: {maxAllowed.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className='sm:justify-between flex-row items-center'>
                     <Button
                        variant="ghost"
                        onClick={() => setShowInvestorMod(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={onSubmit}
                    >
                        {mode === "edit" ? "Save Changes" : "Add Investor"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}