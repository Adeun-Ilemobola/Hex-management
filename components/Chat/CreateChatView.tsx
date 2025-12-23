"use client"
import React, { useState } from 'react'
import { trpc as api } from '@/lib/client' 
import {  Loader2, UserX, SearchIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner' 

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ButtonGroup } from '../ui/button-group'
import { Input } from '../ui/input'

type CreateChatViewProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean
}

export default function CreateChatView({ setIsOpen, isOpen }: CreateChatViewProps) {
    const [search, setSearch] = useState("")

    // TRPC Mutations
    const searchUsers = api.user.SearchUserByEmail.useMutation()
    const createNewPrivateChat = api.Chat.CreatPrivateChat.useMutation({
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message)
                setIsOpen(false)
            } else {
                toast.error(data.message)
            }
        },
        onError: (err) => {
            toast.error(err.message)
        }
    })

    function handleSearch() {
        searchUsers.mutate({
            email: search
        })
        setTimeout(() => {
            setSearch("")
        }, 1000)
    }

    const handleCreateChat = (email: string) => {
        createNewPrivateChat.mutate({ emails: [email] })
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {/* Glassmorphism Sheet Content 
              1. Surface: High opacity background for readability over main app content
              2. Blur: Strong blur to separate context
              3. Edges: Left border with white opacity
            */}
            <SheetContent 
                side="right" 
                className="
                    w-full sm:w-120 flex flex-col p-0 gap-0 
                    bg-white/80 dark:bg-black/70 
                    backdrop-blur-[20px] 
                    border-l border-white/20 dark:border-white/10
                    shadow-[-10px_0_30px_rgba(0,0,0,0.1)]
                    z-50
                "
            >

                {/* Header Section */}
                <div className="p-6 border-b border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-md z-10">
                    <SheetHeader className="mb-4">
                        <SheetTitle className="text-slate-800 dark:text-slate-100 drop-shadow-sm">
                            New Conversation
                        </SheetTitle>
                    </SheetHeader>

                    <ButtonGroup className='w-full flex items-center shadow-sm'>
                        {/* Glass Input */}
                        <Input 
                            placeholder="Search users by email..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            className="
                                flex-1
                                bg-white/50 dark:bg-black/30
                                border-white/30 dark:border-white/10
                                focus-visible:ring-[#2563eb]/50 dark:focus-visible:ring-[#d8b4fe]/50
                                placeholder:text-slate-500 dark:placeholder:text-slate-400
                                backdrop-blur-sm
                            "
                        />
                        {/* Glass Search Button */}
                        <Button 
                            onClick={() => handleSearch()}
                            variant="outline" 
                            aria-label="Search"
                            className="
                                border-l-0
                                bg-white/50 dark:bg-black/30
                                border-white/30 dark:border-white/10
                                hover:bg-[#2563eb]/10 dark:hover:bg-[#d8b4fe]/10
                                text-slate-600 dark:text-slate-300
                            "
                        >
                            <SearchIcon className="h-4 w-4" />
                        </Button>
                    </ButtonGroup>
                </div>

                {/* Results Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">

                    {/* 1. Loading State */}
                    {searchUsers.isPending && (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500 dark:text-slate-400 space-y-3">
                            <div className="p-3 bg-white/20 dark:bg-white/5 rounded-full backdrop-blur-md shadow-sm">
                                <Loader2 className="h-6 w-6 animate-spin text-[#2563eb] dark:text-[#d8b4fe]" />
                            </div>
                            <p className="text-sm font-medium">Searching users...</p>
                        </div>
                    )}

                    {/* 2. Empty State */}
                    {searchUsers.isSuccess && searchUsers.data?.value.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500 dark:text-slate-400 space-y-3">
                            <div className="p-4 bg-white/20 dark:bg-white/5 rounded-full backdrop-blur-md border border-white/10">
                                <UserX className="h-8 w-8 opacity-60" />
                            </div>
                            <p className="text-sm font-medium">No users found</p>
                        </div>
                    )}

                    {/* 3. Results List */}
                    {searchUsers.data?.value.map((user) => (
                        <div
                            key={user.id}
                            // Glass Card Design
                            className="
                                flex items-center justify-between p-3 rounded-xl 
                                border-0 ring-1 ring-white/40 dark:ring-white/10
                                bg-white/40 dark:bg-white/5 
                                hover:bg-white/60 dark:hover:bg-white/10
                                backdrop-blur-[12px]
                                shadow-[0_4px_20px_rgba(0,0,0,0.05)]
                                hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]
                                transition-all duration-300 ease-out
                                group
                            "
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <Avatar className="h-10 w-10 ring-2 ring-white/30 dark:ring-white/10 shadow-sm">
                                    <AvatarImage src={user.image || undefined} />
                                    <AvatarFallback className="bg-[#2563eb]/10 dark:bg-[#d8b4fe]/10 text-[#2563eb] dark:text-[#d8b4fe]">
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-[#9333ea] dark:group-hover:text-[#a855f7] transition-colors">
                                        {user.name}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {user.email}
                                    </span>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                disabled={!user.directMessage || createNewPrivateChat.isPending}
                                onClick={() => handleCreateChat(user.email)}
                                className={`
                                    shrink-0 shadow-md backdrop-blur-sm border border-white/10
                                    transition-all duration-300
                                    ${user.directMessage 
                                        ? "bg-[#2563eb]/80 hover:bg-[#2563eb] dark:bg-[#d8b4fe]/80 dark:hover:bg-[#d8b4fe] text-white dark:text-slate-900" 
                                        : "bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed"}
                                `}
                            >
                                {createNewPrivateChat.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    user.directMessage ? "Message" : "Unavailable"
                                )}
                            </Button>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}