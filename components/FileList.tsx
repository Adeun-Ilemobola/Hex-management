import { getPlanLimits } from '@/lib/PlanConfig';
import { File_To_FileXList, setThumbnail } from '@/lib/utils';
import { FileXInput } from '@/lib/ZodObject';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { IconUpload } from '@tabler/icons-react';
import { Badge } from './ui/badge';

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
      {/* Header Row: Shows Label and Small Upload Button if images exist */}
      <div className="flex items-center justify-between px-1">
        {/* <h3 className="text-sm font-medium text-gray-700">
            Property Images {fileList.length > 0 && <span className="text-gray-400 text-xs font-normal">({fileList.length}/{limit})</span>}
        </h3> */}
        
        {fileList.length > 0 && (
          <Button
            onClick={openFileExplorer}
            variant="outline"
            size="sm"
            className="h-8 gap-2 text-gray-600 border-gray-300 hover:bg-gray-100"
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
          // Styling changes based on state (drag/disabled/error usually handled here, but simplified for clean look)
          isDisabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200" : "border-gray-300 hover:border-indigo-400 bg-white"
        )}
      >
        {fileList.length === 0 ? (
          // --- EMPTY STATE ---
          <div
            onClick={openFileExplorer}
            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl hover:bg-gray-50/50"
          >
            <div className="rounded-full bg-gray-100 p-3">
              <IconUpload className="h-6 w-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Click to upload images
              </p>
              <p className="text-xs text-gray-400">
                Max {limit} images allowed
              </p>
            </div>
          </div>
        ) : (
          // --- LIST STATE ---
          <div className="flex w-full gap-4 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-gray-200">
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
                            isThumbnail ? "ring-2 ring-indigo-600 ring-offset-1 border-transparent" : "border-gray-200 hover:border-indigo-300"
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
                            <Badge className="absolute top-2 right-2 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                                COVER
                            </Badge>
                        )}
                        
                        {/* Hover Overlay for non-thumbnails */}
                        {!isThumbnail && (
                             <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
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