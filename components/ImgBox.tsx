"use client"
import React, { useRef } from 'react'
import { Button } from './ui/button'
import { Base64FileResult, toB64 } from '@/lib/utils'
import clsx from 'clsx'
import Image from 'next/image'
import { Upload } from 'lucide-react';


interface imgBoxPros {
    disabled?: boolean
    fileList: Base64FileResult[],
    Class?: string,
    SetMainImg: (index: number) => void,
    setData: (list: Base64FileResult[]) => void
}

export default function ImgBox({ disabled, fileList, Class, SetMainImg, setData }: imgBoxPros) {

    const imgRef = useRef<HTMLInputElement | null>(null)

    async function Add() {
        if (imgRef.current && imgRef.current.files) {
            const files = Array.from(imgRef.current.files)
            const b64 = await Promise.all(files.map(async (file) => {
                return await toB64(file)
            }))

            setData(b64)
            imgRef.current.value = ""

        }


    }


    return (
        <div
            className={clsx(`ring-1 ring-red-400/60 p-1 rounded-lg flex flex-col gap-1.5 ${disabled && "opacity-25"}`, Class)}
            onClick={() => {

            }}
        >
            <div className=' flex flex-row items-center w-full h-8'>
                <Button
                    className=' ml-auto'
                    onClick={(e) => {
                        e.stopPropagation()
                        imgRef.current?.click()

                    }}
                    variant={"outline"}
                    size={"icon"}
                >
                    <Upload className=' animate-pulse'/>
                </Button>
            </div>


            <div
                className={` p-0.5 flex flex-row gap-2 shrink-0 flex-1 overflow-x-auto ${fileList.length <= 0 && " justify-center items-center"} `}
                onClick={(e) => {
                    e.stopPropagation()
                    imgRef.current?.click()

                }}
            >
                {fileList.length > 0 && (<>{fileList.map((file, i) => {
                    return (<div
                        key={i}
                        onClick={(e) =>{
                            e.stopPropagation()
                            SetMainImg(i)
                        }}
                        className={` relative shrink-0 h-28 w-40 rounded-md ring-2 hover:ring-indigo-600/25 ${file.Thumbnail ? " ring-green-400" : " ring-indigo-600/65"} `}
                    >
                        <Image className=' w-full h-full object-cover' alt={file.name} width={300} height={300} src={file.base64} />

                    </div>)
                })}</>)}

                {fileList.length <= 0 && (<h1 className=' text-5xl  text-cyan-800/15'> no image</h1>)}

            </div>

            <input ref={imgRef} onChange={Add} className=' hidden' type="file" multiple accept="image/*" />
        </div>
    )
}
