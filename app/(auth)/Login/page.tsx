"use client"
import Strips from '@/components/Designs/strip'
import InputBox from '@/components/InputBox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { zodLoginSchema } from '@/lib/Zod'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function Page() {
    const router = useRouter()

    const [loginInfo, setLoginInfo] = useState<z.infer<typeof zodLoginSchema>>({
        email: '',
        password: ''
    })

    const LoginMut = useMutation({
        mutationFn: async (loginData: z.infer<typeof zodLoginSchema>) => {
            await authClient.signIn.email({
                password: loginData.password,
                email: loginData.email,
                fetchOptions: {
                    onSuccess(ctx) {
                        console.log(ctx);
                        toast.success('Login successful');
                        router.push("/")
                    },
                    onError(context) {
                        console.log(context);
                        toast.error("Invalid credentials or server error.");
                    },
                }
            })
        },
        onError: (error: any) => {
            toast.error(error.message || 'Login failed');
        }
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({
            ...prev,
            [name]: value
        }))
    }

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
                <CardContent className="">
                    <form className="flex flex-col w-full items-center justify-center gap-3" onSubmit={handleSubmit}>
                        <InputBox
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            isDisable={LoginMut.isPending}
                            setValue={handleChange}
                            value={loginInfo.email}
                            identify="email"
                        />
                        <InputBox
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            isDisable={LoginMut.isPending}
                            setValue={handleChange}
                            value={loginInfo.password}
                            identify="password"
                        />
                        <Button type='submit' size={"lg"} disabled={LoginMut.isPending} >
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
