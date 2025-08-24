"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/trpc";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import React from 'react'
import InputBox from "./InputBox";
import { Button } from "./ui/button";
import DropBack from "./DropBack";

export default function VerifyExternalInvestorView() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const investorId = searchParams.get("investorId")
    const propertieid = searchParams.get("propertieid")
    const propertyInfo = api.Propertie.getPropertieNameById.useQuery({ pID: propertieid!! })
    const startVerification = api.Propertie.acceptInvitePropertie.useMutation({
        onSuccess: (data) => {
            if (data && data.success) {
                toast.success(data.message, { id: "verify" })
                router.push("/home")
            }else {
                toast.error(data.message, { id: "verify" })
            }

        },
        onError: (error) => {
            toast.error(error.message, { id: "verify" })
        },
        onMutate: () => {
            toast.loading("verifying", { id: "verify" })
        }

    })
    const [info, setInfo] = useState({
        code: "",
        investorId: investorId!!,
        propertieid: propertieid!!,
    })
    function handleAccept(accepted: boolean) {
        startVerification.mutate({
            code: info.code,
            investorId: info.investorId,
            propertieId: info.propertieid,
            accepted
        })
    }
    return (
        <DropBack is={propertyInfo.isPending || startVerification.isPending}>
            <div className="flex flex-col min-h-screen items-center justify-center">
                {propertyInfo.data ?
                 (
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>
                            verify external investor
                        </CardTitle>
                        <CardDescription>
                            you are invited to be external investor in {propertyInfo.data.value}
                            please enter the code to verify or cancel

                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 py-4">
                        <InputBox
                            value={info.code}
                            onChange={(value) => setInfo({ ...info, code: value })}
                            label="code"
                        />

                        <div className="flex flex-row gap-2 justify-end">
                            <Button
                                className=""
                                onClick={() => handleAccept(false)}
                                disabled={startVerification.isPending}
                                variant={"destructive"}
                            >
                                cancel
                            </Button>
                            <Button
                                className=""
                                variant={"secondary"}
                                onClick={() => {
                                    
                                    handleAccept(true)
                                }}
                                disabled={startVerification.isPending || info.code.length < 12}
                            >
                                verify
                            </Button>

                        </div>
                    </CardContent>
                </Card>
                )
                :
                <div className="flex flex- gap-2 flex-1 items-center justify-center">
                    <h1 className="text-2xl font-bold">Properte not found</h1>
                    <Button variant={"secondary"} size={"lg"} onClick={() => router.push("/home")}>go back to home</Button>
                </div>
            
            
            }  
            </div>
        </DropBack>

    )
}
