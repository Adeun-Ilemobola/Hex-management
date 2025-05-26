
import { Session } from '@/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'


export function Nav({ session , SignOut }: { session: Session | null , SignOut:()=>void }) {
    const rount = useRouter()

    return (
        <div className=' flex flex-row gap-0.5 min-w-full h-16 border-b '>

            {/* logo and name  */}
            <div className=' flex w-[25%] items-center'>

            </div>

            <div className=' flex w-[60%] justify-center'>

            </div>


            <div className=' flex w-[15%] items-center  '>

                {session &&
                    (<>
                     <UserCard
                      id={session.user.id}
                      name={session.user.name}
                      Logout={SignOut}
                      img={session.user.image ? session.user.image : undefined}
                     />
                    </>)

                }

                {!session &&
                    (<>
                      <Button onClick={()=>rount.push("/login")}>
                        Login
                      </Button>
                    </>)

                }

            </div>

        </div>
    )
}




export default function UserCard({   img  , Logout ,name}:{name:string , img:string | undefined  ,  id:string , Logout:()=>void }) {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className='flex flex-row gap-1 justify-center items-center ring-1 ring-blue-500/5 p-1'>
                    <Avatar className='h-10 w-10'>
                        <AvatarImage src={img} />
                        <AvatarFallback>{name.substring(0 ,1)}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account {name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem variant={"destructive"} onClick={()=>{Logout()}}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>



        </div>
    )
}







