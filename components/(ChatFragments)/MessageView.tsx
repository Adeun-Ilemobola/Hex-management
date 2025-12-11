import React from 'react'
import ChatSend from './ChatSend'
import { Message } from '@/lib/Zod'
import ScrollBox from '../Scroll';
import ChatBox from './ChatBox';
import Loading from '../Loading';

type chat = {
    text: string | null;
    images: {
        id: string;
        name: string;
        url: string;
        size: number;
        type: string;
        lastModified: bigint;
        supabaseID: string;
        ChatRoomID: string;
        chatOwnerID: string;
        messageId: string;
    }[];
    id: string;
    roomId: string;
    authorId: string;
    createdAt: Date;
    isDeleted: boolean;
}
interface MessageViewProps {
    sendMessage: (data: Message) => void
    roomId: string
    userId: string
    chats: chat[]
    ScrollBoxRef: React.RefObject<HTMLDivElement>
    loading: boolean

}

export default function MessageView({ sendMessage, roomId, userId, chats, ScrollBoxRef, loading }: MessageViewProps) {
    if (loading) {
        return (
            <div className='flex flex-col flex-1 overflow-hidden'>
                <Loading full={false} />
            </div>
        )
    }
    if (roomId === "") {
        return (
            <div className='flex flex-col flex-1 items-center justify-center overflow-hidden'>
                <h1 className='text-3xl font-bold opacity-25'>No Chat Selected</h1>
            </div>
        )
    }
    return (
        <div className='flex flex-col flex-1 basis-0 min-h-0 overflow-hidden"'>
            <ScrollBox
                className=''
                ref={ScrollBoxRef}
            >
                {chats.map((message) => (
                    <ChatBox
                        key={message.id}
                        id={message.id}
                        text={message.text || ""}
                        img={message.images || []}
                        authorId={message.authorId}
                        roomId={roomId}
                        isUser={message.authorId === userId}
                    />
                ))}
            </ScrollBox>
            <ChatSend
                sendMessage={sendMessage}
                roomId={roomId}
                userId={userId}
            />

        </div>
    )
}
