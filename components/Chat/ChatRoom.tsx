import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { X, Paperclip, Send } from 'lucide-react'
import { toast } from 'sonner'

// Importing your specific utils - assuming these exist in the user's project
import { File_To_FileXList } from '@/lib/utils'
import { defaultMessageInput, FileXInput, MessageSchema, Message } from '@/lib/ZodObject'
import MessageCard from './MessageCard'

// --- Types ---
type ChatRoomProps = {
    roomId: string;
    authorId: string;
    submit: (data: Message) => void;
    roohasSelected: boolean,
    messages: Message[],
    getMembers: (id: string) => string,
    messageSending: boolean
}

// --- Main Component ---
export default function ChatRoom({ roomId, authorId, submit, roohasSelected, messages, getMembers, messageSending }: ChatRoomProps) {
    const [files, setFiles] = useState<FileXInput[]>([])
    const [Message, setMessage] = useState<Message>({ ...defaultMessageInput })

    // Auto-scroll to bottom ref
    const scrollRef = useRef<HTMLDivElement>(null)

    // 1. Handle File Selection
    async function handleFileSelect(selectedFiles: File[]) {
        if (!selectedFiles.length) return;

        try {
            const newFileXList = await File_To_FileXList(selectedFiles)
            setFiles(prev => [...prev, ...newFileXList])
        } catch (error) {
            console.error("File processing failed", error)
        }
    }

    // 2. Remove a specific file from the preview
    function removeFile(indexToRemove: number) {
        setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove))
    }

    // 3. Handle Send
    function handleSendMessage() {
        if (!roohasSelected) {
            toast.error("Select a room first")
            return
        }
        // Validate
        const validation = MessageSchema.safeParse({
            ...Message,
            files: files.map(f => ({
                ...f,
                chatOwnerID: authorId,
                chatRoomID: roomId,
            })),
            roomId,
            authorId
        })

        if (!validation.success) {
            validation.error.issues.forEach(err => {
                toast.error(`Error in ${err.path.join(",")}: ${err.message}`);
            })
            return
        }

        // Submit and Reset
        submit(validation.data)
        setMessage(defaultMessageInput)
        setFiles([])
    }

    // --- Glassmorphism Container Classes ---
    // 1. Surface: High transparency white/black with blur
    // 2. Edges: White ring/border with opacity
    // 3. Depth: Shadow
    const glassContainerClasses = "flex flex-col h-full w-full backdrop-blur-[20px] bg-white/60 dark:bg-black/40 ring-1 ring-white/20 dark:ring-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"

    if (!roohasSelected) {
        return (
            <div className={`${glassContainerClasses} items-center justify-center`}>
                <div className='flex-1 p-4 overflow-y-auto space-y-4 flex items-center justify-center'>
                    <div className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium p-6 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/10">
                        Select a room first
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={glassContainerClasses}>
            <Header roomId={roomId} />

            {/* Messages Area */}
            {/* Added custom-scrollbar class usually needed for glass UIs to hide ugly default scrollbars */}
            <div className='flex-1 min-h-0 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent'>
                {messages.map((message, index) => (
                    <MessageCard
                        key={index}
                        name={getMembers(message.authorId)}
                        message={message}
                        isMe={message.authorId === authorId}
                    />
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Footer / Input Area */}
            <Footer
                files={files}
                text={Message.text}
                setText={(s) => setMessage({ ...Message, text: s })}
                onFileSelect={handleFileSelect}
                onRemoveFile={removeFile}
                sendMessage={handleSendMessage}
                messageSending={messageSending}
            />
        </div>
    )
}

function Header({ roomId }: { roomId: string }) {
    return (
        <div className="
            h-14 flex items-center px-4 font-semibold shadow-sm z-10
            border-b border-white/20 dark:border-white/10
            bg-white/10 dark:bg-white/5 backdrop-blur-md
        ">
            <span className="text-slate-800 dark:text-slate-100 drop-shadow-sm">
                Chat Room: <span className="opacity-80 font-normal">{roomId}</span>
            </span>
        </div>
    )
}

// --- Footer Component ---

type FooterProps = {
    files: FileXInput[],
    text: string,
    setText: (s: string) => void,
    sendMessage: () => void,
    onFileSelect: (f: File[]) => void,
    onRemoveFile: (index: number) => void,
    messageSending: boolean
}

function Footer({ files, text, setText, sendMessage, onFileSelect, onRemoveFile, messageSending }: FooterProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(Array.from(e.target.files))
        }
        e.target.value = ''
    }

    return (
        <div className='
            flex flex-col gap-2 p-4 
            border-t border-white/20 dark:border-white/10
            bg-white/40 dark:bg-black/20 
            backdrop-blur-[10px]
        '>

            {files.length > 0 && (
                <div className='flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-none'>
                    {files.map((file, idx) => (
                        <div key={`${file.name}-${idx}`} className='relative group shrink-0 animate-in fade-in zoom-in duration-200'>
                            <div className='
                                h-20 w-20 rounded-lg overflow-hidden 
                                border border-white/20 dark:border-white/10
                                shadow-sm bg-white/20 dark:bg-white/5
                            '>
                                <Image
                                    src={file.link}
                                    alt={file.name}
                                    width={80}
                                    height={80}
                                    className='object-cover h-full w-full opacity-90 group-hover:opacity-100 transition-opacity'
                                />
                            </div>
                            {/* Remove Button - Glass Style */}
                            <Button
                                onClick={() => onRemoveFile(idx)}
                                className='
                                    absolute -top-2 -right-2 h-6 w-6 rounded-full p-0
                                    bg-[#db2777]/80 hover:bg-[#db2777] dark:bg-[#f472b6]/80 dark:hover:bg-[#f472b6]
                                    text-white border border-white/20 shadow-md backdrop-blur-sm
                                '
                                size={"icon"}
                            >
                                <X size={12} />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Bar */}
            <div className='flex flex-row gap-2 items-center'>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className='hidden'
                    onChange={handleInputChange}
                    disabled={messageSending}
                />

                {/* Attachment Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload images"
                    disabled={messageSending}
                    className='
                        text-slate-600 dark:text-slate-300
                        hover:bg-white/20 dark:hover:bg-white/10
                        hover:text-[#9333ea] dark:hover:text-[#a855f7]
                        transition-colors duration-300
                    '
                >
                    <Paperclip className="h-5 w-5" />
                </Button>

                {/* Text Input - Glass Field */}
                <Input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={messageSending}
                    className='
                        flex-1 
                        bg-white/30 dark:bg-white/5 
                        border-white/20 dark:border-white/10 
                        focus-visible:ring-[#2563eb]/50 dark:focus-visible:ring-[#d8b4fe]/50
                        focus-visible:border-[#2563eb]/50 dark:focus-visible:border-[#d8b4fe]/50
                        placeholder:text-slate-500 dark:placeholder:text-slate-400
                        text-slate-800 dark:text-slate-100
                        backdrop-blur-sm
                    '
                />

                {/* Send Button */}
                <Button 
                    onClick={sendMessage} 
                    disabled={messageSending} 
                    size="icon"
                    className='
                        bg-[#2563eb]/80 hover:bg-[#2563eb] 
                        dark:bg-[#d8b4fe]/80 dark:hover:bg-[#d8b4fe]
                        text-white dark:text-slate-900
                        shadow-[0_0_15px_rgba(37,99,235,0.3)] dark:shadow-[0_0_15px_rgba(216,180,254,0.3)]
                        border border-white/10 backdrop-blur-md
                        transition-all duration-300
                    '
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}