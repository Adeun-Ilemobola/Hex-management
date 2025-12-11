import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { MapPin, Eye, Edit, Trash2 } from "lucide-react";

export interface PropertyCardProp {
  data: {
    img?: string;
    name: string;
    address: string;
    status: "active" | "pending" | "sold" | string;
    saleStatus: "SELL" | "RENT" | "LEASE" | string;
    id: string;
  };
  mode?: boolean;
}

export default function PropertyCard({ data, mode }: PropertyCardProp) {
  const { img, name, address, saleStatus, status, id } = data;

  // Status styling based on enum values
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-emerald-500/20 backdrop-blur-[2px]',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-300/30 dark:border-emerald-400/20',
          dot: 'bg-emerald-500',
          label: 'Active'
        };
      case 'pending':
        return {
          bg: 'bg-amber-500/20 backdrop-blur-[2px]',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-300/30 dark:border-amber-400/20',
          dot: 'bg-amber-500',
          label: 'Pending'
        };
      case 'sold':
        return {
          bg: 'bg-slate-500/20 backdrop-blur-[2px]',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-300/30 dark:border-slate-400/20',
          dot: 'bg-slate-500',
          label: 'Sold'
        };
      default:
        return {
          bg: 'bg-slate-500/20 backdrop-blur-[2px]',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-300/30 dark:border-slate-400/20',
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
          group relative flex flex-col w-72 h-[26rem]
          bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px]
          rounded-xl shadow-xl border border-white/15 dark:border-white/5
          hover:shadow-2xl hover:scale-[1.01] 
          transition-all duration-500 ease-out
          overflow-hidden cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40
          shrink-0
        `}
      >
        {/* Aurora gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image Container */}
        <div className="relative w-full h-48 bg-gradient-to-br from-slate-100/50 to-slate-200/50 dark:from-slate-800/50 dark:to-slate-900/50 overflow-hidden backdrop-blur-[2px]">
          {img ? (
            <Image
              alt={name}
              src={img}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              height={320}
              width={400}
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] border border-white/15 dark:border-white/5 flex items-center justify-center">
                <Eye className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </div>
            </div>
          )}

          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge
              variant="outline"
              className={`${statusStyles.bg} ${statusStyles.text} ${statusStyles.border} rounded-full px-3 py-1 text-xs font-semibold shadow-lg`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot} mr-1.5 animate-pulse`} />
              {statusStyles.label}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col p-5 flex-1 relative">
          {/* Property name */}
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-3 truncate leading-tight">
            {name}
          </h1>

          {/* Address */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
            <h2 className="text-sm text-slate-600 dark:text-slate-300 truncate">
              {address}
            </h2>
          </div>

          {/* Developer Mode Buttons */}
          {mode && (
            <div className="flex gap-2 mb-4">
              <Link href={`/home/propertie-mp?id=${id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 text-xs bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] border-white/15 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-900/30 hover:brightness-110 transition-all duration-300"
                >
                  <Edit className="w-3 h-3 mr-1.5" />
                  Update
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 text-xs bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] border-white/15 dark:border-white/5 text-red-600 dark:text-red-400 hover:bg-red-500/20 hover:border-red-400/30 hover:brightness-110 transition-all duration-300"
                onClick={() => {
                  console.log('Delete property:', id);
                }}
              >
                <Trash2 className="w-3 h-3 mr-1.5" />
                Delete
              </Button>
            </div>
          )}

          {/* Bottom section */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm"></div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Available</span>
            </div>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 text-white shadow-lg hover:brightness-110 active:brightness-95 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300"
            >
              {saleStatus}
            </Badge>
          </div>
        </div>

        {/* Enhanced hover effect line with aurora gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-lg"></div>

        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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