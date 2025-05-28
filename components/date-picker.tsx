"use client"

import { format, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
    className?: string,
    onChange?: (newData: string) => void,
    value: string | undefined

}

export function DatePicker({ className, value, onChange }: DatePickerProps) {
    let date: Date | undefined;
    if (value) {
        const parsed = new Date(value);
        if (isValid(parsed)) date = parsed;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(" justify-start  !max-w-[195px]", !date && "text-muted-foreground", className)}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single"
                    selected={date}
                    onSelect={(d:Date | undefined) => {
                        if (d && onChange) {
                            onChange(d.toISOString())
                        }

                    }}
                    
                    initialFocus />
            </PopoverContent>
        </Popover>
    )
}
