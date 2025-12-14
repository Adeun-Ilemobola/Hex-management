import Image from "next/image";
import React from "react";
import { Badge } from "./ui/badge"; 
import { Button } from "./ui/button";
import Link from "next/link";
import { MapPin, Eye, Edit, Trash2 } from "lucide-react";
import z from "zod";
import { SaleTypeEnum, StatusEnum } from "@/lib/ZodObject";

export interface PropertyCardProp {
  data: {
    img?: string;
    name: string;
    address: string;
    status: z.infer<typeof StatusEnum>;
    saleStatus: z.infer<typeof SaleTypeEnum>;
    id: string;
  };
  mode?: boolean;
}


export default function PropertyCard({ data, mode }: PropertyCardProp) {
  const { img, name, address, saleStatus, status, id } = data;

  // Design Specs: Color Tokens mapped to RGB/Hex with opacity modifiers
  // Primary Base: Light [#2563eb] | Dark [#d8b4fe]
  // Accent Base: Light [#9333ea] | Dark [#a855f7]
  // Highlight Base: Light [#db2777] | Dark [#f472b6]

  const getStatusStyles = (status: z.infer<typeof StatusEnum>) => {
    switch (status) {
      case 'active':
        return {
          // Primary Base
          wrapper: 'bg-[#2563eb]/20 dark:bg-[#d8b4fe]/20 ring-[#2563eb]/30 dark:ring-[#d8b4fe]/30',
          text: 'text-[#2563eb] dark:text-[#d8b4fe]',
          dot: 'bg-[#2563eb] dark:bg-[#d8b4fe]',
          label: 'Active'
        };
      case 'pending':
        return {
          // Accent Base
          wrapper: 'bg-[#9333ea]/20 dark:bg-[#a855f7]/20 ring-[#9333ea]/30 dark:ring-[#a855f7]/30',
          text: 'text-[#9333ea] dark:text-[#a855f7]',
          dot: 'bg-[#9333ea] dark:bg-[#a855f7]',
          label: 'Pending'
        };
      case 'sold':
        return {
          // Highlight Base
          wrapper: 'bg-[#db2777]/20 dark:bg-[#f472b6]/20 ring-[#db2777]/30 dark:ring-[#f472b6]/30',
          text: 'text-[#db2777] dark:text-[#f472b6]',
          dot: 'bg-[#db2777] dark:bg-[#f472b6]',
          label: 'Sold'
        };
      default:
        return {
          wrapper: 'bg-slate-500/20 ring-slate-400/30',
          text: 'text-slate-700 dark:text-slate-300',
          dot: 'bg-slate-500',
          label: status
        };
    }
  };

  const statusStyles = getStatusStyles(status);

  return (
    <Linker id={id} mode={mode === undefined ? true : mode}>
      <div
        className={`
          group relative flex flex-col w-72 h-[26rem] shrink-0
          /* GLASSMORPHISM SURFACE SPECS */
          bg-white/40 dark:bg-black/40
          backdrop-blur-[20px]
          /* EDGES & DEPTH */
          ring-1 ring-white/40 dark:ring-white/10
          shadow-[0_4px_30px_rgba(0,0,0,0.1)]
          hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)]
          rounded-2xl overflow-hidden cursor-pointer
          transition-all duration-500 ease-out
          hover:scale-[1.01]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9333ea]/50
        `}
      >
        {/* Aurora gradient overlay - Refined for glass effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2563eb]/10 via-[#9333ea]/10 to-[#db2777]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image Container */}
        <div className="relative w-full h-48 overflow-hidden">
          {img ? (
            <Image
              alt={name}
              src={img}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[2px]"
              height={320}
              width={400}
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100/10 dark:bg-slate-900/10 backdrop-blur-md">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl ring-1 ring-white/30 flex items-center justify-center">
                <Eye className="w-6 h-6 text-slate-600 dark:text-slate-300 opacity-70" />
              </div>
            </div>
          )}

          {/* Gradient overlay for text readability on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

          {/* Top badges - Glass on Glass */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge
              variant="outline"
              className={`
                backdrop-blur-[15px] border-none shadow-sm
                ring-1 px-3 py-1 text-xs font-semibold rounded-full
                ${statusStyles.wrapper} ${statusStyles.text}
              `}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot} mr-2 animate-pulse shadow-[0_0_8px_currentColor]`} />
              {statusStyles.label}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col p-5 flex-1 relative z-10">
          {/* Property name */}
          <h1 className="text-xl font-bold text-slate-900/90 dark:text-white/90 mb-2 truncate drop-shadow-sm">
            {name}
          </h1>

          {/* Address */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
            <h2 className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
              {address}
            </h2>
          </div>

          {/* Developer Mode Buttons (Glass Buttons) */}
          {mode && (
            <div className="flex gap-2 mb-4">
              <Link href={`/home/propertie-mp?id=${id}`} className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-9 text-xs bg-white/20 dark:bg-white/5 hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-[15px] ring-1 ring-white/30 border-none text-slate-700 dark:text-slate-200 transition-all duration-300 shadow-sm"
                >
                  <Edit className="w-3 h-3 mr-1.5" />
                  Update
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 text-xs bg-white/20 dark:bg-white/5 hover:bg-red-500/20 backdrop-blur-[15px] ring-1 ring-white/30 hover:ring-red-500/30 border-none text-red-600 dark:text-red-400 transition-all duration-300 shadow-sm"
                onClick={() => {
                  console.log('Delete property:', id);
                }}
              >
                <Trash2 className="w-3 h-3 mr-1.5" />
                Delete
              </Button>
            </div>
          )}

          {/* Bottom Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse"></div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Available</span>
            </div>
            
            {/* Sale Status Pill */}
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-[#db2777]/80 to-[#9333ea]/80 text-white shadow-lg backdrop-blur-md border-0 px-3 py-1 rounded-full text-xs font-semibold"
            >
              {saleStatus}
            </Badge>
          </div>
        </div>

        {/* Bottom decorative glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"></div>
      </div>
    </Linker>
  );
}






function Linker({
  children,
  id,
  mode,
}: {
  children: React.ReactNode;
  mode: boolean;
  id: string;
}) {
  if (!mode) {
    return <Link href={`home/propertie/${id}`}>{children}</Link>;
  }
  return <>{children}</>;
}