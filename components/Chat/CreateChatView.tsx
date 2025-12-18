"use client"
import React, { useState } from 'react'
import { trpc as api } from '@/lib/client' 
import { Search, Loader2, UserX, MessageSquarePlus, SearchIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner' // Assuming you use Sonner or similar

// Use Sheet for side panels (recommended over Drawer for desktop sidebars)
// If you must use Drawer, ensure your CSS supports 'direction=right' correctly.
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

    // Handlers
    
    const handleCreateChat = (email: string) => {
        createNewPrivateChat.mutate({ emails: [email] })

    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>

            {/* Side Sheet Content */}
            <SheetContent side="right" className="w-full sm:w-120 flex flex-col p-0 gap-0">

                {/* Header Section */}
                <div className="p-6 border-b">
                    <SheetHeader className="mb-4">
                        <SheetTitle>New Conversation</SheetTitle>
                    </SheetHeader>

                    <ButtonGroup className='w-67'>
                        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button 
                        onClick={() => handleSearch()}
                        variant="outline" aria-label="Search">
                            <SearchIcon />
                        </Button>
                    </ButtonGroup>




                </div>

                {/* Results Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">

                    {/* 1. Loading State (Initial Search) */}
                    {searchUsers.isPending && (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground space-y-2">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="text-sm">Searching users...</p>
                        </div>
                    )}

                    {/* 2. Empty State (Search Complete, No Results) */}
                    {searchUsers.isSuccess && searchUsers.data?.value.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground space-y-2">
                            <UserX className="h-10 w-10 opacity-50" />
                            <p>No users found</p>
                        </div>
                    )}

                    {/* 3. Results List */}
                    {searchUsers.data?.value.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors group"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={user.image || undefined} />
                                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-medium truncate">{user.name}</span>
                                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant={user.directMessage ? "default" : "secondary"}
                                disabled={!user.directMessage || createNewPrivateChat.isPending}
                                onClick={() => handleCreateChat(user.email)}
                                className="shrink-0"
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