import React from 'react'
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Spinner } from "@/components/ui/spinner"
import CreateChatView from './CreateChatView';

// --- Types ---
type Room = {
    notificationCount: number;
    id: string;
    type: "PRIVATE" | "GROUP";
    title: string;
    RoomMembers: { userId: string; userName: string }[]
}

type ChatSidebarProps = {
    rooms: Room[]
    SelectRoom: (roomId: string) => void
    size?: number
    isLoading: boolean,
    userId: string
}

type RoomCardProps = {
    room: Room,
    onClick: (id: string) => void
}

// --- Components ---

export default function ChatSidebar({ rooms, SelectRoom, size = 300, isLoading, userId }: ChatSidebarProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <aside
            style={{ width: size }}
            // Glassmorphism Container
            // 1. Surface: bg-white/60 (light) | bg-black/40 (dark)
            // 2. Blur: backdrop-blur-[20px]
            // 3. Edges: border-r with white opacity
            // 4. Depth: Shadow
            className="flex flex-col h-full
            bg-white/60 dark:bg-black/40 
            backdrop-blur-[20px] 
            border-r border-white/20 dark:border-white/10
            shadow-[5px_0_30px_rgba(0,0,0,0.05)]
            relative z-20"
        >
            {/* Header Area */}
            <div className='p-4 border-b border-white/20 dark:border-white/10 flex justify-between items-center z-10'>
                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 tracking-tight drop-shadow-sm">
                    Chats
                </span>
                
                {/* Glass Button: Primary Base Colors */}
                <Button
                    onClick={() => setIsOpen(true)}
                    variant="ghost" 
                    size="sm"
                    className="
                        transition-all duration-300
                        bg-[#2563eb]/10 hover:bg-[#2563eb]/20 
                        text-[#2563eb] border border-[#2563eb]/20
                        dark:bg-[#d8b4fe]/10 dark:hover:bg-[#d8b4fe]/20 
                        dark:text-[#d8b4fe] dark:border-[#d8b4fe]/20
                        backdrop-blur-sm shadow-sm
                    "
                >
                    + New Room
                </Button>
                <CreateChatView setIsOpen={setIsOpen} isOpen={isOpen} />
            </div>

            {/* Room List */}
            <div className={`flex flex-col flex-1 gap-3 p-3 overflow-y-auto custom-scrollbar ${isLoading ? 'items-center justify-center' : ''}`}>
                {isLoading && (
                    <div className="p-4 bg-white/20 dark:bg-white/5 rounded-full backdrop-blur-md">
                        <Spinner className="size-8 text-[#2563eb] dark:text-[#d8b4fe]" />
                    </div>
                )}
                
                {!isLoading && rooms.length === 0 && (
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium italic p-4 text-center bg-white/20 dark:bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                        No rooms found
                    </span>
                )}

                {!isLoading && rooms.length > 0 && (
                    <>
                        {rooms.map(room => (
                            <RoomCard
                                key={room.id}
                                room={{
                                    ...room,
                                    title: room.RoomMembers.length > 2 ? room.title : room.RoomMembers.filter(m => m.userId !== userId)[0]?.userName || "Unknown"
                                }}
                                onClick={SelectRoom} 
                            />
                        ))}
                    </>
                )}
            </div>
        </aside>
    )
}

function RoomCard({ room, onClick }: RoomCardProps) {
    return (
        <Card
            onClick={() => onClick(room.id)}
            // Room Card Glass Styling
            // 1. Surface: High transparency white
            // 2. Edge: Ring with varying opacity
            // 3. Hover: Uses Accent Base colors (#9333ea | #a855f7)
            className='
                cursor-pointer group relative overflow-hidden border-0
                transition-all duration-300 ease-out
                bg-white/40 dark:bg-white/5 
                hover:bg-white/60 dark:hover:bg-white/10
                backdrop-blur-[12px]
                ring-1 ring-white/40 dark:ring-white/10
                hover:ring-[#9333ea]/30 dark:hover:ring-[#a855f7]/30
                shadow-[0_4px_30px_rgba(0,0,0,0.05)]
                hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]
                hover:-translate-y-0.5
            '
        >
            {/* Subtle Gradient Glow on Hover (Accent Color) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-[#9333ea]/10 to-transparent dark:from-[#a855f7]/10" />

            <CardContent className='flex flex-row items-center justify-between p-4 relative z-10'>
                <h2 className='font-medium text-sm truncate mr-2 text-slate-800 dark:text-slate-100 group-hover:text-[#9333ea] dark:group-hover:text-[#a855f7] transition-colors'>
                    {room.title}
                </h2>

                {room.notificationCount > 0 && (
                    // Highlight Base: Light [#db2777] | Dark [#f472b6]
                    // Badge styled as a glowing glass orb
                    <div className='
                        flex items-center justify-center 
                        text-white font-bold text-[10px] 
                        h-5 w-5 rounded-full flex-shrink-0
                        bg-[#db2777] dark:bg-[#f472b6]
                        shadow-[0_0_10px_rgba(219,39,119,0.5)] dark:shadow-[0_0_10px_rgba(244,114,182,0.5)]
                        ring-1 ring-white/50
                    '>
                        {room.notificationCount > 9 ? '9+' : room.notificationCount}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}