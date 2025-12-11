"use client"
import React , {  useRef } from 'react'
import { Button } from './ui/button';
import { FileUploadResult, toB64 } from '@/lib/utils';
import { FileUp } from 'lucide-react';


interface FileBtuProps {
  
    isUploading : React.Dispatch<React.SetStateAction<boolean>>
    setUploadList : (list: FileUploadResult[]) => void
    
}
export default function FileBtu({setUploadList , isUploading}: FileBtuProps) {
    const fileRef = useRef<HTMLInputElement | null>(null);

    async function upload() {
        isUploading(true);
        if(fileRef.current?.files) {
            const files = Array.from(fileRef.current.files);
            const b64 = await Promise.all(files.map(async file => await toB64(file)));
            setUploadList(b64);
            fileRef.current.value = '';
        }
        isUploading(false);
        
    }
  return (
    <>
        <Button size={'icon'} onClick={() => fileRef.current?.click()}><FileUp /></Button>
        <input type="file" ref={fileRef} onChange={upload} className='hidden' multiple accept='image/* , video/* , audio/* , application/pdf, text/* ,  application/msword , application/vnd.openxmlformats-officedocument.wordprocessingml.document' />
        
    </>
  )
}
