import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '../ui/badge'
import { Users, MessageCircle } from 'lucide-react'

interface ChatRoomCardProps {
    
    title: string;
    notificationCount: number;
    participants: {
        name: string;
        isAdmin: boolean;
    }[];
    select: () => void;
}

export default function ChatRoomCard({
  
    title,
    notificationCount,
    participants,
    select
}: ChatRoomCardProps) {
    return (
        <div
          
            className='relative group flex flex-col sm:flex-row gap-4 p-5 sm:p-6 
                       bg-gradient-to-br from-white/95 to-gray-50/90 
                       dark:from-gray-800/95 dark:to-gray-900/90
                       backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50
                       rounded-2xl shadow-lg hover:shadow-2xl 
                       transition-all duration-300 ease-out cursor-pointer
                       hover:scale-[1.02] hover:bg-gradient-to-br hover:from-white hover:to-gray-100/95
                       dark:hover:from-gray-800 dark:hover:to-gray-850/95
                       before:absolute before:inset-0 before:rounded-2xl 
                       before:bg-gradient-to-r before:from-blue-500/10 before:via-purple-500/10 before:to-pink-500/10
                       before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
                       before:-z-10 overflow-hidden min-w-[32rem] max-w-[36rem]'
                       
            onClick={select}
        >
            {/* Notification Badge - Floating style */}
            {notificationCount > 0 && (
                <div className='absolute top-2 right-2 z-10 animate-pulse'>
                    <Badge
                        className='bg-gradient-to-r from-red-500 to-pink-500 text-white 
                                   border-0 px-2.5 py-1 text-xs font-bold shadow-lg
                                   hover:from-red-600 hover:to-pink-600 transition-all duration-200
                                   min-w-[24px] text-center'
                    >
                        {notificationCount > 99 ? '99+' : notificationCount}
                    </Badge>
                </div>
            )}

            {/* Avatar Section */}
            <div className='flex-shrink-0'>
                <Avatar className='h-14 w-14 sm:h-16 sm:w-16 rounded-xl 
                                   ring-4 ring-white/50 dark:ring-gray-700/50 
                                   shadow-xl group-hover:ring-blue-400/30 
                                   transition-all duration-300'>
                    <AvatarImage src={undefined} />
                    <AvatarFallback
                        className='bg-gradient-to-br from-blue-500 to-purple-600 
                                   text-white font-bold text-lg sm:text-xl'
                    >
                        {title.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Content Section */}
            <div className='flex-1 flex flex-col justify-center gap-2 min-w-0'>
                <h1 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white 
                               truncate group-hover:text-transparent group-hover:bg-clip-text 
                               group-hover:bg-gradient-to-r group-hover:from-blue-600 
                               group-hover:to-purple-600 transition-all duration-300'>
                    {title}
                </h1>

                <div className='flex items-center gap-2'>
                    <Badge
                        variant="secondary"
                        className='bg-gray-100/80 dark:bg-gray-700/80 text-gray-700 
                                   dark:text-gray-300 border-0 backdrop-blur-sm
                                   flex items-center gap-1.5 px-3 py-1
                                   hover:bg-gray-200/80 dark:hover:bg-gray-600/80
                                   transition-colors duration-200'
                    >
                        <Users className='w-3.5 h-3.5' />
                        <span className='font-medium'>{participants.length} Participants</span>
                    </Badge>
                </div>
            </div>

            {/* Message Icon - Decorative element */}
            <div className='absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 
                            transition-opacity duration-300'>
                <MessageCircle className='w-8 h-8 text-gray-600 dark:text-gray-400' />
            </div>

            {/* Gradient overlay on hover */}
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-tr 
                            from-blue-500/0 via-purple-500/0 to-pink-500/0
                            group-hover:from-blue-500/5 group-hover:via-purple-500/5 
                            group-hover:to-pink-500/5 transition-all duration-500 
                            pointer-events-none' />
        </div>
    )
}