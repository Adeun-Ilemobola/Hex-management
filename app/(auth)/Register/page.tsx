"use client"

import Strips from '@/components/Designs/strip'
import React, { useState } from 'react'
import InputBox, { SelectorBox } from '@/components/InputBox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { zodRegisterSchema } from '@/lib/Zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { countries } from '@/lib/utils'

export default function Page() {
    const [registerInfo, setRegisterInfo] = useState<z.infer<typeof zodRegisterSchema>>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        country: '',
        terms: true
    })

    const getCountryData = useMutation({
        mutationFn: async (country: string) => {
            const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        onSuccess: (data) => {

        },
        onError: (error) => {
            toast.error('Error fetching country data');
            console.error('Error fetching country data:', error);
        }
    })
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type } = e.target;
        setRegisterInfo((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? e.target.checked : value
        }))
    }

    function setCountry(e: string, identify: string) {

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
        console.log(result.data);
        toast.success('Registration successful');
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
                            <InputBox isDisable={false} label='Name' type="text" identify="name" value={registerInfo.name} setValue={handleChange} placeholder="Name" />
                            <InputBox isDisable={false} label='Email' type="email" identify="email" value={registerInfo.email} setValue={handleChange} placeholder="Email" />
                            <InputBox isDisable={false} label='Password' type="password" identify="password" value={registerInfo.password} setValue={handleChange} placeholder="Password" />
                            <InputBox isDisable={false} label='confirm Password' type="password" identify="confirmPassword" value={registerInfo.confirmPassword} setValue={handleChange} placeholder="Confirm Password" />
                            <InputBox isDisable={false} label='phone Number' type="text" identify="phoneNumber" value={registerInfo.phoneNumber} setValue={handleChange} placeholder="Phone Number" />

                            <SelectorBox
                                isDisable={false}
                                label='country'
                                identify="country"
                                value={registerInfo.country} setValue={setCountry}
                                options={
                                    [
                                        { value: "None", label: "None" },
                                        ...countries.map((country) => ({ value: country, label: country }))
                                    ]
                                }
                            />



                            <div className='flex items-center gap-2'>
                                <input type='checkbox' name='terms' checked={registerInfo.terms} onChange={handleChange} />
                                <label htmlFor='terms'>I accept the terms and conditions</label>
                            </div>

                            <Button type='submit' className=''>Register</Button>
                        </form>
                    </CardContent>

                </Card>




                 <Card>
                    <CardHeader>
                        <CardTitle className="text-center  text-3xl">Register by Providers</CardTitle>
                    </CardHeader>
                    <CardContent>
                       
                    </CardContent>

                </Card>
            </div>




        </div>

    )
}
