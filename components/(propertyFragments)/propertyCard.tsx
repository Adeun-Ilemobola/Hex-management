import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { MapPin, Eye, Heart, Edit, Trash2 } from "lucide-react";

interface PropertyCardProp {
  data: {
    img?: string;
    name: string;
    address: string;
    status: string;
    saleStatus: string;
    id: string;
  };
  mode?: boolean;
}

export default function PropertyCard({ data, mode }: PropertyCardProp) {
  const { img, name, address, saleStatus, status, id } = data;

  return (
    <Linker id={id} mode={mode === undefined ? true : mode}>
      <div
        className={`
          group relative flex flex-col w-72 h-[26rem]
          rounded-2xl bg-white dark:bg-gray-900
          border border-gray-200/60 dark:border-gray-700/60
          shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.15)]
          hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]
          hover:border-gray-300/80 dark:hover:border-gray-600/80
          transition-all duration-500 ease-out
          overflow-hidden cursor-pointer
          hover:-translate-y-1
        `}
      >
        {/* Image Container */}
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
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
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Eye className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge
              variant="outline"
              className="bg-white/95 dark:bg-gray-900/95 text-gray-700 dark:text-gray-300 border-white/20 dark:border-gray-700/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium shadow-sm"
            >
              {status}
            </Badge>
            {!mode && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col p-5 flex-1 bg-white dark:bg-gray-900">
          {/* Property name */}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate leading-tight">
            {name}
          </h1>

          {/* Address */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <h2 className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {address}
            </h2>
          </div>

          {/* Developer Mode Buttons */}
          {mode && (
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Update property:', id);
                }}
              >
                <Edit className="w-3 h-3 mr-1" />
                Update
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Delete property:', id);
                }}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </div>
          )}

          {/* Bottom section */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Available</span>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700/30 px-3 py-1 rounded-full text-xs font-semibold"
            >
              {saleStatus}
            </Badge>
          </div>
        </div>

        {/* Subtle hover effect line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
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