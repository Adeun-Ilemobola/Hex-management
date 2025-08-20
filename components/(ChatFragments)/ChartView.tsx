"use client"
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/trpc';
import { ChatRoom } from '@/lib/Zod';
import React, { useEffect, useState, useCallback, use } from 'react'
import Chatheader from './Chatheader';
import Loading from '../Loading';
import ChatBox from './ChatBox';
import ChatSend from './ChatSend';
import ChatRoomCard from './ChatRoomCard';
import { Nav } from '../Nav';
interface RoomDataProps {
    id: string;
    member: {
        name: string;
        id: string;
        userId: string;
        isAdmin: boolean;
        joinedAt: string;
    }[];
    roomId: string;
    isAdmin: boolean;
    notificationCount: number;
    joinedAt: string;

}

interface ChatRoomCardProps {
    id: string;
    title: string;
    notificationCount: number;
    participants: {
        name: string;
        isAdmin: boolean;
    }[];
    select: () => void;
}

// Fake data for ChatRoomCardProps
const fakeChatRooms: ChatRoomCardProps[] = [
    {
        id: "room-001",
        title: "Frontend Team",
        notificationCount: 3,
        participants: [
            { name: "Alice Johnson", isAdmin: true },
            { name: "Bob Smith", isAdmin: false },
            { name: "Carol Williams", isAdmin: false },
            { name: "David Brown", isAdmin: false }
        ],
        select: () => console.log("Selected Frontend Team")
    },
    {
        id: "room-002",
        title: "Project Alpha",
        notificationCount: 0,
        participants: [
            { name: "Emily Davis", isAdmin: true },
            { name: "Frank Miller", isAdmin: true },
            { name: "Grace Wilson", isAdmin: false },
            { name: "Henry Taylor", isAdmin: false },
            { name: "Ivy Anderson", isAdmin: false }
        ],
        select: () => console.log("Selected Project Alpha")
    },
    {
        id: "room-003",
        title: "Design Review",
        notificationCount: 12,
        participants: [
            { name: "Jack Thompson", isAdmin: true },
            { name: "Kate Roberts", isAdmin: false },
            { name: "Liam Clark", isAdmin: false }
        ],
        select: () => console.log("Selected Design Review")
    },
    {
        id: "room-004",
        title: "Random Chat",
        notificationCount: 7,
        participants: [
            { name: "Mia Rodriguez", isAdmin: false },
            { name: "Noah Lewis", isAdmin: false },
            { name: "Olivia Martinez", isAdmin: true },
            { name: "Peter Garcia", isAdmin: false },
            { name: "Quinn Lopez", isAdmin: false },
            { name: "Rachel Kim", isAdmin: false }
        ],
        select: () => console.log("Selected Random Chat")
    },
    {
        id: "room-005",
        title: "Bug Fixes",
        notificationCount: 1,
        participants: [
            { name: "Sam Johnson", isAdmin: true },
            { name: "Tina White", isAdmin: false }
        ],
        select: () => console.log("Selected Bug Fixes")
    },
    {
        id: "room-006",
        title: "Marketing Strategy",
        notificationCount: 25,
        participants: [
            { name: "Uma Patel", isAdmin: true },
            { name: "Victor Chen", isAdmin: true },
            { name: "Wendy Zhang", isAdmin: false },
            { name: "Xavier Singh", isAdmin: false },
            { name: "Yuki Tanaka", isAdmin: false },
            { name: "Zoe Carter", isAdmin: false },
            { name: "Alex Morgan", isAdmin: false }
        ],
        select: () => console.log("Selected Marketing Strategy")
    },
    {
        id: "room-007",
        title: "Coffee Break",
        notificationCount: 0,
        participants: [
            { name: "Blake Nelson", isAdmin: false },
            { name: "Chloe Evans", isAdmin: false },
            { name: "Dylan Cooper", isAdmin: true }
        ],
        select: () => console.log("Selected Coffee Break")
    },
    {
        id: "room-008",
        title: "Tech Support",
        notificationCount: 5,
        participants: [
            { name: "Elena Foster", isAdmin: true },
            { name: "Felix Rivera", isAdmin: true },
            { name: "Gabriella Hayes", isAdmin: false },
            { name: "Hassan Ali", isAdmin: false }
        ],
        select: () => console.log("Selected Tech Support")
    }
];

export { fakeChatRooms, type ChatRoomCardProps };
export default function ChartView() {
    const { data: session, isPending } = authClient.useSession();
    const [roonId, setRoomId] = useState("");
    const [room, setRoom] = useState<ChatRoom | null>(null);
    const roomChatsFetch = api.ChatRoom.getRoomChatById.useQuery({ roomId: roonId }, {
        // polling

        refetchIntervalInBackground: true,
        // chat usually wants zero stale tolerance
        staleTime: 0,
        // don't spam re-fetch just by remounting
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        // optional: trim/normalize to avoid needless re-renders
        //   select: React.useCallback(
        //     (data: { messages: Array<{ id: string; createdAt: string } & any> }) => {
        //       // sort & dedupe by id (server should do this too)
        //       const seen = new Set<string>();
        //       const msgs = data.messages
        //         .slice()
        //         .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
        //         .filter(m => (seen.has(m.id) ? false : (seen.add(m.id), true)));
        //       return { messages: msgs };
        //     },
        //     []
        //   ),
        // structural sharing keeps referential stability when unchanged
        structuralSharing: true,

    })
    const messageSend = api.ChatRoom.newMessage.useMutation({

    })
    useEffect(() => {
        const data = roomChatsFetch.data?.value;
        if (data) {
            const cleanedData = {
                ...data,
                chats: data.chats.map((msg) => ({
                    ...msg,
                    createdAt: new Date(msg.createdAt),
                    images: msg.images.map(img => {
                        const { ...rest } = img;
                        return {
                            ...rest,
                            createdAt: new Date(img.createdAt),
                            updatedAt: new Date(img.updatedAt),
                        };
                    })
                })),
                participants: data.participants.map(participant => ({
                    ...participant,
                    joinedAt: new Date(participant.joinedAt),
                }))
            }

            setRoom(cleanedData);
        }
    }, [roomChatsFetch]);
    return (
        <>
            <Nav session={session} SignOut={authClient.signOut} />


            <div className='flex flex-col flex-1 m-auto min-w-[38rem] overflow-y-auto overflow-x-hidden p-2.5'>
                <div className='relative flex flex-col w-full flex-1  overflow-hidden p-2.5'>
                    {/* show when room is selected  the chat header*/}
                    {room && <Chatheader
                        Back={() => setRoomId("")}
                        mebers={room?.participants.map(participant => participant.userName) || []}
                        title={room?.title}
                    />}
                    {/* show when room is selected the chat room */}
                    {(room && roonId) && (
                        <>
                            {roomChatsFetch.isPending ? (<div className='flex flex-1 items-center justify-center h-full '><Loading full={false} /></div>)
                                : (<>
                                    <div className='  overflow-y-auto flex flex-1 flex-col gap-5 '>

                                        {room.chats.map((message) => (
                                            <ChatBox
                                                key={message.id}
                                                id={message.id}
                                                text={message.text || ""}
                                                img={message.images || []}

                                                authorId={message.authorId}
                                                roomId={roonId}
                                                isUser={message.authorId === session?.user.id}

                                            />
                                        ))}
                                    </div>
                                </>
                                )}

                        </>
                    )}
                    {/* show when no room is selected foe the room list */}
                    {(!room  ) && (
                        <>
                        {}
                        <div className=' overflow-y-auto flex flex-1 flex-col p-0.5  gap-3 items-center'>
                            {fakeChatRooms.map((room) => (
                                <ChatRoomCard
                                    key={room.id}
                                    id={room.id}
                                    title={room.title}
                                    notificationCount={room.notificationCount}
                                    participants={room.participants}
                                    select={room.select}
                                />
                            ))}

                        </div>
                        
                        </>
                    )}



                    {room && (<>
                        <div className=' overflow-y-auto'>
                            <ChatSend
                                roomId={roonId}
                                sendMessage={(data) => messageSend.mutate(data)}
                                userId={session?.user.id || ""}

                            />


                        </div>
                    </>)}

                </div>
            </div>

        </>
    )
}
