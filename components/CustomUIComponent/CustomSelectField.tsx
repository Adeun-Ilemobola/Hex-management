import {
  Field,
  FieldDescription,
  FieldLabel,
  // FieldError // Assuming you might have this in your Field definition
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define the shape of your items
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface FieldSelectProps {
  // Core Data
  name?: string
  label: string
  placeholder?: string
  description?: string
  
  // State Management
  value: string
  items: SelectOption[]
  onValueChange: (value: string) => void

  // Styling / Layout
  className?: string
  disabled?: boolean
}


export function FieldSelect({
  name,
  label,
  placeholder = "Select an option",
  description,
  value,
  items,
  onValueChange,
  className = "w-full max-w-md",
  disabled = false,
}: FieldSelectProps) {
  return (
    <div className={className}>
      <Field>
        <FieldLabel htmlFor={name ?? label.toLowerCase().replace(/\s+/g, "-")}>{label}</FieldLabel>
        
        <Select 
          name={name ?? label.toLowerCase().replace(/\s+/g, "-")}
         
          value={value} 
          onValueChange={onValueChange} 
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem 
               value={item.value} 
               key={item.value} 
              disabled={item.disabled || false}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {description && (
          <FieldDescription>
            {description}
          </FieldDescription>
        )}
      </Field>
    </div>
  )
}