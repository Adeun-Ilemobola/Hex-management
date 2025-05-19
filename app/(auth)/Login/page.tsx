"use client"

import Strips from '@/components/Designs/strip'
import InputBox from '@/components/InputBox'
import { Button } from '@/components/ui/button'
import { Card , CardContent , CardHeader , CardTitle } from '@/components/ui/card'
import { zodLoginSchema } from '@/lib/Zod'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export default function page() {
    const [loginIfo , setLoginInfo] = useState<z.infer<typeof zodLoginSchema>>({
        email: '',
        password: ''
    })






    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value , type } = e.target;
        setLoginInfo((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const result = zodLoginSchema.safeParse(loginIfo);
        if (!result.success) {
            result.error.errors.forEach((error) => {
                toast.error(error.message);
            })
            
            return;
        }
        console.log(result.data);
        toast.success('Login successful');
        // Perform login action here

    }




     
  return (
    <div className=" relative flex flex-col items-center justify-center min-h-screen  overflow-hidden">

        <Strips stripConut={3} className="absolute top-[4rem] left-[-10rem] w-[520px] gap-5 rotate-[-45deg]" height={2} />
        <Strips stripConut={3}  className="absolute bottom-[4rem] right-[-10rem]  w-[520px] gap-5 rotate-[-45deg] " height={2} />

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
                        isDisable={false}
                        setValue={handleChange}
                        value={loginIfo.email}
                        identify="email"
                    
                    />
                    <InputBox
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        isDisable={false}
                        setValue={handleChange}
                        value={loginIfo.password}
                        identify="password"
                    />

                    <Button type='submit' size={"lg"} >
                        Login
                    </Button>
                    
                    
                </form>

            </CardContent>
        </Card>

    </div>
  )
}
