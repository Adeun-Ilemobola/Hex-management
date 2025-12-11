"use client"
import { DateTime } from "luxon";

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import clsx from 'clsx';
import { Label } from "./ui/label"
import { ChevronDownIcon } from "lucide-react"
interface DatePickerProps {
    className?: string,
    onChange?: (newData: string) => void,
    value: string | undefined

}

export function DatePicker({ className, value, onChange }: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const date = DateTime.fromISO(value ?? "").toJSDate()

  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      <Label htmlFor="date" className="px-1">
        Date of birth
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (onChange && date) {
                onChange(date.toISOString())
                 setOpen(false)
              }
             
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
