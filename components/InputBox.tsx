"use client"
import React from 'react';

import { Label } from './ui/label';
import clsx from 'clsx';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from './ui/switch';
import { Eye, EyeClosed, Minus, Plus } from 'lucide-react';
import {
  Input as AriaInput,
  Button as AriaButton,
  Group,
  NumberField,
  Label as AriaLabel,
} from 'react-aria-components';
import { Button } from './ui/button';
import MultipleSelector from './MultipleSelector';
import { Textarea } from './ui/textarea';

type SwitchBoxProp = {
  value: boolean;
  setValue: (oldvalue: boolean) => void;
  label: string | React.ReactNode;
  className?: string;
};

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

export interface InputBoxProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    type?: string;
    disabled?: boolean;
    maxLength?: number;
    readOnly?: boolean;
    inputRef?: React.RefObject<HTMLInputElement>;
    label?: string | React.ReactNode;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

}
type SelectorBoxProps = {
  label: string | React.ReactNode;
  setValue: (value: string) => void;
  value: string;
  identify?: string;
  ClassName?: string;
  isDisable: boolean;
  options: { value: string; label: string }[];
  defaultValue?: string;
};

export default function InputBox({ className, value, onChange, label, disabled ,type , ...other }: InputBoxProps) {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
        <div className={clsx("flex flex-col gap-2.5 justify-center min-w-20", className)}>
            {label && <Label  className=" ml-1">{label}</Label>}
            <div className=' flex flex-row  gap-2'>
                <Input
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                type={type === 'password' ? (showPassword ? "text" : "password"): type || 'text'}
                {...other}
            />
                {type === 'password' && (
                    <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        variant={"secondary"}

                        size={"icon"}
                       
                    >
                        {showPassword ? ( <EyeClosed  />): (<Eye />)}
                    </Button>
                )}
            </div>
            

        </div>
    )
}

export function SelectorBox({
  label,
  setValue,
  value,
  identify,
  ClassName,
  options,
  isDisable,
  defaultValue = 'None',
}: SelectorBoxProps) {
  return (
    <div className={clsx('flex flex-col space-y-1 ', ClassName)}>
      <Label htmlFor={identify} className='text-sm font-semibold'>
        {label}
      </Label>

      <Select
        onValueChange={(val) => setValue(val)}
        disabled={isDisable}
        defaultValue={defaultValue}
      >
        <SelectTrigger className='w-full rounded-lg'>
          <SelectValue
            placeholder={value.length < 1 ? defaultValue : value}
          />
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
  );
}

export function SwitchBox({ value, setValue, className, label }: SwitchBoxProp) {
  return (
    <div className={clsx('flex items-center space-x-2', className)}>
      <Label className='text-sm font-medium'>
        {label}
      </Label>
      <Switch
        checked={value}
        onCheckedChange={(e) => setValue(e)}
        className='0'
      />
    </div>
  );
}

export function NumberBox({
  label = 'Number input with plus/minus buttons',
  value,
  setValue,
  min = 1,
  max = 999999,
  step = 1,
  className = '',
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
    >
      {/* Outer wrapper: controls width, allows shrinking in parent flex */}
      <div className={clsx('flex flex-col space-y-1 min-w-0', className)}>
        <AriaLabel className="text-sm font-semibold ">
          {label}
        </AriaLabel>

        {/* Frame: fills wrapper width, allows inner items to shrink */}
        <Group className="inline-flex items-center w-full min-w-0 rounded-lg border">
          <AriaButton
            slot="decrement"
            className="flex-none aspect-square items-center justify-center px-2 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            isDisabled={disabled || value <= min}
          >
            <Minus size={16} strokeWidth={2} aria-hidden="true" />
          </AriaButton>

          {/* Flexible input: shrinks below content width */}
          <AriaInput
            className="flex-1 min-w-0 text-center px-3 py-2 text-sm border-none bg-transparent focus:outline-none"
            disabled={disabled}
          />

          <AriaButton
            slot="increment"
            className="flex-none aspect-square items-center justify-center px-2 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            isDisabled={disabled || value >= max}
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
          </AriaButton>
        </Group>
      </div>
    </NumberField>
  );
}





export function MultiSelectorBox({
    className,
    value,
    onChange,
    label,
    options,
    disabled,
    placeholder = "Select options",
}: {
    className?: string;
    value?: string[];
    onChange?: (value: string[]) => void;
    label?: string | React.ReactNode;
    options: { value: string; label: string }[];
    disabled?: boolean;
    placeholder?: string;
}) {
    return (
        <div className={clsx("flex flex-col gap-1 justify-center min-w-20", className)}>
            {label && <Label className="ml-1">{label}</Label>}
           <MultipleSelector
                value={value?.map(v => ({ value: v, label: v }))}
                onChange={(selected) => onChange?.(selected.map(s => s.value))}
                options={options}
                disabled={disabled}
                creatable
                placeholder={placeholder}
                emptyIndicator={<p className="text-gray-500 text-sm">
                    No options available. Please add some.
                </p>}
           />
        </div>
       
    );
}

export function TextAreaBox({
    className,
    value,
    onChange,
    label,
    disabled,
    placeholder = "Enter text here...",
}: {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    label?: string | React.ReactNode;
    disabled?: boolean;
    placeholder?: string;
}) {
    return (
        <div className={clsx("flex flex-col gap-1 justify-center min-w-20", className)}>
            {label && <Label className="ml-1">{label}</Label>}
            <Textarea
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                placeholder={placeholder}
                className='w-full flex-1 resize-none'
              
            />
        </div>
    );
}