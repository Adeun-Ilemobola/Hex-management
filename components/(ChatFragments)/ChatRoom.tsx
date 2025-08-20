import { Message } from '@/lib/Zod';
import React from 'react'
import ChatBox from './ChatBox';
interface ChatRoomListProps{
    roomId:string;
    chats:Message[];
    userId:string


}
export default function ChatRoom ({chats , userId , roomId}:ChatRoomListProps) {
  return (
    <div className=' flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
        {chats.map((chat)=>(<ChatBox
        key={chat.id}
        id={chat.id}
        text={chat.text||""}
        img={chat.images.map((img)=>{
            const { chatOwnerID , createdAt , ...rest } = img;
            return {
                ...rest,
                thumbnail:false
            };
        })}
        authorId={chat.authorId}
        roomId={roomId}
        isUser={chat.authorId === userId}
        />))}
        
    </div>
  )
}
