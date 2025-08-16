"use client";

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Base64FileResult, FileUploadResult, toB64 } from '@/lib/utils';
import clsx from 'clsx';
import Image from 'next/image';
import { Lightbulb, LightbulbOff, Trash2, Upload } from 'lucide-react';
import showToastSystem from './toastSystem';
import { toast } from 'sonner';

interface ImgBoxProps {
  disabled?: boolean;
  fileList: Base64FileResult[];
  Class?: string;
  SetMainImg: (index: number) => void;
  setData: (list: Base64FileResult[]) => void;
}




export default function ImgBox({ disabled, fileList, Class, SetMainImg, setData }: ImgBoxProps) {
  const imgRef = useRef<HTMLInputElement | null>(null);

  async function Add() {
    if (imgRef.current?.files) {
      const files = Array.from(imgRef.current.files);
      const b64 = await Promise.all(files.map(async file => await toB64(file)));
      setData(b64);
      imgRef.current.value = '';
    }
  }

  return (
    <div
      className={clsx(
        'ring-1 ring-red-400/60 p-3 rounded-xl flex flex-col gap-2 transition-opacity duration-300',
        disabled && 'opacity-40 cursor-not-allowed',
        Class
      )}
    >
      {/* Upload Button */}
      <div className="flex justify-end">
        <Button
          onClick={e => {
            e.stopPropagation();
            imgRef.current?.click();
          }}
          variant="outline"
          size="icon"
          className="hover:bg-indigo-100"
          disabled={disabled}
        >
          <Upload className="animate-pulse" />
        </Button>
      </div>

      {/* Image Preview List */}
      <div
        className={clsx(
          'flex gap-3 overflow-x-auto p-1 rounded-md border border-dashed border-red-200 min-h-[7rem] transition-all',
          fileList.length === 0 && 'justify-center items-center text-cyan-800/15 text-2xl'
        )}
        onClick={() => !disabled && imgRef.current?.click()}
      >
        {fileList.length > 0 ? (
          fileList.map((file, i) => (
            <div
              key={i}
              onClick={e => {
                e.stopPropagation();
                SetMainImg(i);
              }}
              className={clsx(
                'relative h-28 w-40 shrink-0 rounded-lg overflow-hidden ring-2 transition-all duration-200 cursor-pointer hover:ring-indigo-500/40',
                file.thumbnail ? 'ring-green-400' : 'ring-indigo-600/65'
              )}
            >
              <Image
                alt={file.name}
                src={file.url}
                width={300}
                height={300}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            </div>
          ))
        ) : (
          <span className="select-none">No images</span>
        )}
      </div>

      <input
        ref={imgRef}
        onChange={Add}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}


interface ImgBoxListProps {
  disabled?: boolean;
  fileList: FileUploadResult[];
  className?: string;
  SetMainImg: (index: number) => void;
  setData: (list: FileUploadResult[]) => void;
  del: (id: string, index: number, supabaseID: string) => void,
  maxImg?: number

}
const PLAN_LIMITS = {
  free: 5,
  deluxe: 20,
  pro: 50,
}

export function ImgBoxList({
  disabled,
  fileList,
  className,
  SetMainImg,
  setData,
  del,
  maxImg = 10
}: ImgBoxListProps) {
  const imgRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const isDisabled = disabled || loading;

  async function Add() {
    setLoading(true)
    try {
      const files = imgRef.current?.files
      if (!files || files.length === 0) {
        toast.warning('No files selected')
        setLoading(false)
        return
      }

      const picked = Array.from(files)
      const b64List = await Promise.all(picked.map(f => toB64(f)))

      const totalAfter = b64List.length + fileList.length
      if (totalAfter > maxImg) {
        // decide which plan to suggest
        const needed = totalAfter
        const suggestedPlan: keyof typeof PLAN_LIMITS =
          needed <= PLAN_LIMITS.deluxe ? 'deluxe' : 'pro'
        showToastSystem({
          title: 'Upload limit reached',
          description: `Your ${"free"} plan allows up to ${maxImg} images but you tried to upload ${needed}. Upgrade to ${suggestedPlan} to get up to ${PLAN_LIMITS[suggestedPlan]} images.`,
          buttonText: 'View Plans',
          buttonIcon: true,
          action: () => {
            console.log('View Plans clicked');


          },
        })
        return
      }

      // all good → add them
      setData(b64List)
      if (imgRef.current) {
        imgRef.current.value = '';
      }
    } catch (err) {
      console.error('Error adding images', err)
      toast.error('Couldn’t process your images. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  function openFileX(e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled && imgRef.current) {
      imgRef.current.click();
    }
  }

  return (
    <div
      className={clsx(
        "flex flex-col h-85 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm min-w-0",
        isDisabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-indigo-100 dark:border-indigo-900/30 bg-gradient-to-r from-indigo-50/50 to-gray-50/50 dark:from-indigo-950/20 dark:to-gray-900/30">
        <div className="flex items-center gap-3">
          <span className="text-base font-medium text-gray-900 dark:text-gray-100">
            Images
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full">
            {fileList.length}
          </span>
        </div>
        <Button
          onClick={openFileX}
          variant="outline"
          size="sm"
          className="h-9 px-3 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:border-indigo-300 dark:hover:border-indigo-700"
          disabled={isDisabled}
        >
          <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
          Upload
        </Button>
      </div>

      {/* Image Grid with Horizontal Scroll */}
      <div className="flex-1 p-5 min-w-0">
        {fileList.length > 0 ? (
          <div
            className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 h-full
                   min-w-0 max-w-full snap-x snap-mandatory touch-pan-x"
            role="list"
            aria-label="Property images"
            tabIndex={0}
            style={{ WebkitOverflowScrolling: 'touch' }}
            // onWheel={(e) => {
            //   if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            //     e.currentTarget.scrollLeft += e.deltaY; // accumulate, don’t replace
            //     e.preventDefault();
            //   }
            // }}
          >
            {fileList.map((file, i) => (
              <div
                key={i}
                className={clsx(
                  "relative shrink-0 w-48 h-full group cursor-pointer snap-start",
                  "rounded-lg overflow-hidden border-2 transition-all duration-200 ease-in-out",
                  "bg-gray-50 dark:bg-gray-900",
                  file.thumbnail
                    ? "border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/30 hover:shadow-lg"
                    : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-emerald-50/50 dark:hover:shadow-emerald-900/20 hover:shadow-md"
                )}
                onClick={() => !isDisabled && SetMainImg(i)}
              >
                {/* Image Area */}
                <div className="relative w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  {file.url && (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Main Image Indicator */}
                  {file.thumbnail && (
                    <div className="absolute bottom-2 left-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-indigo-600/90 backdrop-blur-sm rounded-full">
                        <Lightbulb className="w-3 h-3 text-yellow-300" />
                        <span className="text-xs font-medium text-white">Main</span>
                      </div>
                    </div>
                  )}

                  {/* Action Icons - Top Right on Hover */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        SetMainImg(i);
                      }}
                      className="w-7 h-7 bg-black/70 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                      disabled={isDisabled}
                      title="Set as main image"
                    >
                      {file.thumbnail ? (
                        <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                      ) : (
                        <LightbulbOff className="w-3.5 h-3.5 text-gray-300" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        del(file.id, i, file.supabaseID);
                      }}
                      className="w-7 h-7 bg-black/70 hover:bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                      disabled={isDisabled}
                      title="Delete image"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-3 h-16 flex flex-col justify-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {file.thumbnail ? (
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">Main image</span>
                    ) : (
                      'Additional image'
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
              No images uploaded
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
              Upload images to get started. Click the upload button to select files.
            </p>
            <Button
              onClick={openFileX}
              variant="outline"
              size="sm"
              disabled={isDisabled}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
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