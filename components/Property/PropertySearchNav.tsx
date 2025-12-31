"use client"
import  { useState } from 'react'
import {  SearchIcon } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'sonner'
interface PropertySearchNavProps {
    onSubmit: (data: { status: string | null, searchText: string | null }) => void
    changeMode?: (mode: boolean) => void
    mode?: boolean,
    allowed: {
        allowed: boolean
        message: string
    }

}


export default function PropertySearchNav({onSubmit, changeMode, mode , allowed}: PropertySearchNavProps) {
    const router = useRouter()
    const [search, setSearch] = useState({
        status: "",
        searchText: ""
    })
  return (
    <div className=' w-full flex flex-row-reverse  gap-2.5 items-center'>
        <ButtonGroup>
      <Input placeholder="Search..." value={search.searchText} onChange={(e) => setSearch({...search, searchText: e.target.value})} />
      <Button variant="outline" onClick={() => onSubmit({status: search.status, searchText: search.searchText})} aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>

    <div className=' flex flex-row gap-1.5 items-center'>
        <Checkbox 
        checked={mode || false}
        onCheckedChange={(e) => changeMode && changeMode(e === "indeterminate" ? true : e)}
         />
        <label>Edit Mode</label>
    </div>

  
     <Button
     onClick={()=>{
        if(!allowed.allowed){
          toast.error(`${allowed.message}`)
            return
        }

        router.push("/home/propertie/new")
     }}
     >Creat Property</Button>
   

       
        
    </div>
  )
}
