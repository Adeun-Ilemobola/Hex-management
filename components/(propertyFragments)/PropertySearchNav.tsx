"use client"
import React, { useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { PackagePlus, SearchCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import InputBtu from '../InputBtu'
import { Button } from '../ui/button'
interface PropertySearchNavProps {
    onSubmit: (data: { status: string | null, searchText: string | null }) => void
    changeMode?: (mode: boolean) => void
    mode?: boolean

}

const Status = [
    { name: "Active", color: "text-green-600 dark:text-green-400" },
    { name: "Inactive", color: "text-gray-500 dark:text-gray-400" },
    { name: "Renovation", color: "text-yellow-600 dark:text-yellow-400" },
    { name: "Developing", color: "text-blue-600 dark:text-blue-400" },
    { name: "Purchase Planning", color: "text-purple-600 dark:text-purple-400" },

]

export default function PropertySearchNav({ onSubmit, changeMode, mode }: PropertySearchNavProps) {
    const router = useRouter()
    const [search, setSearch] = useState({
        status: "",
        searchText: ""
    })
    return (
        <div className=" w-full h-14 flex flex-row-reverse gap-2  items-center pr-2">
            {/* Search input (submits with current status) */}
            <InputBtu
                onSubmit={(value) =>
                    onSubmit({
                        status: search.status ? search.status : null,
                        searchText: value.length ? value : null,
                    })
                }
                icon={<SearchCheck className="h-5 w-5" />}
            />

            {/* Status filter */}
            <Select
                value={search.status || undefined} // undefined => shows placeholder
                onValueChange={(val) =>
                    setSearch((prev) => ({ ...prev, status: val === "None" ? "" : val }))
                }
            >
                <SelectTrigger className="w-[200px] rounded-xl bg-white/70 dark:bg-gray-900/60
                           focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-blue-500/40">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent className="rounded-xl">
                    {Status.map((s) => (
                        <SelectItem key={s.name} value={s.name} className="py-2">
                            <span className="inline-flex items-center gap-2">
                                <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} aria-hidden />
                                <span className={s.color}>{s.name}</span>
                            </span>
                        </SelectItem>
                    ))}

                    {/* Clear option */}
                    <SelectItem value="None" className="py-2">
                        <span className="text-gray-500 dark:text-gray-400">Clear status</span>
                    </SelectItem>
                </SelectContent>
            </Select>

            {/* Mode switch */}
            <div className=" mr-1 flex flex-row items-center gap-2">
                <Label htmlFor="mode-switch" className="text-sm font-semibold">
                    Change Mode
                </Label>
                <Switch
                    id="mode-switch"
                    checked={!!mode}
                    onCheckedChange={(checked) => changeMode?.(!!checked)}
                    className="ml-1"
                />
            </div>

            {/* Add property */}
            <Button
                type="button"
               
                variant="ghost"
                onClick={() => {
                    router.push("/home/propertie-mp"); // keep your route; adjust if this was a typo
                }}
                className="
          rounded-xl hover:scale-105 transition
          focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-purple-500/40
        "
                aria-label="Add new property"
                title="Add new property"
            >
                <PackagePlus size={22} strokeWidth={1.8} className="hover:text-cyan-700" />
                Add new property
            </Button>
        </div>
    );
}
