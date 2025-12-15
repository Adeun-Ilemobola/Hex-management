import React from "react";
// Import your UI components and Icons here
import { MinusIcon, PlusIcon } from "lucide-react"; 
import {
    Field,
    FieldLabel,
    FieldLegend,
   
} from "@/components/ui/field"
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Input } from "./ui/input";

interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  className?: string;
  disabled?: boolean
}

export const NumberStepper = ({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  id,
  className,
  disabled=false
}: NumberStepperProps) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    // basic validation to ensure it is a number
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <Field className={`w-full flex flex-col gap-2 ${className || ""}`}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <ButtonGroup className="w-full flex">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min || disabled}
          type="button" // Prevent form submission
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        
        <Input
          id={inputId}
          type="number"
          className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder={label}
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          
          disabled={disabled}
        />

        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={( max !== undefined && value >= max) || disabled}
          type="button" // Prevent form submission
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </ButtonGroup>
    </Field>
  );
};