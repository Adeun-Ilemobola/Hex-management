import React from 'react'
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import CreateChatView from './CreateChatView';
import { Spinner } from "@/components/ui/spinner"

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
    isLoading?: boolean,
    userId: string
}

export default function ChatSidebar({ rooms, SelectRoom, size = 300, isLoading , userId }: ChatSidebarProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    return (
        <div

            style={{ width: size }}
            className="flex flex-col border-r border-border bg-background min-h-full"
        >
            {/* Header Area */}
            <div className='p-4 border-b border-border flex justify-between items-center'>
                <span className="font-semibold text-sm text-muted-foreground">Chats</span>
                <Button
                    onClick={() => setIsOpen(true)}
                    variant="outline" size="sm">
                    + New Room
                </Button>
                <CreateChatView setIsOpen={setIsOpen} isOpen={isOpen} />
            </div>

            {/* Room List */}
            <div className={` flex flex-col flex-1 gap-2 p-2 overflow-y-auto ${isLoading && ' items-center justify-center'}`}>

                {isLoading && <span className="text-muted-foreground text-sm">Loading...</span>}
                {
                    !isLoading && rooms.length === 0 &&
                    <span className="text-muted-foreground text-sm">No rooms found</span>
                }
                {
                    isLoading && (<>
                     <Spinner className="size-6" />

                    </>)

                }

                {
                    !isLoading && (<>
                        {rooms.map(room => (
                            <RoomCard 
                            key={room.id} 
                            room={{
                                ...room,
                                title:room.RoomMembers.length > 2 ? room.title : room.RoomMembers.filter(m => m.userId !== userId)[0].userName
                            }} 
                            onClick={SelectRoom} />
                        ))}

                    </>)

                }

            </div>
        </div>
    )
}

type RoomCardProps = {
    room: Room,
    onClick: (id: string) => void
}

function RoomCard({ room, onClick }: RoomCardProps) {
    return (
        <Card
            onClick={() => onClick(room.id)}
            className='cursor-pointer hover:bg-accent/50 transition-colors border-transparent hover:border-border'
        >
            <CardContent className='flex flex-row items-center justify-between p-4'>

                {/* 5. 'truncate' handles overflow, ellipsis, and whitespace automatically */}
                <h2 className='font-medium text-sm truncate mr-2'>
                    {room.title}
                </h2>

                {room.notificationCount > 0 && (
                    // 6. Centered text in badge and prevented it from shrinking
                    <div className='flex items-center justify-center bg-red-500 text-white text-[10px] h-5 w-5 rounded-full flex-shrink-0'>
                        {room.notificationCount > 9 ? '9+' : room.notificationCount}
                    </div>
                )}

            </CardContent>
        </Card>
    )
}