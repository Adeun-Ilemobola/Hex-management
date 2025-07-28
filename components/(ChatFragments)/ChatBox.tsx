import { FileUploadResult } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'
import { File, FileText, FileImage, FileVideo, FileAudio } from 'lucide-react';

interface Props {
    id: string;
    text: string;
    img: FileUploadResult[]
}

export default function ChatBox({ id, text, img }: Props) {
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
        <div className='flex justify-start w-full px-4 py-2'>
            {/* chat bubble */}
            <div className='flex flex-col max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 rounded-2xl overflow-hidden shadow-sm'>
                
                {/* Files Section */}
                {img && img.length > 0 && (
                    <div className='p-3'>
                        {img.length === 1 ? (
                            // Single file - larger display
                            <div className='w-full'>
                                {isImageFile(img[0].type) ? (
                                    <Image
                                        key={`${id}-0`}
                                        src={img[0].url}
                                        alt={img[0].name}
                                        width={300}
                                        height={200}
                                        className='rounded-lg w-full h-auto max-h-64 object-cover'  
                                    />
                                ) : (
                                    <div className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                        {(() => {
                                            const IconComponent = getFileIcon(img[0].type);
                                            return <IconComponent className='w-8 h-8 text-gray-600 dark:text-gray-400' />;
                                        })()}
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                                                {img[0].name}
                                            </p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                {(img[0].size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Multiple files - grid display
                            <div className='grid grid-cols-2 gap-2'>
                                {img.map((item, index) => (
                                    <div key={`${id}-${index}`} className='aspect-square'>
                                        {isImageFile(item.type) ? (
                                            <Image
                                                src={item.url}
                                                alt={item.name}
                                                width={150}
                                                height={150}
                                                className='rounded-lg w-full h-full object-cover'  
                                            />
                                        ) : (
                                            <div className='flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-700 rounded-lg p-2'>
                                                {(() => {
                                                    const IconComponent = getFileIcon(item.type);
                                                    return <IconComponent className='w-6 h-6 text-gray-600 dark:text-gray-400 mb-1' />;
                                                })()}
                                                <p className='text-xs text-gray-600 dark:text-gray-400 text-center truncate w-full'>
                                                    {item.name}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Text Section */}
                {text && (
                    <div className={`px-4 ${img && img.length > 0 ? 'pb-4' : 'py-4'}`}>
                        <p className='text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap'>
                            {text}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}