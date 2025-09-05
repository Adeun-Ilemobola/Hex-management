"use client"
import { api } from '@/lib/trpc';
import InputBtu from '@/components/InputBtu';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerOverlay,

} from "@/components/ui/drawer"


import React from 'react'

export default function CreateChatView() {
      const searchUsers = api.user.SearchUserByEmail.useMutation();
      const createNewPrivateChat = api.ChatRoom.createRoom.useMutation();
      const [open, setOpen] = React.useState(false);
    
  return (
   <Drawer open={open} onOpenChange={setOpen} preventScrollRestoration direction='right'>
           <DrawerOverlay className=' bg-purple-500/18 backdrop-blur-sm' />
           <DrawerTrigger>
             <Button
             
            
             size={"lg"}
             className="absolute z-30 top-[12%] right-3 backdrop-blur-lg  opacity-82 hover:opacity-99 "
             onClick={() => {
               setOpen(true)
   
             }}
             >
               new chat
             </Button>
           </DrawerTrigger>
           <DrawerContent className='bg-white/80 dark:bg-slate-900/20 backdrop-blur-lg rounded-xl shadow-xl border border-white/15 dark:border-white/5  min-w-[40rem] sm:min-w-[28rem]'>
   
             <div className='flex-1 flex flex-col gap-3'>
               <div className=' flex flex-row gap-4 p-2 '>
                 <InputBtu
                 className='w-full'
                   onSubmit={(text) => {
                     searchUsers.mutate({ email: text })
                   }}
                   icon={<>
                     <Search className='w-4 h-4 text-muted-foreground' />
                     <span className='sr-only'>Search</span>
                   </>}
   
                 />
   
               </div>
               {searchUsers.isPending ? (<div className='flex-1'>
               <Loading full={false} />
   
               </div>)
                 : (
                   <div className='flex-1 overflow-y-auto p-2'>
                     {searchUsers.data?.value.map((user) => {
                       return (
                         <div
                           key={user.id}
                           className="flex flex-row p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 rounded-xl border border-gray-200 dark:border-slate-700/70 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-200"
   
                         >
                           <div className='flex flex-row gap-3'>
                             <Avatar>
                               <AvatarImage src={user.image || undefined} />
                               <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                             </Avatar>
                             <div className='flex flex-col gap-1'>
                               <p className='text-sm font-medium leading-none'>{user.name}</p>
                               <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
                             </div>
                           </div>
                           <div className='ml-auto flex items-center'>
                             {user.directMessage ? (
                               <Button 
                               onClick={() => {
                                createNewPrivateChat.mutate({toId:user.id })
                                setOpen(false)
                                 
                               }}
                               size={"sm"} >Message</Button>
                             ) : (
                               <Button disabled size={"sm"}> unavailable</Button>
                             )}
                           </div>
   
                         </div>
                       )
                     })}
                   </div>
                 )}
             </div>
           </DrawerContent>
         </Drawer>
  )
}
