"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
interface PropertySearchNavProps {
    onSubmit: (data: { status: string, searchText: string }) => void
    changeMode ?: (mode: boolean) => void
    mode?: boolean

}

const Status = [
    { name: "Active", Colour: "text-green-500 dark:text-green-400" },
    { name: "Inactive", Colour: "text-gray-400 dark:text-gray-500" },
    { name: "Renovation", Colour: "text-yellow-600 dark:text-yellow-400" },
    { name: "Developing", Colour: "text-blue-500 dark:text-blue-400" },
    { name: "Purchase Planning", Colour: "text-purple-600 dark:text-purple-400" }
]


export default function PropertySearchNav({ onSubmit , changeMode ,mode }: PropertySearchNavProps) {
    const [search, setSearch] = useState({
        status: "",
        searchText: ""
    })
    return (
        <div className=' flex flex-row-reverse gap-2 w-full h-12 items-center '>
            <Button className=' mr-1.5' onClick={() => {
                onSubmit(search)
                setSearch({
                    status: "",
                    searchText: ""

                })

            }}>
                Search
            </Button>
            <Input
                placeholder='Search by name'
                className=' w-[290px]'
                value={search.searchText}
                onChange={(e) => setSearch(pre => ({ ...pre, searchText: e.target.value }))}

            />
            <Select value={search.status} defaultValue={search.status} onValueChange={(e) => setSearch(pre => ({ ...pre, status: e }))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    {Status.map((s, i) => (<SelectItem key={i} value={s.name} className={`${s.Colour}`}>{s.name}</SelectItem>))}
                </SelectContent>
            </Select>

            <div className=' flex flex-row items-center gap-2'>
                <Label htmlFor='mode-switch' className=' text-sm font-semibold'>Change Mode</Label>
                <Switch
                    className=' ml-2'
                    onCheckedChange={(e) => {
                        if (changeMode) changeMode(e)
                    }}
                    defaultChecked={false}
                    checked={mode}
                    id="mode-switch"
                />
            </div>



        </div>
    )
}
