"use client"

import Strips from '@/components/Designs/strip'
import React, { useState } from 'react'
import InputBox, { SelectorBox } from '@/components/InputBox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { zodRegisterSchema } from '@/lib/Zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { countries } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Switch } from "@/components/ui/switch"
import SocialSignOn from '@/components/SocialSignOn'


export default function Page() {
    const router = useRouter()

    const [registerInfo, setRegisterInfo] = useState<z.infer<typeof zodRegisterSchema>>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        country: '',
        terms: true
    })

    const registerMut = useMutation({
        mutationFn: async (con: z.infer<typeof zodRegisterSchema>) => {

            console.log("main Data :" ,con);
            
            await authClient.signUp.email({
                name: con.name,
                email: con.email,
                password: con.password,
                country: con.country ?? "Unknown",
                phoneNumber: con.phoneNumber,
            },
                {
                    onSuccess: () => {
                        toast.error("successfully signed up");
                        router.push("/home")
                    },
                    onError(context) {
                        console.log("onError context -- " ,context);
                         toast.error(context.error.message)
                    },
                }
            )

            
        }
    })

    const getCountryData = useMutation({
        mutationFn: async (country: string) => {
            const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        onError: (error) => {
            toast.error('Error fetching country data');
            console.error('Error fetching country data:', error);
        }
    })
    
    function setCountry(e: string, identify: string) {
        console.log(
            identify
        );


        if (e && e !== registerInfo.country && e !== null || e !== undefined || e !== '' || e !== 'None') {
            setRegisterInfo((prev) => ({
                ...prev,
                country: e
            }))
            getCountryData.mutate(e);
        }


    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const result = zodRegisterSchema.safeParse(registerInfo);
        if (!result.success) {
            result.error.errors.forEach((error) => {
                toast.error(error.message);
            })
            return;
        }
        registerMut.mutate(result.data)
        // Perform registration action here

    }

    return (

        <div className=" relative flex flex-col items-center justify-center min-h-screen  overflow-hidden">
            <Strips stripConut={3} className="absolute top-[4rem] left-[-10rem] w-[520px] gap-5 rotate-[-45deg]" height={2} />
            <Strips stripConut={3} className="absolute bottom-[4rem] right-[-10rem]  w-[520px] gap-5 rotate-[-45deg] " height={2} />



            <div className=' flex flex-row justify-center items-center gap-0.5'>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center  text-3xl">Register</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <InputBox disabled={registerMut.isPending} label='Name' type="text"  value={registerInfo.name} onChange={(e) => setRegisterInfo((prev) => ({ ...prev, name: e }))} placeholder="Name" />
                            <InputBox disabled={registerMut.isPending} label='Email' type="email"  value={registerInfo.email} onChange={(e) => setRegisterInfo((prev) => ({ ...prev, email: e }))} placeholder="Email" />
                            <InputBox disabled={registerMut.isPending} label='Password' type="password"  value={registerInfo.password} onChange={(e) => setRegisterInfo((prev) => ({ ...prev, password: e }))} placeholder="Password" />
                            <InputBox disabled={registerMut.isPending} label='confirm Password' type="password" value={registerInfo.confirmPassword} onChange={(e) => setRegisterInfo((prev) => ({ ...prev, confirmPassword: e }))} placeholder="Confirm Password" />
                            <InputBox disabled={registerMut.isPending} label='phone Number' type="text"  value={registerInfo.phoneNumber} onChange={(e) => setRegisterInfo((prev) => ({ ...prev, phoneNumber: e }))} placeholder="Phone Number" />

                            <SelectorBox
                                isDisable={registerMut.isPending}
                                label='country'
                                identify="country"
                                value={registerInfo.country} setValue={(e) => setCountry(e, "country")}
                                options={
                                    [
                                        { value: "None", label: "None" },
                                        ...countries.map((country) => ({ value: country, label: country }))
                                    ]
                                }
                            />



                            <div className='flex items-center gap-2'>
                                <Switch
                                    checked={registerInfo.terms}
                                    onCheckedChange={(c) => {
                                        setRegisterInfo(pre => ({
                                            ...pre,
                                            terms: c as true
                                        }))

                                    }}
                                    id='terms'


                                />
                                <Label htmlFor='terms'>I accept the terms and conditions</Label>
                            </div>

                            <Button type='submit' className=''>Register</Button>
                        </form>
                    </CardContent>

                    <CardFooter>
                        <div className=' flex flex-row gap-1.5 justify-center'>
                            <SocialSignOn/>

                        </div>

                    </CardFooter>

                </Card>




                
            </div>




        </div>

    )
}
