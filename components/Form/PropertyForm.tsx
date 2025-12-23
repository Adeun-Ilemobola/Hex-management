import { OwnerTypeEnum, PropertyInput } from '@/lib/ZodObject';
import { nanoid } from 'nanoid'
import { useState } from "react"
import { Building2, Check, Loader2 } from "lucide-react" // Assuming you use lucide-react
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogOverlay, // Import Overlay to style it
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils" // Or your clsx/tailwind-merge utility
import React from 'react'
import {
    Field,
    FieldLabel,
    FieldLegend,

} from "@/components/ui/field"

import {
    ButtonGroup,

} from "@/components/ui/button-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import z from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { MultiSelector } from '../CustomUIComponent/selNode';
import { amenitiesItems } from '@/lib/mock-data';
import FileList from '@/components/CustomUIComponent/FileList';
import { TextField } from '@/components/CustomUIComponent/TextField';
import { NumberStepper } from '@/components/CustomUIComponent/NumberStepper';
interface OwnershipConfigProps {
    data: org[];
    loading: boolean;
    disabled: boolean;
    SelectedID: string 
    handleSelectOrg(id: string, type: "USER" | "ORGANIZATION"): void
    reLoad: () => void
}

const propertyTypeOptions = [
    { value: "House", label: "House" },
    { value: "Apartment", label: "Apartment" },
    { value: "Condo", label: "Condo" },
    { value: "Commercial", label: "Commercial" },
    { value: "Other", label: "Other" },
];

const statusOptions = [
    { value: "active", label: "active" },
    { value: "pending", label: "pending" },
    { value: "sold", label: "sold" },
];
type org = {
    id: string;
    name: string;
    selected: boolean
    type: z.infer<typeof OwnerTypeEnum>
}
type Props = {
    propertyInfo: PropertyInput;
    setPropertyInfo: React.Dispatch<React.SetStateAction<PropertyInput>>;
    disable: boolean;
    handleSSubscriptionRequirement: () => number;
    RemoveImage: (id: string, supabaseID: string) => void;
    orgInfo: {
        data: org[],
        loading: boolean;
        userId: string;
        refetch?: () => void
        showOwnershipConfig: boolean;
        disabled: boolean
        handleSelectOrg(id: string, type: "USER" | "ORGANIZATION"): void,
        SelectedID: string



    }
}


export default function PropertyForm({ propertyInfo, setPropertyInfo, disable,  orgInfo }: Props) {
    const [amenitiesOpen, setAmenitiesOpen] = React.useState<boolean>(false)

    const handleField = (
        field: keyof PropertyInput,
        val: string | boolean | number,
        type?: "number"
    ) => {
        setPropertyInfo((prev) => ({
            ...prev,
            [field]: type === "number" ? Number(val) : val,
        }));
    };
    // function handleSelectOrg(id: string, type: z.infer<typeof OwnerTypeEnum>) {
    //     setPropertyInfo((prev) => ({
    //         ...prev,
    //         ownerId: id,
    //         ownerType: type
    //     }));
    // }


    //    w-full max-w-5xl mx-auto


    return (
        <div className=" p-4 flex flex-col gap-7">

            {/* --- SECTION 1: PROPERTY DETAILS --- */}
            <section className="flex flex-col gap-4">
                <FieldLegend className="text-2xl font-semibold border-b dark:border-b-neutral-100 pb-2">
                    Property Information
                </FieldLegend>

                {/* Row 1: Name and Address (2 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <TextField
                        label="Name"
                        type="text"
                        value={propertyInfo.name}
                        onChange={(e) => handleField("name", e)}
                        className="w-full"

                    />

                    <TextField
                        label="Address"
                        type="text"
                        value={propertyInfo.address}
                        onChange={(e) => handleField("address", e)}
                        className="w-full"
                    />
                </div>

                {/* Row 2: Type, Status, Year (3 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Field className="w-full flex flex-col gap-2">
                        <FieldLabel htmlFor="propertyType">Property Type</FieldLabel>
                        <Select
                            value={propertyInfo.propertyType}
                            onValueChange={(val) => handleField("propertyType", val)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Property Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {propertyTypeOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field className="w-full flex flex-col gap-2">
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                        <Select
                            value={propertyInfo.status}
                            onValueChange={(val) => handleField("status", val)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field className="w-full flex flex-col gap-2">
                        <FieldLabel htmlFor="yearBuilt">Built Year</FieldLabel>
                        <ButtonGroup className="w-full flex">
                            <Button variant="outline" size="icon" onClick={() => {
                                handleField("yearBuilt", String((Number(propertyInfo.yearBuilt) - 1) < 0 ? 0 : Number(propertyInfo.yearBuilt) - 1), "number")
                            }}>
                                <MinusIcon />
                            </Button>
                            <Input
                                placeholder="Year"
                                className="text-center"
                                id="yearBuilt"
                                type="number"
                                value={propertyInfo.yearBuilt}
                                onChange={(e) => handleField("yearBuilt", e.target.value, "number")}
                            />
                            <Button variant="outline" size="icon" onClick={() => {
                                handleField("yearBuilt", String(Number(propertyInfo.yearBuilt) + 1), "number")
                            }}>
                                <PlusIcon />
                            </Button>
                        </ButtonGroup>
                    </Field>
                </div>
            </section>

            {/* --- SECTION 2: FLOOR PLAN & SPECS --- */}
            <section className="flex flex-col gap-4">
                <FieldLegend className="text-xl font-semibold border-b  dark:border-b-neutral-100 pb-2">
                    Floor Plan Attributes
                </FieldLegend>

                {/* Grid for Counts: 4 Columns (Bed, Bath, SqFt, Lot) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                    {/* Bedroom */}
                    <NumberStepper
                        label="Bathrooms"
                        value={propertyInfo.numBathrooms}
                        onChange={(val) => handleField("numBathrooms", val, "number")}
                        disabled={disable}
                    />

                    {/* Bathroom */}
                    <NumberStepper
                        label="Bedrooms"
                        value={propertyInfo.numBedrooms}
                        onChange={(val) => handleField("numBedrooms", val, "number")}
                        disabled={disable}
                    />


                    {/* Square Footage */}
                    <NumberStepper
                        label="Square Footage"
                        value={propertyInfo.squareFootage}
                        onChange={(val) => handleField("squareFootage", val, "number")}
                        disabled={disable}
                    />

                    {/* Lot Size */}
                    <NumberStepper
                        label="Lot Size"
                        value={propertyInfo.lotSize}
                        onChange={(val) => handleField("lotSize", val, "number")}
                        disabled={disable}
                    />
                </div>
            </section>

            {/* --- SECTION 3: EXTRAS (Amenities & Access Code) --- */}
            <section className="grid grid-rows-1 md:grid-rows-2 gap-3">

                <Field className="w-full flex flex-col gap-2">
                    <FieldLabel htmlFor="amenities">Amenities</FieldLabel>
                    <MultiSelector
                        list={propertyInfo.amenities}
                        defaultList={amenitiesItems.map(a => (a.value))}
                        updtate={(data) => {
                            setPropertyInfo((prev) => ({
                                ...prev,
                                amenities: data
                            }))
                        }}
                        open={amenitiesOpen}
                        setOpen={setAmenitiesOpen}
                    />
                </Field>

                <div className=' flex flex-row items-center gap-1.5'>
                    <Field className="w-full flex flex-col gap-2">
                        <FieldLabel>Access Code</FieldLabel>
                        <Card className="w-full shadow-sm border">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex-1">
                                    {propertyInfo.accessCode.length > 0 ? (
                                        <h1 className="text-xl font-mono font-bold tracking-wider">
                                            {propertyInfo.accessCode}
                                        </h1>
                                    ) : (
                                        <span className="text-gray-400 italic">No code generated</span>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={() => {
                                        setPropertyInfo((prev) => ({
                                            ...prev,
                                            accessCode: nanoid(12)
                                        }))
                                    }}
                                >
                                    {propertyInfo.accessCode.length > 0 ? "Regenerate" : "Generate"}
                                </Button>
                            </CardContent>
                        </Card>
                    </Field>

                    <Field className="w-full flex flex-col gap-2">
                        <FieldLabel htmlFor="accessCode">Ownership</FieldLabel>
                        <OwnershipConfig
                            data={orgInfo.data}
                            loading={orgInfo.loading}
                            handleSelectOrg={orgInfo.handleSelectOrg}
                            disabled={false}
                            SelectedID={orgInfo.SelectedID}
                            reLoad={() => orgInfo.refetch && orgInfo.refetch()}
                        />
                    </Field>

                </div>



            </section>

            {/* --- SECTION 4: IMAGES --- */}
            <section className="w-full">
                <FieldLegend className="mb-2 block">Property Images</FieldLegend>
                <FileList
                    fileList={propertyInfo.images}
                    onChange={(files) => {
                        setPropertyInfo((prev) => ({
                            ...prev,
                            images: files
                        }))
                    }}
                    disabled={false}
                />
            </section>

        </div>
    )



}



function OwnershipConfig({ data, loading, handleSelectOrg, disabled , SelectedID  , reLoad    }: OwnershipConfigProps) {
    const [showConfidential, setShowConfidential] = useState(false);

    // Helper to get current owner name safely
    const currentOwner = data.find((org) => org.id === SelectedID);

    return (
        <>
            {/* --- MAIN DISPLAY CARD --- */}
            <div className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border bg-card text-card-foreground shadow-sm transition-all",
                disabled && "opacity-60 grayscale"
            )}>
                <div className="flex items-center gap-4">
                    {/* Icon Box */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Building2 className="h-6 w-6" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            Current Owner
                        </p>
                        <p className="text-lg font-bold tracking-tight text-foreground">
                            {currentOwner?.name || "No owner selected"}
                        </p>
                        {currentOwner && (
                            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                {currentOwner.type}
                            </span>
                        )}
                    </div>
                </div>

                <Button
                    variant="outline"
                    onClick={() => {
                        setShowConfidential(true)
                        reLoad()
                    }
                        
                    }
                    className="w-full sm:w-auto min-w-[140px]"
                    disabled={disabled}
                >
                    {currentOwner ? "Transfer Ownership" : "Assign Owner"}
                </Button>
            </div>


            {/* --- SELECTION DIALOG --- */}
            <Dialog open={showConfidential} onOpenChange={setShowConfidential}>
                {/* Standard clean overlay (black/20 with blur) */}
                <DialogOverlay className="bg-black/20 backdrop-blur-sm" />

                <DialogContent className="max-w-md gap-0 p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b">
                        <DialogTitle>Select Owner</DialogTitle>
                        <DialogDescription>
                            Choose the organization or individual who owns this property.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                        {loading ? (
                            // Loading State
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm">Loading organizations...</p>
                            </div>
                        ) : data.length === 0 ? (
                            // Empty State
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                                <Building2 className="h-10 w-10 opacity-20" />
                                <p>No organizations found.</p>
                            </div>
                        ) : (
                            // List State
                            <div className="grid gap-2">
                                {data.map((org) => {
                                    const isSelected = SelectedID === org.id;
                                    return (
                                        <div
                                            key={org.id || org.name} // Prefer ID if available
                                            onClick={() => handleSelectOrg(org.id, org.type)}
                                            className={cn(
                                                "group relative flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all hover:bg-accent",
                                                isSelected
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            {/* Custom Radio/Check Indicator */}
                                            <div className={cn(
                                                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                                                isSelected
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-muted-foreground/30 group-hover:border-primary/50"
                                            )}>
                                                {isSelected && <Check className="h-3 w-3" />}
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <p className={cn("text-sm font-medium leading-none", isSelected ? "text-primary" : "text-foreground")}>
                                                    {org.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {org.type}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Optional Footer if you want a Close button */}
                    <div className="bg-muted/50 p-4 flex justify-end border-t">
                        <Button variant="ghost" size="sm" onClick={() => setShowConfidential(false)}>Cancel</Button>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}
