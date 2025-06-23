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
import { Switch } from './ui/switch';
import { Minus, Plus } from "lucide-react";
import { Input as AriaInput, Button, Group, NumberField, Label as AriaLabel } from "react-aria-components";


type SwitchBoxProp = {
  value: boolean,
  setValue: (oldvalue: boolean) => void,
  label: string | React.ReactNode;
  className?: string;
}

export type NumberBoxProps = {
  label: string | React.ReactNode;
  value: number;
  setValue: (value: number) => void;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
};

type InputType = React.HTMLInputTypeAttribute
interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  type: InputType;
  placeholder?: string;
  disabled?: boolean;
  value: string;
  setValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  identify: string;
  className?: string;
}
type SelectorBoxProps = {
  label: string | React.ReactNode;
  setValue: (value: string, identify: string) => void;
  value: string;
  identify: string;
  ClassName?: string;
  isDisable: boolean;
  options: { value: string; label: string }[];
  defaultValue?: string;

}
export default function InputBox({ label, type, placeholder, disabled = false, setValue, value, identify, className, ...all }: InputBoxProps) {
  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <Label htmlFor={identify} className="text-[1em] font-medium ">
        {label}
      </Label>
      <Input
        id={identify}
        name={identify}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => setValue && setValue(e)}
        size={45}
        {...all}

      />

    </div>
  )
}

export function SelectorBox({ label, setValue, value, identify, ClassName, options, isDisable , defaultValue="None" }: SelectorBoxProps) {
  return (
    <div className={clsx("flex flex-col gap-1", ClassName)}>
      <Label htmlFor={identify} className="text-[1em] font-medium ">
        {label}
      </Label>

      <Select onValueChange={(value) => { setValue(value, identify) }} disabled={isDisable} defaultValue={defaultValue} >
        <SelectTrigger className="">
          <SelectValue placeholder={value.length < 1 ? "None" : value} />
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

export function SwitchBox({ value, setValue, className, label,  }: SwitchBoxProp) {
  return (
    <div className={clsx(" flex gap-1", className)}>
      <Label>{label}</Label>
      <Switch checked={value} onCheckedChange={(e) => setValue(e)} />

    </div>
  )
}


export function NumberBox({
  label = "Number input with plus/minus buttons",
  value,
  setValue,
  min = 1,
  max = 999999,
  step = 1,
  className = "",
  disabled = false,
}: NumberBoxProps) {
  return (
    <NumberField
      value={value}
      minValue={min}
      maxValue={max}
      step={step}
      onChange={setValue}
      isDisabled={disabled}
      className={clsx("" , 
        className, 
      )}
    >
      <div className="space-y-2">
        <AriaLabel className="text-sm font-medium text-foreground">
          {label}
        </AriaLabel>
        <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border bg-background  text-foreground shadow-sm">
          <Button
            slot="decrement"
            className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-sm border-none px-2 transition-colors hover:bg-accent hover:text-accent-foreground"
            isDisabled={disabled || value <= min}
          >
            <Minus size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
          <AriaInput
            className="flex text-center h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
            
            disabled={disabled}
          />
          {/* The increment button is placed after the input field */}
          <Button
            slot="increment"
            className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-sm border-none px-2 transition-colors hover:bg-accent hover:text-accent-foreground"
            isDisabled={disabled || value >= max}
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </Group>
      </div>
    </NumberField>
  );
}
