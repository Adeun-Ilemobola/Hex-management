
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


export function Nav({ session, SignOut }: { session: Session | null, SignOut: () => void }) {
    const rount = useRouter()

    return (
        <div className=' flex flex-row gap-0.5 min-w-full h-16 border-b '>

            {/* logo and name  */}
            <div className=' flex w-[25%] items-center'>

            </div>

            <div className=' flex w-[60%] justify-center'>

            </div>


            <div className=' flex w-[15%] items-center p-3  '>

                {session &&
                    (<>
                        <UserCard
                            id={session.user.id}
                            name={session.user.name}
                            Logout={SignOut}
                            img={session.user.image ? session.user.image : undefined}
                            go={() => rount.push("/")}
                            sub={() => rount.push("/home/subscription")}
                        />
                    </>)

                }

                {!session &&
                    (<>
                        <Button className=' ml-auto' onClick={() => rount.push("/login")}>
                            Login
                        </Button>
                    </>)

                }

            </div>

        </div>
    )
}




export default function UserCard({ go, img, Logout, name , sub }: { name: string, img: string | undefined, id: string, Logout: () => void, go: () => void, sub:() => void } ) {


    return (


        <DropdownMenu  >
            <DropdownMenuTrigger asChild className='' >
                <Avatar className=' ml-auto h-12 w-12 rounded-lg'>
                    <AvatarImage src={img} />
                    <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account {name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {sub()}}>Subscription</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem variant={"destructive"} onClick={() => {
                    Logout();
                    go();
                }}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>




    )
}







