import React from 'react'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Search, Check, ChevronDown, X } from 'lucide-react'
import { clsx } from 'clsx'
import { Badge } from "@/components/ui/badge" // Assuming you have this, otherwise standard div works

// --- SUB-COMPONENT: INDIVIDUAL ITEM ---
type SelectionCardProps = {
    selected: boolean,
    toggle: () => void,
    label: string
}

function SelectionCard({ selected, toggle, label }: SelectionCardProps) {
    return (
        <div 
            onClick={toggle}
            className={clsx(
                "group cursor-pointer select-none rounded-md border px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-between",
                selected 
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600 dark:bg-blue-950 dark:border-blue-500 dark:text-blue-300" 
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            )}
        >
            <span className="truncate mr-2">{label}</span>
            {selected && <Check className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />}
        </div>
    )
}

// --- MAIN COMPONENT ---
type MultiSelectorProps = {
    list: string[],
    defaultList: string[],
    updtate: (list: string[]) => void
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function MultiSelector({ list, updtate, open, setOpen, defaultList }: MultiSelectorProps) {
    const [searchText, setSearchText] = React.useState("")

    function getFilteredList() {
        if (searchText.length > 0) {
            return defaultList.filter((item) => item.toLowerCase().includes(searchText.toLowerCase()))
        }
        return defaultList
    }

    // Helper to toggle items
    const handleToggle = (name: string) => {
        if (list.includes(name)) {
            updtate(list.filter((item) => item !== name));
        } else {
            updtate([...list, name]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Custom Overlay to handle close and reset search */}
            <DialogOverlay
                className="backdrop-blur-sm bg-black/20"
                onClick={(e) => {
                    e.stopPropagation()
                    setSearchText("")
                    setOpen(false)
                }}
            />
            
            <DialogTrigger asChild>
               
                <div 
                    className="flex min-h-[2.5rem] w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground"
                    role="combobox"
                >
                    <div className="flex flex-wrap gap-1">
                        {list.length === 0 ? (
                            <span className="text-muted-foreground">Select items...</span>
                        ) : (
                            <span className="font-medium text-foreground">
                                {list.length} items selected
                            </span>
                        )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
            </DialogTrigger>

            <DialogContent 
                showCloseButton={false}
                className="flex flex-col gap-4 max-w-2xl max-h-[85vh] p-0 overflow-hidden"
            >
                {/* HEADER SECTION: Title & Search */}
                <div className="flex flex-col gap-4 border-b p-4 pb-6 bg-white/50">
                    <div className="flex items-center justify-between">
                         <DialogTitle className="text-lg font-semibold tracking-tight">
                            Select Amenities
                        </DialogTitle>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                   
                    <InputGroup className="w-full">
                        <InputGroupAddon className="bg-transparent pl-3 text-muted-foreground">
                            <Search className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput 
                            placeholder="Search amenities..." 
                            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                            onChange={(e) => setSearchText(e.target.value)} 
                            value={searchText} 
                            autoFocus
                        />
                        <InputGroupAddon className="pr-3 text-xs text-muted-foreground">
                            {getFilteredList().length} results
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                {/* SCROLLABLE LIST AREA - Uses CSS Grid now */}
                <div className="flex-1 overflow-y-auto p-4 pt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {getFilteredList().map((item) => (
                            <SelectionCard 
                                key={item} 
                                label={item} 
                                selected={list.includes(item)} 
                                toggle={() => handleToggle(item)} 
                            />
                        ))}
                        
                        {getFilteredList().length === 0 && (
                            <div className="col-span-full py-8 text-center text-muted-foreground text-sm">
                                No amenities found matching "{searchText}"
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER: Summary (Optional, adds nice touch) */}
                <div className="border-t bg-gray-50 p-3 flex justify-end">
                    <Button onClick={() => setOpen(false)} size="sm">
                        Done
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}