"use client"
import React, { useState } from 'react'
import { Check, SearchIcon } from "lucide-react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PackagePlus, SearchCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from './ui/checkbox'
import Link from 'next/link'
interface PropertySearchNavProps {
    onSubmit: (data: { status: string | null, searchText: string | null }) => void
    changeMode?: (mode: boolean) => void
    mode?: boolean

}


export default function PropertySearchNav({onSubmit, changeMode, mode}: PropertySearchNavProps) {
    const router = useRouter()
    const [search, setSearch] = useState({
        status: "",
        searchText: ""
    })
  return (
    <div className=' w-full flex flex-row-reverse  gap-2.5 items-center'>
        <ButtonGroup>
      <Input placeholder="Search..." value={search.searchText} onChange={(e) => setSearch({...search, searchText: e.target.value})} />
      <Button variant="outline" aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>

    <div className=' flex flex-row gap-1.5 items-center'>
        <Checkbox 
         checked={mode}
         onCheckedChange={changeMode}
        />
        <label>Edit Mode</label>
    </div>

    <Link href="/home/propertie/new">
     <Button>Creat Property</Button>
    </Link>

       
        
    </div>
  )
}
