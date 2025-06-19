import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";

// Consider importing Card/CardContent from shadcn if you want that look:
// import { Card, CardContent } from "@/components/ui/card"

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
          group relative flex flex-col gap-2 w-72 h-[24rem]
          rounded-xl bg-background border border-border
          shadow-sm hover:shadow-lg ring-1 ring-transparent hover:ring-fuchsia-400/20
          transition-all duration-300
          overflow-hidden
        `}
      >
        {/* Top badge */}
        <Badge
          variant="outline"
          className="absolute top-2 right-2 z-10 bg-fuchsia-600/80 text-white dark:bg-fuchsia-400/80 dark:text-black rounded-xl px-3 py-1 text-xs font-semibold shadow"
        >
          {status}
        </Badge>

        {/* Image */}
        <div className="flex items-center justify-center w-full aspect-video bg-muted/40">
          {img ? (
            <Image
              alt={name}
              src={img}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              height={320}
              width={400}
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl">
              {/* Optionally use a fallback SVG */}
              <span className="opacity-70">No Image</span>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="flex flex-col gap-1 p-4 flex-1">
          <h1 className="text-lg font-semibold text-foreground truncate">{name}</h1>
          <h2 className="text-sm text-muted-foreground truncate">{address}</h2>
          <div className="flex flex-row mt-2">
            <Badge
              variant="secondary"
              className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-green-100 px-2 py-1 rounded-xl text-xs font-medium"
            >
              {saleStatus}
            </Badge>
          </div>
        </div>
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
