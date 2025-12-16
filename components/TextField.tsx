import React from "react";
// Import your UI components
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "./ui/input";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const TextField = ({
  label,
  value,
  onChange,
  id,
  type = "text",
  placeholder,
  className,
  required = false,
}: TextFieldProps) => {
  // Generate a safe ID if one isn't provided
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <Field className={`w-full flex flex-col gap-2 ${className || ""}`}>
      <FieldLabel htmlFor={inputId}>
        {label} {required && <span className="text-red-500">*</span>}
      </FieldLabel>
      <Input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        placeholder={placeholder}
        required={required}
      />
    </Field>
  );
};