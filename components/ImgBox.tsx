"use client";

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Base64FileResult, toB64 } from '@/lib/utils';
import clsx from 'clsx';
import Image from 'next/image';
import { Lightbulb, LightbulbOff, ScanEye, Trash2, Upload } from 'lucide-react';

interface ImgBoxProps {
  disabled?: boolean;
  fileList: Base64FileResult[];
  Class?: string;
  SetMainImg: (index: number) => void;
  setData: (list: Base64FileResult[]) => void;
}


interface ImgBoxListProps {
  disabled?: boolean;
  fileList: Base64FileResult[];
  className?: string;
  SetMainImg: (index: number) => void;
  setData: (list: Base64FileResult[]) => void;
  del: (id: number) => void
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
                file.Thumbnail ? 'ring-green-400' : 'ring-indigo-600/65'
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




export function ImgBoxList({ disabled, fileList, className, SetMainImg, setData, del,
}: ImgBoxListProps) {
  const imgRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const isDisabled = disabled || loading;

  async function Add() {
    setLoading(true);
    if (imgRef.current?.files) {
      const files = Array.from(imgRef.current.files);
      const b64 = await Promise.all(files.map((f) => toB64(f)));
      setData(b64);
      imgRef.current.value = "";
    }
    setLoading(false);
  }

  function openFileX(
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled && imgRef.current) {
      imgRef.current.click();
    }
  }

  return (
    <div
      className={clsx(
        "flex flex-col gap-4 w-96 max-w-2xl h-96 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden",
        isDisabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {fileList.length}
        </h2>
        <Button
          onClick={openFileX}
          variant="outline"
          size="icon"
          className="hover:bg-muted"
          disabled={isDisabled}
        >
          <Upload className="animate-pulse" />
        </Button>
      </div>

      {/* File list / Empty state */}
      <div className="flex-1 flex flex-col gap-3 overflow-auto p-3">
        {fileList.length > 0 ? (
          fileList.map((file, i) => (
            <div
              key={i}
              className={clsx(
                "flex items-center justify-between p-4 rounded-2xl shadow transition ring-1",
                file.Thumbnail
                  ? "bg-accent/10 ring-accent/50 hover:bg-accent/20 hover:ring-accent-foreground"
                  : "bg-amber-300/55 dark:bg-amber-900/40 ring-amber-600/50 hover:bg-amber-300/80 hover:ring-amber-700/60",
                !isDisabled && "cursor-pointer",
                isDisabled && "opacity-70"
              )}
            >
              <span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {file.name}
              </span>
              <div className="flex items-center gap-3">
                <ScanEye
                  className={clsx(
                    "cursor-pointer transition",
                    !isDisabled && "hover:text-primary"
                  )}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    SetMainImg(i);
                  }}
                  className={clsx(
                    "p-1 rounded-full transition",
                    !isDisabled && "hover:bg-muted"
                  )}
                  disabled={isDisabled}
                >
                  {file.Thumbnail ? (
                    <Lightbulb className="text-yellow-500" />
                  ) : (

                    <LightbulbOff className="text-yellow-500" />
                  )}
                </button>

                <Trash2
                  onClick={(e) => {
                    e.stopPropagation();
                    del(i);
                  }}
                  className={clsx(
                    "cursor-pointer transition",
                    !isDisabled && "hover:text-destructive"
                  )}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 opacity-30">
              No images uploaded
            </span>
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