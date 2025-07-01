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
import { Minus, Plus } from 'lucide-react';
import {
  Input as AriaInput,
  Button,
  Group,
  NumberField,
  Label as AriaLabel,
} from 'react-aria-components';

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

type InputType = React.HTMLInputTypeAttribute;
interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  type?: InputType;
  placeholder?: string;
  disabled?: boolean;
  value: string;
  setValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  identify?: string;
  className?: string;
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

export default function InputBox({
  label,
  type,
  placeholder,
  disabled = false,
  setValue,
  value,
  identify,
  className,
  ...all
}: InputBoxProps) {
  return (
    <div className={clsx('flex flex-col space-y-1 w-full', className)}>
      <Label htmlFor={identify} className='text-sm font-semibold '>
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
        className='w-full rounded-lg'
        {...all}
      />
    </div>
  );
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
          <Button
            slot="decrement"
            className="flex-none aspect-square items-center justify-center px-2 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            isDisabled={disabled || value <= min}
          >
            <Minus size={16} strokeWidth={2} aria-hidden="true" />
          </Button>

          {/* Flexible input: shrinks below content width */}
          <AriaInput
            className="flex-1 min-w-0 text-center px-3 py-2 text-sm border-none bg-transparent focus:outline-none"
            disabled={disabled}
          />

          <Button
            slot="increment"
            className="flex-none aspect-square items-center justify-center px-2 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            isDisabled={disabled || value >= max}
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </Group>
      </div>
    </NumberField>
  );
}
