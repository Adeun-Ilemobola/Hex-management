"use client";

import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Base64FileResult, toB64 } from '@/lib/utils';
import clsx from 'clsx';
import Image from 'next/image';
import { Upload } from 'lucide-react';

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
