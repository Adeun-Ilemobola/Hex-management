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

export default function MessageView({ sendMessage, roomId, userId, chats, ScrollBoxRef , loading }: MessageViewProps) {
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
        <div className='flex flex-col flex-1 overflow-hidden'>

            <ScrollBox
                className='flex-1'
                ref={ScrollBoxRef}


            >
                <div
                    className="
                        relative  flex w-full flex-col gap-4
                        px-2 py-4 sm:px-2 md:px-3 md:py-3
                      "
                >
                    {/* Background accents */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_40%_at_50%_20%,black,transparent)]"
                        style={{
                            background:
                                "radial-gradient(1200px 350px at 50% -10%, rgba(99,102,241,0.15), transparent 60%), radial-gradient(800px 300px at 80% 0%, rgba(236,72,153,0.08), transparent 60%)",
                        }}
                    />
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
                </div>
            </ScrollBox>



            <ChatSend
                sendMessage={sendMessage}
                roomId={roomId}
                userId={userId}
            />

        </div>
    )
}
