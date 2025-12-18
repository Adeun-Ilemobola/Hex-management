import React from "react";
// Import your UI components
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { IconEye, IconEyeOff } from "@tabler/icons-react";

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
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Field className={`w-full flex flex-col gap-2 ${className || ""}`}>
      <FieldLabel htmlFor={inputId}>
        {label} {required && <span className="text-red-500">*</span>}
      </FieldLabel>
      <InputGroup>
      <InputGroupInput
        id={inputId}
        type={showPassword ? "text" : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        placeholder={placeholder}
        required={required}
      />

      {type === "password" && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
          aria-label={showPassword ? "Hide password" : "Show password"}
            size={"icon-sm"}
            title="Toggle password visibility"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (<IconEyeOff stroke={2} />): (<IconEye stroke={2} />)}
          </InputGroupButton>
        </InputGroupAddon>
      )}
      </InputGroup>
    </Field>
  );
};