"use client"
import React, { useEffect, useState } from 'react' // Import useState
import { trpc as api } from '@/lib/client'
import ChatSidebar from "@/components/Chat/ChatSidebar"
import ChatRoom from '@/components/Chat/ChatRoom'
import { authClient } from '@/lib/auth-client'
import { roomType } from '@/lib/generated/prisma/enums'
import { Message } from '@/lib/ZodObject'
import {propertySchema} from '@/lib/ZodObject'
type Room = {
    notificationCount: number;
    RoomMembers: {
        userId: string;
        userName: string;
    }[];
    id: string;
    type: roomType;
    title: string;
}


export default function Page() {
    const session = authClient.useSession();
    const [message, setMessage] = useState<Message[]>([])
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

    // 1. Subscription: Appends NEW messages as they arrive in real-time
    api.Chat.onMessage.useSubscription(
        { roomId: selectedRoom?.id || "" },
        {
            enabled: (!!selectedRoom?.id || selectedRoom?.id !== ""), // Only subscribe if a room is selected
            onData(newMessage) {
                console.log("⚡️ WEBSOCKET: New message arrived:", newMessage); 
                if (newMessage) {
                    setMessage((prev) => {
                        if (prev.some(m => m.id === newMessage.id)) return prev;

                        const updated = [...prev, newMessage];
                        return updated.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
                    })
                }
            },
            onError(err) {
                console.error("Subscription error:", err);
            }
        }
    );

    const sendMessage = api.Chat.sendMessage.useMutation()
    const roomList = api.Chat.userRooms.useQuery()

    const FetchMessages = api.Chat.getRoomMessages.useQuery(
        { roomId: selectedRoom?.id || "" },
        {
            enabled: !!selectedRoom?.id,
            refetchOnWindowFocus: false, // Optional: prevents flickering when switching tabs
        }
    )

    // 3. Sync: Update state ONLY when the Query data actually changes
    useEffect(() => {
        if (FetchMessages.data?.value) {
            setMessage(FetchMessages.data.value)
        }
    }, [FetchMessages.data])
    return (
        <div className="flex flex-row h-screen w-full overflow-hidden bg-background">
            <ChatSidebar
                rooms={roomList.data?.value || []}
                SelectRoom={(roomId: string) => {
                    const room = roomList.data?.value?.find(r => r.id === roomId)
                    if (room) setSelectedRoom(room)
                }}
                userId={session.data?.user.id || ""}
                size={500}
                isLoading={roomList.isLoading}
            />

            <ChatRoom
                roomId={selectedRoom?.id || ""}
                authorId={session.data?.user.id || ""}
                submit={(text) => {

                    sendMessage.mutate(text)
                }}
                roohasSelected={selectedRoom !== null}
                messages={message}
                getMembers={(id) => {
                    return selectedRoom?.RoomMembers.find(member => member.userId === id)?.userName || "Unknown"
                }}
                messageSending={sendMessage.isPending}
            />
        </div>
    )
}