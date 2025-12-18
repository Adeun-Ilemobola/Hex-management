import { getPlanLimits } from '@/lib/PlanConfig';
import { File_To_FileXList, setThumbnail } from '@/lib/utils';
import { FileXInput } from '@/lib/ZodObject';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { IconUpload } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

type FileListProps = {
    disabled?: boolean;
    fileList: FileXInput[];
    onChange: (files: FileXInput[]) => void;
    className?: string;
    limit?: number
}





export default function FileList({
  disabled,
  fileList,
  onChange,
  className,
  limit = getPlanLimits("Free").maxImagesPerProject,
}: FileListProps) {
  const imgRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const isDisabled = disabled || loading;

  function openFileExplorer(
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled && imgRef.current) {
      imgRef.current.click();
    }
  }

  function SetAsThumbnail(index: number) {
    onChange(
      fileList.map((file, i) => {
        if (i === index) {
          return { ...file, tags: [...file.tags, setThumbnail] };
        }
        return {
          ...file,
          tags: file.tags.filter((tag) => tag !== setThumbnail),
        };
      })
    );
  }

  async function Add() {
    setLoading(true);
    if (imgRef.current?.files) {
      const files = Array.from(imgRef.current.files);
      const To_FileXList = await File_To_FileXList(files);
      if (fileList.length + To_FileXList.length <= limit) {
        onChange([...To_FileXList, ...fileList]);
        setLoading(false);
        toast.success("Images uploaded successfully");
        return;
      }
      setLoading(false);
      toast.error(`You can upload a maximum of ${limit} images`);
    }
  }

  return (
    <div
      className={clsx(
        "w-full flex flex-col gap-3",
        className
      )}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between px-1">
        {fileList.length > 0 && (
          <Button
            onClick={openFileExplorer}
            variant="outline"
            size="sm"
            // Changed: standard h-8, generic ml-auto
            className="h-8 gap-2 ml-auto"
            disabled={isDisabled}
          >
            <IconUpload className="w-3.5 h-3.5" />
            <span className="text-xs">Add Images</span>
          </Button>
        )}
      </div>

      {/* Main Dropzone / List Area */}
      <div
        className={clsx(
          "relative min-h-[10rem] w-full rounded-xl border-2 border-dashed transition-all duration-200",
          // 1. Replaced bg-white with bg-background
          // 2. Replaced border-gray-300 with border-input (or border-muted-foreground/25)
          // 3. Replaced hover:border-indigo-400 with hover:border-primary
          // 4. Replaced bg-gray-50 (disabled) with bg-muted
          isDisabled 
            ? "opacity-50 cursor-not-allowed bg-muted border-border" 
            : "border-border/50 hover:border-primary/50 bg-background"
        )}
      >
        {fileList.length === 0 ? (
          // --- EMPTY STATE ---
          <div
            onClick={openFileExplorer}
            // Replaced hover:bg-gray-50/50 with hover:bg-accent/50
            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl hover:bg-accent/50"
          >
            {/* Replaced bg-gray-100 with bg-muted */}
            <div className="rounded-full bg-muted p-3">
              {/* Replaced text-gray-400 with text-muted-foreground */}
              <IconUpload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              {/* Replaced text-gray-700 with text-foreground */}
              <p className="text-sm font-medium text-foreground">
                Click to upload images
              </p>
              {/* Replaced text-gray-400 with text-muted-foreground */}
              <p className="text-xs text-muted-foreground">
                Max {limit} images allowed
              </p>
            </div>
          </div>
        ) : (
          // --- LIST STATE ---
          // Replaced scrollbar-thumb-gray-200 with scrollbar-thumb-secondary
          <div className="flex w-full gap-4 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-secondary">
            {fileList.map((file, i) => {
                const isThumbnail = file.tags.includes(setThumbnail);
                return (
                    <div
                        key={i}
                        onClick={(e) => {
                            e.stopPropagation();
                            SetAsThumbnail(i);
                        }}
                        className={clsx(
                            "group relative h-32 w-48 shrink-0 cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md",
                            // Replaced ring-indigo-600 with ring-primary
                            // Replaced border-gray-200 with border-border
                            // Replaced hover:border-indigo-300 with hover:border-primary/50
                            isThumbnail 
                                ? "ring-2 ring-primary ring-offset-1 ring-offset-background border-transparent" 
                                : "border-border hover:border-primary/50"
                        )}
                    >
                        <Image
                            alt={file.name}
                            src={file.link}
                            width={300}
                            height={300}
                            draggable={false}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Thumbnail Badge/Overlay */}
                        {isThumbnail && (
                            // Replaced bg-indigo-600 with bg-primary
                            // Replaced text-white with text-primary-foreground
                            <Badge className="absolute top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                                COVER
                            </Badge>
                        )}
                        
                        {/* Hover Overlay */}
                        {!isThumbnail && (
                            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 dark:group-hover:bg-white/10" />
                        )}
                    </div>
                );
            })}
          </div>
        )}
      </div>

      <input
        ref={imgRef}
        onChange={Add}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        disabled={isDisabled}
      />
    </div>
  );
}