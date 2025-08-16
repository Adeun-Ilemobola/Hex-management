"use client"
import { amenitiesItems, ownerTypeT, PropertyInput } from "@/lib/Zod";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import InputBox, {
  MultiSelectorBox,
  NumberBox,
  SelectorBox,
  SwitchBox,
  TextAreaBox,
} from "../InputBox";
import { Button } from "../ui/button";
import { ImgBoxList } from "../ImgBox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "../ui/label";
type org = {
  id: string;
  name: string;
  selected:boolean
  type: ownerTypeT
}
interface PropertyGIFProps {
  propertyInfo: PropertyInput;
  setPropertyInfo: React.Dispatch<React.SetStateAction<PropertyInput>>;
  disable: boolean;
  handleSSubscriptionRequirement: () => 5 | 35 | 100;
  RemoveImage: (id: string, supabaseID: string) => void;
  orgInfo: {
    data: org[],
    loading: boolean;
    userId: string;
    refetch?: () => void
    showOwnershipConfig: boolean;

  }
}

export default function PropertyGIF({
  propertyInfo,
  setPropertyInfo,
  disable,
  handleSSubscriptionRequirement,
  RemoveImage,
  orgInfo
}: PropertyGIFProps) {
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
  function handleSelectOrg(id: string, type: ownerTypeT) {
    setPropertyInfo((prev) => ({
      ...prev,
      ownerId: id,
      ownerType: type
    }));
  }

  return (
    <div className="w-full px-3 sm:px-4">
      {/* 12-col responsive layout: stacks on mobile, two columns from lg up */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Forms */}
        <section className="lg:col-span-6 space-y-8 min-w-0">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold border-b border-border pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputBox
                label="Property Name"
                value={propertyInfo.name}
                disabled={disable}
                onChange={(e) => handleField("name", e)}
              />
              <InputBox
                label="Address"
                value={propertyInfo.address}
                disabled={disable}
                onChange={(e) => handleField("address", e)}
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold border-b border-border pb-2">
              Property Details
            </h3>
            {/* Counts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <NumberBox
                label="Bedrooms"
                value={propertyInfo.numBedrooms}
                disabled={disable}
                setValue={(val) => handleField("numBedrooms", val, "number")}
              />
              <NumberBox
                label="Bathrooms"
                value={propertyInfo.numBathrooms}
                disabled={disable}
                setValue={(val) => handleField("numBathrooms", val, "number")}
              />
              <NumberBox
                label="Lot Size"
                value={propertyInfo.lotSize}
                disabled={disable}
                setValue={(val) => handleField("lotSize", val, "number")}
              />
              <NumberBox
                label="Sq. Footage"
                value={propertyInfo.squareFootage}
                disabled={disable}
                setValue={(val) => handleField("squareFootage", val, "number")}
              />
            </div>

            {/* Amenities + Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MultiSelectorBox
                label="Property Features"
                options={amenitiesItems}
                value={propertyInfo.amenities}
                disabled={disable}
                onChange={(val) => {
                  setPropertyInfo((prev) => ({ ...prev, amenities: val }));
                }}
              />
              <NumberBox
                label="Year Built"
                value={propertyInfo.yearBuilt}
                disabled={disable}
                setValue={(val) => handleField("yearBuilt", val, "number")}
              />
            </div>
          </div>

          {/* Property Type & Status */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold border-b border-border pb-2">
              Type & Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectorBox
                label="Property Type"
                options={propertyTypeOP}
                value={propertyInfo.propertyType}
                isDisable={disable}
                setValue={(val) => handleField("propertyType", val)}
              />
              <SelectorBox
                label="Status"
                options={typeOfSaleOP}
                value={propertyInfo.status}
                isDisable={disable}
                setValue={(val) => handleField("status", val)}
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold border-b border-border pb-2">
              Features
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
              <SwitchBox
                label="Pool"
                value={propertyInfo.hasPool}
                setValue={(val) => handleField("hasPool", val)}
              />
              <SwitchBox
                label="Garden"
                value={propertyInfo.hasGarden}
                setValue={(val) => handleField("hasGarden", val)}
              />
              <SwitchBox
                label="Garage"
                value={propertyInfo.hasGarage}
                setValue={(val) => handleField("hasGarage", val)}
              />
            </div>
          </div>

          {/* Access Code */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold border-b border-border pb-2">
              Access Code
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-muted/30 border-border/60">
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Current Access Code
                </p>
                <p className="text-lg sm:text-xl font-mono font-bold tracking-wider">
                  {propertyInfo.accessCode}
                </p>
              </div>
              <Button
                onClick={() => {
                  setPropertyInfo((prev) => ({
                    ...prev,
                    accessCode: nanoid(12),
                  }));
                }}
                className="h-11 w-full sm:w-auto"
                aria-label="Generate new access code"
              >
                Generate New Code
              </Button>
            </div>
          </div>
        </section>

        {/* RIGHT: Media + Description */}
        <section className="lg:col-span-6 space-y-6 min-w-0">
          <div className="w-full">
            <ImgBoxList
              className="w-full "
              fileList={propertyInfo.images}
              disabled={disable}
              setData={(list) =>
                setPropertyInfo((prev) => ({
                  ...prev,
                  images: [...prev.images, ...list],
                }))
              }
              SetMainImg={(idx) => {
                setPropertyInfo((pre) => ({
                  ...pre,
                  images: pre.images.map((item, i) => ({
                    ...item,
                    thumbnail: idx === i,
                  })),
                }));
              }}
              del={(id, index, supabaseID) => {
                setPropertyInfo((pre) => ({
                  ...pre,
                  images: pre.images.filter((_, i) => i !== index),
                }));
                if (id.length > 0 && supabaseID.length > 0) {
                  RemoveImage(id, supabaseID);
                }
              }}
              maxImg={handleSSubscriptionRequirement()}
            />
          </div>

          <div className="w-full">
            <TextAreaBox
              value={propertyInfo.description}
              onChange={(val) =>
                setPropertyInfo((pre) => ({ ...pre, description: val }))
              }
              label="Description"
              disabled={false}
              className="w-full h-40 sm:h-56 lg:h-72 resize-none"
            />
          </div>

          <OwnershipConfig
            data={orgInfo.data}
            loading={orgInfo.loading}
            handleSelectOrg={handleSelectOrg}
          />
        </section>
      </div>

      {/* Minor UX polish */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { scroll-behavior: auto !important; }
        }
      `}</style>
    </div>
  );
}

// Helper option arrays
const propertyTypeOP = [
  { value: "House", label: "House" },
  { value: "Apartment", label: "Apartment" },
  { value: "Condo", label: "Condo" },
  { value: "Commercial", label: "Commercial" },
  { value: "Other", label: "Other" },
];

const typeOfSaleOP = [
  { value: "active", label: "active" },
  { value: "pending", label: "pending" },
  { value: "sold", label: "sold" },
];

interface OwnershipConfigProps {
  data: org[];
  loading: boolean;

  handleSelectOrg(id: string, type: "USER" | "ORGANIZATION"): void
}


function OwnershipConfig({ data, loading, handleSelectOrg }: OwnershipConfigProps) {
  const [showConfidential, setShowConfidential] = useState(false);
  

  return (
    <>
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-muted/30 border-border/60">
      <div className="flex-1 min-w-[200px]">
        <p className="text-xs sm:text-sm text-muted-foreground mb-1">
          Current Owner
        </p>
        <p className="text-lg sm:text-xl font-mono font-bold tracking-wider">
          {
            data.find((org) => org.selected)?.name || "No owner selected"
          }
        </p>
      </div>
      <Button
        onClick={() => {
          setShowConfidential((prev) => !prev);
        }}
        className="h-11 w-full sm:w-auto"
        aria-label="Generate new access code"
      >
        Update Ownership
      </Button>
    </div>



    <Dialog open={showConfidential} onOpenChange={setShowConfidential}>
      <DialogOverlay className=" bg-purple-700/30 backdrop-blur-md" />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Select the owner.</DialogTitle>
      <DialogDescription>
        Please select the owner of this property.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4">
      {data.map((org , i) => (
        <Label key={i} className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
        <Checkbox
          id={`toggle-${i}`}
          checked={org.selected}
          onCheckedChange={() => {
            handleSelectOrg(org.id, org.type);
            
          }}
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">
            {org.name}
          </p>
          <p className="text-muted-foreground text-sm">
            {org.type}
          </p>
        </div>
      </Label>
      ))}
    </div>
  </DialogContent>
</Dialog>
  </>

  )

}
