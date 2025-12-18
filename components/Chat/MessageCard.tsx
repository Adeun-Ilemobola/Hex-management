import React from 'react'
import Image from 'next/image'
import { FileXInput, Message } from '@/lib/ZodObject' 
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils' 

interface MessageCardProps {
    name: string
    message: Message
    isMe: boolean
}

export default function MessageCard({ name, message, isMe }: MessageCardProps) {
    // 1. Dynamic Terminal Styling
    const userColor = isMe ? "text-emerald-400" : "text-cyan-400"; // Sender (Green), Receiver (Cyan)
    const promptChar = isMe ? "➜" : "$";
    const borderColor = isMe ? "border-emerald-500/20 hover:border-emerald-500/40" : "border-cyan-500/20 hover:border-cyan-500/40";
    const bgHover = isMe ? "hover:bg-emerald-950/10" : "hover:bg-cyan-950/10";

    // 2. Safe Timestamp (avoid hydration mismatch by using message time or defaulting safely)
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit" });

    return (
        <div className={cn(
            "group flex flex-col w-full mb-2 p-3 rounded-md border bg-black/40 backdrop-blur-md transition-all duration-300",
            borderColor,
            bgHover
        )}>
            {/* --- Terminal Text Stream --- 
                We use a single wrapper with 'break-words' and 'whitespace-pre-wrap' 
                to let the message flow naturally after the prompt. 
            */}
            <div className="font-mono text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground/90">
                {/* Meta Data (Non-selectable to feel like a prompt) */}
                <span className="select-none inline-flex items-center mr-2 opacity-50 text-xs align-baseline">
                    [{time}]
                </span>
                
                <span className={cn("select-none font-bold tracking-wide mr-2", userColor)}>
                    {isMe ? "root@system" : name.toLowerCase().replace(" ", "_")}
                </span>
                
                <span className="select-none text-muted-foreground mr-2 opacity-70">
                    {promptChar}
                </span>

                {/* Actual Message Content */}
                <span className="text-gray-100">
                    {message.text}
                </span>
            </div>

            {/* --- Attachments Grid --- */}
            {message.files && message.files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {message.files.map((file: FileXInput, idx: number) => (
                        <FileAttachment 
                            key={`${file.name}-${idx}`} 
                            file={file} 
                            colorClass={userColor} 
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// --- Sub-Component: File Attachment ---
function FileAttachment({ file, colorClass }: { file: FileXInput, colorClass: string }) {
    return (
        <a 
            href={file.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block group/file relative rounded border border-white/10 bg-black/50 overflow-hidden transition-all hover:border-white/30"
        >
            {/* Terminal File Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center bg-black/80 backdrop-blur px-2 py-1.5 border-b border-white/5">
                <span className="text-[10px] font-mono text-gray-400 truncate max-w-[85%]">
                    ./{file.name}
                </span>
                <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover/file:opacity-100 transition-opacity" />
            </div>

            {/* Image Preview */}
            <div className="relative aspect-video w-full">
                <Image
                    src={file.link}
                    alt={file.name}
                    fill
                    className="object-cover opacity-80 group-hover/file:opacity-100 transition-all duration-500 group-hover/file:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                />
            </div>

            {/* Dynamic Hover Glow Scanline */}
            <div className={cn(
                "absolute inset-0 z-10 opacity-0 group-hover/file:opacity-20 pointer-events-none transition-opacity duration-300 bg-gradient-to-t from-current to-transparent",
                colorClass
            )} />
        </a>
    )
}