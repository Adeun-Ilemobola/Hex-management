import React from 'react'
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
                // Base Layout & Transitions
                "group cursor-pointer select-none rounded-md px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center justify-between relative overflow-hidden",
                
                selected 
                    ? clsx(
                        // --- GLASSMORPHIC SELECTED STATE ---
                        "bg-primary/10",               
                        "backdrop-blur-md",            
                        "border border-primary/50",    
                        "text-primary",               
                        "ring-2 ring-primary ring-offset-2 ring-offset-background", 
                        "shadow-lg shadow-primary/10"  
                      )
                    : clsx(
                        // --- DEFAULT STATE ---
                        "bg-card",                     
                        "border border-border",      
                        "text-card-foreground",
                        // Hover Effects
                        "hover:bg-accent hover:text-accent-foreground hover:border-primary/30"
                      )
            )}
        >
            {/* Optional: Subtle Glass Shine/Gradient for extra "Metamorphic" feel */}
            {selected && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-50 dark:via-white/5" />
            )}

            <span className="truncate mr-2 relative z-10">{label}</span>
            
            {selected && (
                <div className="relative z-10 rounded-full bg-primary/20 p-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
                </div>
            )}
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

    const handleToggle = (name: string) => {
        if (list.includes(name)) {
            updtate(list.filter((item) => item !== name));
        } else {
            updtate([...list, name]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Overlay: Changed to standard background/80 for proper dimming in both modes */}
            <DialogOverlay
                className="bg-black/40 backdrop-blur-sm"
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
                // bg-background is usually default, but added here to be safe
                className="flex flex-col gap-4 max-w-2xl max-h-[85vh] p-0 overflow-hidden bg-background border-border"
            >
                {/* HEADER SECTION */}
                {/* Replaced border-b with border-border */}
                <div className="flex flex-col gap-4 border-b border-border p-4 pb-6">
                    <div className="flex items-center justify-between">
                         <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
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
                        {/* Ensure text color adapts with text-foreground */}
                        <InputGroupInput 
                            placeholder="Search amenities..." 
                            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 text-foreground placeholder:text-muted-foreground"
                            onChange={(e) => setSearchText(e.target.value)} 
                            value={searchText} 
                            autoFocus
                        />
                        <InputGroupAddon className="pr-3 text-xs text-muted-foreground">
                            {getFilteredList().length} results
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                {/* SCROLLABLE LIST AREA */}
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

                {/* FOOTER */}
                {/* Replaced border-t with border-border */}
                <div className="border-t border-border p-3 flex justify-end">
                    <Button onClick={() => setOpen(false)} size="sm">
                        Done
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}