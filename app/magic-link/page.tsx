"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Loading from '@/components/Loading';
import { Suspense } from 'react';
import {
    Card,

    CardContent,

} from "@/components/ui/card"

export default function page() {
    const sp = useSearchParams();

    useEffect(() => {
        const token = sp.get("token");
        if (token) {
            // BA will redirect to the callbackURL/newUserCallbackURL set when you SENT the email
            const verifyMagicLink = async () => {
                try {
                  

                } catch (error) {
                    console.error("Error verifying magic link:", error);
                }
            };
            verifyMagicLink();



        }
    }, [sp]);

    return (
        <Suspense fallback={<Loading full={true} />}>
            <div className="flex flex-col min-h-screen items-center justify-center ">
                <Card>

                    <CardContent>
                        {/* {ni.isLoading && <Loading full={false} PHRASESx={["Verifying..." , "Please wait..." , "Loading..." , "Please wait..." , "Verifying..."]}  />}
                        {ni.isError && <div className="text-red-500">Error: {ni.error.message}</div>}
                        {ni.isSuccess && ni.data?.success && <div className="text-green-500">Success: {ni.data.message || "Your email has been verified successfully."}</div>}
                        {ni.isSuccess && !ni.data?.success && <div className="text-red-500">Error: {ni.data?.message || "Verification failed. Please try again."}</div>} */}

                    </CardContent>

                </Card>




            </div>
        </Suspense>
    )
}
