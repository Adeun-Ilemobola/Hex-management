import { $Enums } from '@prisma/client';
import { int } from 'better-auth'
import React from 'react'
import ChatRoomCard from './ChatRoomCard';
import Loading from '../Loading';

interface ChartRoom {
    member: {
        id: string;
        userId: string;
        name: string;
        isAdmin: boolean;
        joinedAt: Date;
    }[];

    chatRoomMemberId: string;
    roomId: string;
    isAdmin: boolean;
    joinedAt: Date;
    notificationCount: number;
    title: string;
    type: $Enums.roomType;
}
interface ChartRoomListProps {
    data: ChartRoom[]
    onSelect: (roomId: string) => void
    loading: boolean

}
export default function ChartRoomList({ data, onSelect, loading }: ChartRoomListProps) {
    if (loading) {
        return (
            <div className='flex flex-col border-r items-center justify-center border-border min-w-[32rem] max-w-[36rem] py-1'>
                <Loading full={false} />
            </div>
        )
    }
    return (
        <div className='flex flex-col border-r border-border min-w-[32rem] max-w-[36rem] py-1'>
            {data.map(room => (
                <ChatRoomCard
                    key={room.roomId}
                    select={() => onSelect(room.roomId)}
                    notificationCount={room.notificationCount}
                    participants={room.member}
                    title={room.title}
                    type={room.type as $Enums.roomType}
                />
            ))}

        </div>
    )
}
