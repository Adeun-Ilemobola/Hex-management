"use client"
import Strips from '@/components/Designs/strip'
import InputBox from '@/components/InputBox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { zodLoginSchema } from '@/lib/Zod'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'
import SocialSignOn from '@/components/SocialSignOn'

export default function Page() {
    

    const [loginInfo, setLoginInfo] = useState<z.infer<typeof zodLoginSchema>>({
        email: '',
        password: ''
    })

    const LoginMut = useMutation({
        mutationFn: async (loginData: z.infer<typeof zodLoginSchema>) => {
            toast.loading('Signing in...' , { id: 'signin' });
            try {
               const res =  await authClient.signIn.email({
                password: loginData.password,
                email: loginData.email,
                callbackURL: "/home",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success('Login successful', { id: 'signin' });
                    }
                   
                }
            })
            if (res.error) {
                toast.error(res.error.message || 'Login failed');
                console.log(res.error);
               return
            } 
            
            if (res.data) {
                toast.success('Login successful', { id: 'signin' });
            }
            return
                
            } catch (error) {
               toast.error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                console.log(error);
                
            }
            
        },
       
    });

    

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const result = zodLoginSchema.safeParse(loginInfo);
        if (!result.success) {
            result.error.errors.forEach((error) => {
                toast.error(error.message);
            })
            return;
        }
        LoginMut.mutate(result.data);
    }

    return (
        <div className=" relative flex flex-col items-center justify-center min-h-screen  overflow-hidden">
            <Strips stripConut={3} className="absolute top-[4rem] left-[-10rem] w-[520px] gap-5 rotate-[-45deg]" height={2} />
            <Strips stripConut={3} className="absolute bottom-[4rem] right-[-10rem]  w-[520px] gap-5 rotate-[-45deg] " height={2} />
            <Card>
                <CardHeader>
                    <CardTitle className="text-center  text-3xl">Login</CardTitle>
                </CardHeader>
                <CardContent className="min-w-[23rem] ">
                    <form className="flex flex-1 flex-col w-full items-center justify-center gap-3" onSubmit={handleSubmit}>
                        <InputBox
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            disabled={LoginMut.isPending}
                            onChange={(e) => setLoginInfo({ ...loginInfo, email: e })}
                            value={loginInfo.email}
                            className='w-full'
                           
                        />
                        <InputBox
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            disabled={LoginMut.isPending}
                            onChange={(e) => setLoginInfo({ ...loginInfo, password: e })}
                            value={loginInfo.password}
                            className='w-full'
                           
                        />
                        <Button type='submit' size={"lg"} disabled={LoginMut.isPending} >
                            Login
                        </Button>
                    </form>
                </CardContent>

                <CardFooter>
                    <div className=' flex items-center justify-center flex-row gap-2  w-full'>
                        <SocialSignOn />

                    </div>

                </CardFooter>
            </Card>
        </div>
    )
}
