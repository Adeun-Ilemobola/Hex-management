"use client"

import  { useState, useEffect } from 'react'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Mail, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

import DropBack from '@/components/DropBack'
import { TextField } from '@/components/CustomUIComponent/TextField'
import { Nav } from '@/components/Nav'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { authClient } from '@/lib/auth-client'
import { trpc as api } from '@/lib/client'
import { defaultUpdateUser, UpdateUser, updateUser } from '@/lib/ZodObject'
import { secondsToMilliseconds } from '@/lib/utils'

// 1. Fixed typo in variable name and set sensible defaults
const passwordDefault = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
}

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string()
        .min(8, "Must be at least 8 characters")
        .regex(/[A-Z]/, "Requires one uppercase letter")
        .regex(/[a-z]/, "Requires one lowercase letter")
        .regex(/[0-9]/, "Requires one digit")
        .regex(/[^A-Za-z0-9]/, "Requires one special character")
        .refine((val) => !val.toLowerCase().includes("password"), "Cannot contain the word 'password'"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function Page() {
    // router was unused, removed it to declutter
    const { isPending: isSessionPending, data: sessionData } = authClient.useSession();
    
    const [user, setUser] = useState<updateUser>(defaultUpdateUser);
    const [passwordForm, setPasswordForm] = useState(passwordDefault);

    const fetchedUser = api.Propertie.getUserProfle.useQuery(undefined, {
        enabled: !!sessionData?.user?.id,
        staleTime: secondsToMilliseconds(66)
    });

    // 2. Sync server state to local state
    useEffect(() => {
        if (fetchedUser.data) {
            setUser(fetchedUser.data);
        }
    }, [fetchedUser.data]);

 
    
    const handleUserChange = (field: keyof updateUser, value: string) => {
        setUser(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field: keyof typeof passwordDefault, value: string) => {
        setPasswordForm(prev => ({ ...prev, [field]: value }));
    };

    const updatePasswordMutation = useMutation({
        mutationFn: async (form: PasswordForm) => {
            const { error } = await authClient.changePassword({
                newPassword: form.newPassword,
                currentPassword: form.currentPassword,
                revokeOtherSessions: true,
            });

            if (error) {
                throw new Error(error.message); // Throw to trigger onError
            }
            return { success: true, message: "Password updated" }
        },
        onMutate() {
            toast.loading("Updating password...", { id: "updatePass" });
        },
        onSuccess() {
            toast.success("Password updated successfully", { id: "updatePass" });
            setPasswordForm(passwordDefault); // Reset form on success
        },
        onError(error) {
            toast.error(error.message, { id: "updatePass" });
        }
    });

    const updateProfileMutation = api.user.updateUserProfle.useMutation({
        onMutate() {
            toast.loading("Updating profile...", { id: "update" });
        },
        onSuccess(data) {
            if (data && data.success) {
                toast.success(data.message, { id: "update" });
            } else {
                toast.error(data.message, { id: "update" });
            }
        }
    });

    const handleSendVerification = async () => {
        try {
            await authClient.sendVerificationEmail({
                email: user.email,
            });
        } catch (error) {
            console.error('Failed to send verification email:', error);
            toast.error("Failed to send verification email");
        }
    };

    function handleProfileSubmit() {
        const result = UpdateUser.safeParse(user);
        if (!result.success) {
            result.error.issues.forEach(error => {
                toast.warning(`${error.path.join(",")}: ${error.message}`)
            })
            return
        }
        updateProfileMutation.mutate(user)
    }

    function handlePasswordSubmit() {
        const result = passwordSchema.safeParse(passwordForm);
        
        if (!result.success) {
            result.error.issues.forEach(error => {
                toast.warning(`${error.path.join(",")}: ${error.message}`)
            })
            return
        }
        // Pass the validated data
        updatePasswordMutation.mutate(result.data)
    }

    return (
        <DropBack is={isSessionPending || fetchedUser.isPending}>
            <div className='relative flex flex-col min-h-screen overflow-hidden'>

                <Nav
                    session={sessionData}
                    SignOut={() => authClient.signOut()}
                />
                
                {!sessionData?.user?.emailVerified && (
                    <EmailVerificationWarning
                        userEmail={user.email}
                        onSendVerification={handleSendVerification}
                    />
                )}

                <div className='relative flex flex-col w-full max-w-6xl mx-auto px-6 py-8 overflow-auto'>
                    <div className='mb-8'>
                        <h1 className='text-3xl font-bold mb-2'>Settings</h1>
                        <p>Manage your account settings and preferences</p>
                    </div>

                    <div className='grid gap-8 md:grid-cols-1 lg:grid-cols-1'>
                        {/* Profile Section */}
                        <div className='rounded-lg border border-gray-200 shadow-sm'>
                            <div className='px-6 py-4 border-b border-gray-200'>
                                <h2 className='text-xl font-semibold'>Profile Information</h2>
                                <p className='text-sm mt-1'>Update your personal details and contact information</p>
                            </div>

                            <div className='p-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <TextField
                                        label='Name'
                                        value={user.name}
                                        onChange={(val) => handleUserChange('name', val)}
                                        id='name'
                                        type='text'
                                    />
                                    <TextField
                                        label='Email'
                                        value={user.email}
                                        onChange={(val) => handleUserChange('email', val)}
                                        id='email'
                                        type='email'
                                    />
                                    <TextField
                                        label='Phone Number'
                                        value={user.phoneNumber}
                                        onChange={(val) => handleUserChange('phoneNumber', val)}
                                        id='phoneNumber'
                                        type='tel'
                                    />
                                    <TextField
                                        label='Address'
                                        value={user.address}
                                        onChange={(val) => handleUserChange('address', val)}
                                        id='address'
                                        type='text'
                                    />
                                    <TextField
                                        label='City'
                                        value={user.city}
                                        onChange={(val) => handleUserChange('city', val)}
                                        id='city'
                                        type='text'
                                    />
                                    <TextField
                                        label='State/Province'
                                        value={user.state}
                                        onChange={(val) => handleUserChange('state', val)}
                                        id='state'
                                        type='text'
                                    />
                                    <TextField
                                        label='Zip Code'
                                        value={user.zipCode}
                                        onChange={(val) => handleUserChange('zipCode', val)}
                                        id='zipCode'
                                        type='text'
                                    />
                                    <TextField
                                        label='Country'
                                        value={user.country}
                                        onChange={(val) => handleUserChange('country', val)}
                                        id='country'
                                        type='text'
                                    />
                                </div>

                                <div className='flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200'>
                                    <Button onClick={handleProfileSubmit} disabled={updateProfileMutation.isPending}>
                                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className='rounded-lg border border-gray-200 shadow-sm'>
                            <div className='px-6 py-4 border-b border-gray-200'>
                                <h2 className='text-xl font-semibold'>Security</h2>
                                <p className='text-sm mt-1'>Change your password and manage security settings</p>
                            </div>

                            <div className='p-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <TextField
                                        label='Current Password'
                                        value={passwordForm.currentPassword}
                                        onChange={(val) => handlePasswordChange('currentPassword', val)}
                                        id='currentPassword'
                                        type='password'
                                    />
                                    <TextField
                                        label='New Password'
                                        value={passwordForm.newPassword}
                                        onChange={(val) => handlePasswordChange('newPassword', val)}
                                        id='newPassword'
                                        type='password'
                                    />
                                    <TextField
                                        label='Confirm Password'
                                        value={passwordForm.confirmPassword}
                                        onChange={(val) => handlePasswordChange('confirmPassword', val)}
                                        id='confirmPassword'
                                        type='password'
                                    />

                                    <div className='flex items-center justify-end md:col-span-2'>
                                        <Button
                                            variant="destructive"
                                            onClick={handlePasswordSubmit}
                                            disabled={updatePasswordMutation.isPending}
                                        >
                                            {updatePasswordMutation.isPending ? "Changing..." : "Change Password"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DropBack>
    )
}

function EmailVerificationWarning({ userEmail, onSendVerification }: { userEmail: string; onSendVerification: () => Promise<void> }) {
    const [isSending, setIsSending] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSendEmail = async () => {
        setIsSending(true)
        try {
            await onSendVerification()
            setEmailSent(true)
            setTimeout(() => setEmailSent(false), 5000)
        } catch (error) {
            console.error('Failed to send verification email:', error)
        } finally {
            setIsSending(false)
        }
    }

    if (emailSent) {
        return (
            <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200 mb-6">
                <Mail className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                    <span>
                        Verification email sent to <strong>{userEmail}</strong>. Please check your inbox and spam folder.
                    </span>
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <Alert className="border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200 mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
                <div className="flex-1">
                    <span className="font-medium">Email not verified</span>
                    <p className="text-sm mt-1 text-orange-700 dark:text-orange-300">
                        Please verify your email address to secure your account and receive important notifications.
                    </p>
                </div>
                <Button
                    onClick={handleSendEmail}
                    disabled={isSending}
                    variant="outline"
                    size="sm"
                    className="text-orange-800 border-orange-200 hover:bg-orange-100"
                >
                    {isSending ? (
                        <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-800 dark:border-orange-200 mr-2"></div>
                            Sending...
                        </>
                    ) : (
                        <>
                            <Mail className="h-3 w-3 mr-2" />
                            Send Verification
                        </>
                    )}
                </Button>
            </AlertDescription>
        </Alert>
    )
}