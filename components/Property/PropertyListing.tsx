// PropertyListing.tsx
"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Phone,
  Mail,
  Share2,
  Heart,
  CheckCircle2,
  Home,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Maximize,
  User,
  ImageIcon
} from 'lucide-react';

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { defaultPropertyInput, PropertyInput } from '@/lib/ZodObject'
import { trpc as api } from '@/lib/client';
import DropBack from '../DropBack';
import { Nav } from '../Nav';
import { Skeleton } from '../ui/skeleton';

type PropertyLandingPageProps = {
  id: string
}

export default function PropertyLandingPage({ id }: PropertyLandingPageProps) {
  const [propertyInfo, setPropertyInfo] = React.useState<PropertyInput>(defaultPropertyInput);
  
  
  // Simulated fetch logic
  const getProperty = api.Propertie.viewProperty.useQuery({ pID: id }, {
    
  })
  

  React.useEffect(() => {
    // Simulate network delay for effect
    const data = getProperty.data?.value
    if (data) {
      setPropertyInfo(data);
     
    }
    
  }, [getProperty.data]);

  // --- Glassmorphism Utilities ---
  // These classes create the frosted glass effect, border lighting, and depth.
  const glassCard = "bg-white/40 dark:bg-black/40 backdrop-blur-[16px] border border-white/30 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]";
  const glassNested = "bg-white/30 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10";
  const glassButton = "bg-[#2563eb]/70 hover:bg-[#2563eb]/80 dark:bg-[#d8b4fe]/70 dark:hover:bg-[#d8b4fe]/80 text-white dark:text-slate-900 border border-white/20 shadow-lg backdrop-blur-sm transition-all";
  
  if (getProperty.isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans selection:bg-[#db2777]/30">
      
      {/* 1. Dynamic Background (Blobs for Depth) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#9333ea]/30 dark:bg-[#a855f7]/20 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#2563eb]/30 dark:bg-[#2563eb]/20 blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#db2777]/20 dark:bg-[#f472b6]/10 blur-[80px]" />
        {/* Pattern overlay for texture */}
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.05]" />
      </div>

      {/* 2. Main Scrollable Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        
        <div className={`rounded-3xl p-6 lg:p-10 ${glassCard} text-slate-800 dark:text-slate-100`}>
          
          {/* Header Section */}
          <header className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge 
                  variant="outline" 
                  className={`capitalize px-3 py-1 ${glassNested} text-[#2563eb] dark:text-[#d8b4fe] font-semibold tracking-wide`}
                >
                  {propertyInfo.status}
                </Badge>
                <Badge variant="secondary" className="bg-slate-100/50 dark:bg-slate-800/50">
                  {propertyInfo.propertyType}
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                {propertyInfo.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-[#db2777] dark:text-[#f472b6]" />
                <span className="text-lg">{propertyInfo.address}</span>
              </div>
            </div>
            
            <div className={`flex flex-col gap-3 p-4 rounded-2xl ${glassNested} min-w-[200px]`}>
              <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">List Price</span>
              {/* Mock Price as it wasn't in schema, or derive if needed */}
              <span className="text-3xl font-bold text-[#2563eb] dark:text-[#d8b4fe]">$1,250,000</span>
              <Button className={`w-full ${glassButton}`}>
                Contact Agent
              </Button>
            </div>
          </header>

          <Separator className="bg-slate-200/50 dark:bg-slate-700/50 mb-8" />

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Gallery & Details */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Gallery Carousel */}
              <div className={`rounded-2xl overflow-hidden aspect-video relative ${glassNested} shadow-inner`}>
                {propertyInfo.images && propertyInfo.images.length > 0 ? (
                  <Carousel 
                    opts={{ loop: true }} 
                    className="w-full h-full"
                  >
                    <CarouselContent className="h-full">
                      {propertyInfo.images.map((img, index) => (
                        <CarouselItem key={img.id || index} className="h-full">
                          <div className="relative w-full h-full flex items-center justify-center bg-black/5">
                            <img 
                              src={img.link} 
                              alt={img.name || `Property View ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading={index === 0 ? "eager" : "lazy"}
                            />
                            {/* Gradient Overlay for text legibility if needed */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {/* Navigation Buttons */}
                    <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/40 border-white/30 text-white backdrop-blur-md h-10 w-10" />
                    <CarouselNext className="right-4 bg-white/20 hover:bg-white/40 border-white/30 text-white backdrop-blur-md h-10 w-10" />
                  </Carousel>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full text-slate-400">
                    <ImageIcon className="h-16 w-16 mb-4 opacity-50" />
                    <p>No images available for this property.</p>
                  </div>
                )}
              </div>

              {/* Core Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard icon={<Bed />} label="Bedrooms" value={propertyInfo.numBedrooms} glassClass={glassNested} />
                <StatsCard icon={<Bath />} label="Bathrooms" value={propertyInfo.numBathrooms} glassClass={glassNested} />
                <StatsCard icon={<Maximize />} label="Sq Ft" value={propertyInfo.squareFootage.toLocaleString()} glassClass={glassNested} />
                <StatsCard icon={<Calendar />} label="Year Built" value={propertyInfo.yearBuilt} glassClass={glassNested} />
              </div>

              {/* Description */}
              <Card className={`border-none shadow-none ${glassNested}`}>
                <CardHeader>
                  <CardTitle className="text-xl text-[#9333ea] dark:text-[#a855f7]">About this home</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                    {propertyInfo.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Right Column: Amenities & Owner */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Amenities */}
              <Card className={`border-none shadow-none ${glassNested}`}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Home className="h-5 w-5 text-[#db2777] dark:text-[#f472b6]" />
                    Amenities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {propertyInfo.amenities.map((amenity, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="bg-white/40 dark:bg-white/10 hover:bg-white/50 backdrop-blur-sm border border-white/20 text-slate-700 dark:text-slate-200"
                      >
                        {amenity}
                      </Badge>
                    ))}
                    {propertyInfo.amenities.length === 0 && (
                      <span className="text-sm text-slate-500">No amenities listed.</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Owner Info */}
              <Card className={`border-none shadow-none ${glassNested}`}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-[#2563eb] dark:text-[#d8b4fe]" />
                    Listed By
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    {propertyInfo.ownerType}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#9333ea] flex items-center justify-center text-white font-bold">
                      {propertyInfo.ownerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{propertyInfo.ownerName}</p>
                      <p className="text-xs text-slate-500">{propertyInfo.contactInfo}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-[#2563eb]/30 text-[#2563eb] dark:text-[#d8b4fe] hover:bg-[#2563eb]/10">
                    <Phone className="h-4 w-4 mr-2" /> Call Agent
                  </Button>
                </CardContent>
              </Card>

              {/* Lot Info (Extra Data) */}
              <div className={`p-4 rounded-xl ${glassNested} flex justify-between items-center`}>
                 <span className="text-sm text-slate-600 dark:text-slate-400">Lot Size</span>
                 <span className="font-mono font-medium">{propertyInfo.lotSize.toLocaleString()} sqft</span>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function StatsCard({ icon, label, value, glassClass }: { icon: React.ReactNode, label: string, value: string | number, glassClass: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl text-center space-y-1 ${glassClass} transition-transform hover:scale-105 duration-300`}>
      <div className="text-[#9333ea] dark:text-[#a855f7] mb-1 [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </div>
      <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</span>
      <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <div className="w-full max-w-6xl space-y-8">
            <div className="flex gap-4">
                <Skeleton className="h-12 w-2/3 rounded-xl" />
                <Skeleton className="h-12 w-1/3 rounded-xl" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-3xl" />
            <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
        </div>
    </div>
  );
}