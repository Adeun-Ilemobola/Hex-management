"use client"
import React from 'react'
import Google from './Icon/Google'
import GitHub from './Icon/GitHub'
import Discord from './Icon/Discord'
import Reddit from './Icon/Reddit'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'


const Social :{id:SocialId , tsx:React.JSX.Element}[] = [
    { id: "google", tsx: (<Google />) },
    { id: "github", tsx: (<GitHub />) },
    { id: "discord", tsx: (<Discord />) },
    { id: "reddit", tsx: (<Reddit />) },

]
type SocialId = "google" | "github" | "discord" | "reddit"


export default function SocialSignOn() {
    const RegisterSocialMut = useMutation({
        mutationFn: async (data: SocialId) => {
            await authClient.signIn.social(
                {
                    provider: data,
                    callbackURL:"/home"
                },
                {
                    onSuccess() {

                        toast.success(` successfully signed in with ${data}`)
                    },
                    onError(context) {
                        console.log(context);
                        toast.success(` Field to signIn in with ${data}`)   
                        
                    },
                }
            )

        }
    })
    return (
        <>
            {Social.map(social => (<Button key={social.id} disabled={RegisterSocialMut.isPending} onClick={()=>RegisterSocialMut.mutate(social.id)} size={"icon"}>{social.tsx}</Button>))}
        </>
    )
}
