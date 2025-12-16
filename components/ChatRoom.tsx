import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area' // Recommended wrapper
import { X, Paperclip, Send } from 'lucide-react' // Icons make it cleaner

// Importing your specific utils
import { File_To_FileXList } from '@/lib/utils'
import { defaultMessageInput, FileXInput, MessageSchema, Message } from '@/lib/ZodObject'
import { toast } from 'sonner'
import MessageCard from './MessageCard'

// --- Types ---
type ChatRoomProps = {
    roomId: string;
    authorId: string;
    submit: (data: Message) => void;
    roohasSelected: boolean,
    messages: Message[],
    getMembers: (id: string) => string
}

// --- Main Component ---
export default function ChatRoom({ roomId, authorId, submit, roohasSelected, messages, getMembers }: ChatRoomProps) {
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
            files,
            roomId,
            authorId
        })

        if (!validation.success) {
            // detailed error handling
            validation.error.issues.forEach(err => {
                toast.error(`Error in ${err.path.join(",")}: ${err.message}`);
            })
            console.log(validation.error.issues)
            return
        }

        // Submit and Reset
        submit(validation.data)
        setMessage(defaultMessageInput)
        setFiles([])
    }
    if (!roohasSelected) {
        return (
            <div className="flex flex-col min-h-full  items-center justify-center w-full bg-background">
                {/* <Header roomId={roomId} /> */}
                <div className='flex-1 p-4 overflow-y-auto space-y-4'>
                    <div className="text-center text-muted-foreground text-sm">
                        Select a room first
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-full w-full bg-background">
            <Header roomId={roomId} />

            {/* Messages Area */}
            <div className='flex-1 p-4 overflow-y-auto space-y-4'>
                {/* Map your messages here. Example placeholder: */}
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
            />
        </div>
    )
}

function Header({ roomId }: { roomId: string }) {
    return (
        <div className="h-14 border-b flex items-center px-4 font-semibold shadow-sm">
            Chat Room: {roomId}
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
    onRemoveFile: (index: number) => void
}

function Footer({ files, text, setText, sendMessage, onFileSelect, onRemoveFile }: FooterProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Handle native file input change
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(Array.from(e.target.files))
        }
        // Reset value so same file can be selected again if needed
        e.target.value = ''
    }

    return (
        <div className='flex flex-col gap-2 p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>

            {files.length > 0 && (
                <div className='flex flex-row gap-3 overflow-x-auto pb-2'>
                    {files.map((file, idx) => (
                        <div key={`${file.name}-${idx}`} className='relative group shrink-0'>
                            <div className='h-20 w-20 rounded-lg overflow-hidden border border-border'>
                                <Image
                                    src={file.link}
                                    alt={file.name}
                                    width={80}
                                    height={80}
                                    className='object-cover h-full w-full'
                                />
                            </div>
                            {/* Remove Button */}
                            <Button
                                onClick={() => onRemoveFile(idx)}
                                size={"icon-sm"}
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
                    multiple // Allow multiple files
                    className='hidden'
                    onChange={handleInputChange}
                />

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload images"
                >
                    <Paperclip className="h-4 w-4" />
                </Button>

                <Input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                />

                <Button onClick={sendMessage} size="icon">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}