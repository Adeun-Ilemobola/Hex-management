import React from 'react'
import { Label } from './ui/label'
import clsx from 'clsx';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type InputType = React.HTMLInputTypeAttribute
interface InputBoxProps {
    label: string;
    type: InputType;
    placeholder: string;
    isDisable: boolean;

    setValue: (value: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    identify: string;
    ClassName?: string;
}
type SelectorBoxProps = {
   label: string;
   setValue: (value: string , identify:string) => void;
   value: string;
   identify: string;
   ClassName?: string;
     isDisable: boolean;
   options: { value: string; label: string }[];

}


export default function InputBox({label , type ,placeholder , isDisable =false ,setValue , value ,identify , ClassName}: InputBoxProps) {
  return (
    <div className={clsx("flex flex-col gap-1", ClassName)}>
        <Label htmlFor={identify} className="text-[1em] font-medium ">
            {label}
        </Label>
        <Input
            id={identify}
            name={identify}
            type={type}
            placeholder={placeholder}
            disabled={isDisable}
            value={value}
            onChange={(e) => setValue(e)}
            size={45}
            
        
        />

    </div>
  )
}




export function SelectorBox({label , setValue , value ,identify , ClassName , options  , isDisable}: SelectorBoxProps) {
  return (
    <div className={clsx("flex flex-col gap-1", ClassName)}>
        <Label htmlFor={identify} className="text-[1em] font-medium ">
            {label}
        </Label>

        <Select onValueChange={(value)=>{setValue(value ,identify)}} disabled={isDisable} defaultValue={"None"} >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={value.length < 1 ? "None" :value} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
        
    </div>
  )
}
