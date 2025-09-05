"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Loading from '@/components/Loading';
import { Suspense } from 'react';
import { api } from "@/lib/trpc";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,

    CardContent,

} from "@/components/ui/card"
import z from "zod";
import { toast } from "sonner";
import InputBox from "@/components/InputBox";
import { Button } from "@/components/ui/button";
const zPassword = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export default function Page() {
    const searchParams = useSearchParams();
    const orgId = searchParams.get('orgId');
    const role = searchParams.get('role') || "member";
    const ni = api.organization.finishOnboarding.useQuery({ organizationId: orgId || "", role: role as "member" | "owner" | "admin" }, {
        enabled: !!orgId && !!role,

    })
    const setPasswordMutation = api.user.setPasswordForOAuth.useMutation({
        onSuccess(data) {
            if (data.success) {
                toast.success("Password set successfully. You can now log in with your password." , {id:"set-password-success"});
            } else {
                toast.error("Failed to set password. Please try again.", {id:"set-password-success"});
            }
        },
        onError(error) {
            toast.error(`Error: ${error.message}`, {id:"set-password-success"});
        },   
        onMutate() {
            toast.loading("Setting password...", {id:"set-password-success"});
        }
    });
    const [Password, setPassword] = useState({
        newPassword: "",
        confirmPassword: ""
    })




    function handleSetPassword() {
        const parsed = zPassword.safeParse(Password);
        if (!parsed.success) {
            const firstError = parsed.error.errors;
            firstError.forEach(err => {
                toast.error(`Error in ${err.path.join(".")}: ${err.message}`);
            })
            return;
        }
        setPasswordMutation.mutate({
            newPassword: Password.newPassword,
            confirmPassword: Password.confirmPassword,
            currentPassword: "" // not needed for OAuth users
        })
        setPassword({
            newPassword: "",
            confirmPassword: ""
        })
    }
    return (
        <Suspense fallback={<Loading full={true} />}>
            <div className="flex flex-col min-h-screen items-center justify-center ">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {(ni.isSuccess && ni.data?.success && !ni.data?.userExists) ? "Set your password" : "Joining organization..."}
                        </CardTitle>
                        {(ni.isSuccess && ni.data?.success && !ni.data?.userExists) && <CardDescription>
                            You have successfully joined the organization. Please set a password for your account to enhance security and enable future logins.
                        </CardDescription>}
                    </CardHeader>

                    <CardContent>
                        {ni.isLoading && <Loading full={false} PHRASESx={["Finishing onboarding...", "Please wait...", "Loading...", "Almost there...", "Finishing up..."]} />}
                        {ni.isError && <div className="text-red-500">Error: {ni.error.message}</div>}
                        {ni.isSuccess && !ni.data?.success && <div className="text-red-500">Error: {ni.data?.message || "Failed to join the organization. Please try again."}</div>}

                        {(ni.isSuccess && ni.data?.success && !ni.data?.userExists) && <div className="flex flex-col gap-4 justify-center items-center" >
                            <InputBox className="w-64" value={Password.newPassword} onChange={(e) => setPassword(pre => ({ ...pre, newPassword: e }))} label="Password" type="password" />
                            <InputBox className="w-64"   value={Password.confirmPassword} onChange={(e) => setPassword(pre => ({ ...pre, confirmPassword: e }))} label="Confirm Password" type="password" />
                            <Button onClick={handleSetPassword} disabled={Password.newPassword.length < 8 || Password.confirmPassword.length < 8} >Set Password</Button>


                        </div>}

                    </CardContent>

                </Card>




            </div>
        </Suspense>
    )
}