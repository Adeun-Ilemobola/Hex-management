"use client"
import {  fullFile } from '@/lib/utils'
import Image from 'next/image';
import React, { useState } from 'react'
import { Textarea } from '../ui/textarea';
import FileBtu from '../FileBtu';
import { Button } from '../ui/button';
import { Send, X, File, FileText, FileImage, FileVideo, FileAudio } from 'lucide-react';
import {  defaultMessage, Message, MessageSchema } from '@/lib/Zod';
import { toast } from 'sonner';
import { DeleteImages, UploadImageList } from '@/lib/supabase';

interface ChatSendProps {
    sendMessage: (data: Message) => void
    userId: string;
    roomId: string;
}

export default function ChatSend({ sendMessage , userId ,roomId }: ChatSendProps) {
    
    const [file, setFile] = useState<fullFile[]>([]);
    const[text,setText] = useState("");

    const [isUploading, setUploading] = useState(false);
    const [isMounted, setMounted] = useState(false);

    React.useEffect(() => {
        if (!isMounted) {
            setMounted(true);
        }
        return () => {
            setMounted(false);
        }
    }, []);


   async function send() {
        const vMessage = MessageSchema.safeParse({
            ...defaultMessage,
            text,
            roomId , 
            authorId: userId,
            images: file.map(img => ({
                ...img,
                ChatRoomID: roomId,
                id:"",
                messageId: "",
                chatOwnerID: userId
            }))
        });
        if (!vMessage.success) {
            if (vMessage.error.errors) {
                const errors = vMessage.error.errors
                errors.forEach(error => {
                    toast.error(`Validation error in field "${error.path.join('.')}": ${error.message}`);

                })
                
            }
            return;
        }
         let uploadedImages: fullFile[] = [];
        try {
            const I = vMessage.data.images.map(img => ({
                ...img,
                thumbnail: false,
                ChatRoomID: roomId
            }))
            
            
             uploadedImages = await UploadImageList(I, userId, "chat")
            sendMessage( {
                ...vMessage.data,
                images: uploadedImages.map(img => ({
                    ...img,
                    ChatRoomID: roomId,
                    id:"",
                    messageId: "",
                    chatOwnerID: userId

                   
                }))
            });
            setText("");
            setFile([]);
            setUploading(false);
            
        } catch (error) {
            if (file.length > 0) {
                await DeleteImages(file.map(img => img.supabaseID));
            }
            console.error("Error uploading images:", error);
            toast.error("Failed to upload images");
            return;
            
        }
    }

    function removeFile(index: number) {
        setFile(prev => prev.filter((_, i) => i !== index));
       
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    }

    function getFileIcon(type: string) {
        if (type.startsWith('image/')) return FileImage;
        if (type.startsWith('video/')) return FileVideo;
        if (type.startsWith('audio/')) return FileAudio;
        if (type.includes('pdf')) return FileText;
        if (type.includes('document') || type.includes('word')) return FileText;
        return File;
    }

    function isImageFile(type: string) {
        return type.startsWith('image/');
    }

    return (
        <div className='flex flex-col w-full gap-1'>
            {/* File Preview Section - Horizontal Scroll */}
            {isMounted && file && file.length > 0 && (
                <div className='flex overflow-x-auto gap-2 px-2 pb-1'>
                    {file.map((file, index) => {
                        const IconComponent = getFileIcon(file.type);
                        return (
                            <div
                                key={index}
                                className='relative flex-shrink-0 group'
                            >
                                <div className='w-16 h-16 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50'>
                                    {isImageFile(file.type) ? (
                                        <Image
                                            src={file.url}
                                            alt={file.name}
                                            className='w-full h-full object-cover'
                                            width={64}
                                            height={64}
                                        />
                                    ) : (
                                        <IconComponent className='w-8 h-8 text-gray-600' />
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className='absolute -top-0.5 -right-1 z-10 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                                >
                                    <X size={14} />
                                </button>
                                <div className='mt-1 text-xs text-gray-600 text-center truncate max-w-16'>
                                    {file.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Input Section */}
            <div className='flex items-end gap-2 p-2'>
                <Textarea
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    className='flex-1 resize-none min-h-[40px] max-h-32'
                    placeholder="Type a message..."
                />

                <div className='flex items-center gap-2'>
                    <FileBtu
                        isUploading={setUploading}
                        setUploadList={(list) => {
                            setFile(prev => [...prev, ...list]);
                        }}
                    />

                    <Button
                        onClick={send}
                        disabled={isUploading}
                    >
                        <Send /> Send
                    </Button>
                </div>
            </div>
        </div>
    )
}