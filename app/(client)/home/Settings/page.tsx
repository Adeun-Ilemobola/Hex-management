"use client"
import DropBack from '@/components/DropBack';
import InputBox from '@/components/InputBox';
import { Nav } from '@/components/Nav';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client'
import { api } from '@/lib/trpc';
import { defaultUserInput, UserInput, userSchema } from '@/lib/Zod';
import React, { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, AlertTriangle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { headers } from "next/headers";


const passworDefault = {
  currentPassword: "---------",
  newPassword: "",
  confirmPassword: ""
}

const vPass = z.object({
  currentPassword: z.string().trim().min(6, { message: "Password must be at least 6 characters long" }),
  newPassword: z.string().trim()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password must be no more than 100 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one digit." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." })
    .refine(
      (val) => !val.toLowerCase().includes("password"),
      { message: "Password should not contain the word 'password'." }
    )
  ,
  confirmPassword: z.string().trim().min(6, { message: "Password must be at least 6 characters long" }),
}).superRefine(({ newPassword, confirmPassword }, ctx) => {
  if (newPassword !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
    });
  }
})

export default function Page() {
  const [user, setUser] = useState<UserInput>(defaultUserInput);
  const [password, setPassword] = useState(passworDefault);
  const { isPending, data } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  // const { mutateAsync: updateUser } = api.User.updateUser.useMutation();
  const fetchedUser = api.Propertie.getUserProfle.useQuery();
  const UpdataPassMutb = api.user.setPasswordForOAuth.useMutation({
    onMutate() {
      toast.loading("Updating password...", { id: "updatePass" });
    },
    onSuccess(data) {
      if (data && data.success) {
        toast.success("Password updated", { id: "updatePass" });
      } else {
        toast.error("Password not updated", { id: "updatePass" });
      }
    },
    onError(error) {
      toast.error(error.message, { id: "updatePass" });
    }
  });
  const listMutate = useMutation({
    mutationFn: async () => {
      const accounts = await authClient.listAccounts();
      console.log(accounts);

      return accounts
    }
  })


  const makeUpdate = api.Propertie.updateUserProfle.useMutation({
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
  })


  useEffect(() => {
    if (fetchedUser.data && !mounted) {
      setUser(fetchedUser.data);
      setMounted(true);
    }
  }, [fetchedUser.data]);



  const handleSendVerification = async () => {
    try {
      await authClient.sendVerificationEmail({
        email: user.email,


      });

      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  };



  function handleUpdate() {
    const vUserSchema = userSchema.safeParse(user);
    if (!vUserSchema.success) {
      vUserSchema.error.errors.forEach(error => {
        toast.warning(`${error.path[0]}: ${error.message}`)
      })
      return
    }
    makeUpdate.mutate({
      user: user
    })


  }



  function updataPassWord() {
    const vPassSchema = vPass.safeParse(password);
    console.log(password);
    
    if (!vPassSchema.success) {
      vPassSchema.error.errors.forEach(error => {
        toast.warning(`${error.path[0]}: ${error.message}`)
      })
      return
    }
    UpdataPassMutb.mutate(password)

  }



  return (
    <DropBack is={isPending || fetchedUser.isPending}>
      <div className='relative flex flex-col min-h-screen overflow-hidden'>

        <Nav
          session={data}
          SignOut={() => authClient.signOut()}
        />
        {!user.emailVerified && (<>
          <EmailVerificationWarning
            userEmail={user.email}
            onSendVerification={handleSendVerification}
          />
        </>)}

        <div className='relative flex flex-col w-full max-w-6xl mx-auto px-6 py-8 overflow-auto'>
          {/* Page Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold  mb-2'>Settings</h1>
            <p className=''>Manage your account settings and preferences</p>
          </div>

          {/* Settings Sections Container */}
          <div className='grid gap-8 md:grid-cols-1 lg:grid-cols-1'>

            {/* Profile Section */}
            <div className=' rounded-lg border border-gray-200 shadow-sm'>
              <div className='px-6 py-4 border-b border-gray-200'>
                <h2 className='text-xl font-semibold '>Profile Information</h2>
                <p className='text-sm  mt-1'>Update your personal details and contact information</p>
              </div>

              <div className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <InputBox
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e })}
                    label='Full Name'
                  />
                  <InputBox
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e })}
                    label='Email Address'
                  />
                  <InputBox
                    value={user.phoneNumber}
                    onChange={(e) => setUser({ ...user, phoneNumber: e })}
                    label='Phone Number'
                  />
                  <InputBox
                    value={user.address}
                    onChange={(e) => setUser({ ...user, address: e })}
                    label='Street Address'
                  />
                  <InputBox
                    value={user.city}
                    onChange={(e) => setUser({ ...user, city: e })}
                    label='City'
                  />
                  <InputBox
                    value={user.state}
                    onChange={(e) => setUser({ ...user, state: e })}
                    label='State/Province'
                  />
                  <InputBox
                    value={user.zipCode}
                    onChange={(e) => setUser({ ...user, zipCode: e })}
                    label='ZIP/Postal Code'
                  />
                  <InputBox
                    value={user.country}
                    onChange={(e) => setUser({ ...user, country: e })}
                    label='Country'
                  />
                </div>

                {/* Action Buttons */}
                <div className='flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200'>
                  <Button onClick={() => {
                    handleUpdate()
                  }} >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>



            <div className='rounded-lg border border-gray-200 shadow-sm'>
              <div className='px-6 py-4 border-b border-gray-200'>
                <h2 className='text-xl font-semibold '>Security</h2>
                <p className='text-sm mt-1'>Change your password and manage security settings</p>
              </div>

              <div className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <InputBox
                    value={password.currentPassword}
                    onChange={(e) => setPassword({ ...password, currentPassword: e })}
                    label='Current Password'
                    type="password"
                  />
                  <InputBox
                    value={password.newPassword}
                    onChange={(e) => setPassword({ ...password, newPassword: e })}
                    label='New Password'
                    type="password"
                  />
                  <InputBox
                    value={password.confirmPassword}
                    onChange={(e) => setPassword({ ...password, confirmPassword: e })}
                    label='Confirm New Password'
                    type="password"
                  />

                  {/* Action Buttons */}
                  <div className='flex items-center justify-end ' >
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        updataPassWord()
                      }}
                    >
                      Change Password
                    </Button>
                  </div>

                </div>
              </div>
            </div>


            {/* Example placeholder for other settings (commented out for now) */}
            {/*
        <div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>Preferences</h2>
            <p className='text-sm text-gray-600 mt-1'>Customize your experience and notification settings</p>
          </div>
          
          <div className='p-6'>
            Preference settings will go here
          </div>
        </div>
        */}

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
      setTimeout(() => setEmailSent(false), 5000) // Reset after 5 seconds
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
    <Alert className=" f border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200 mb-6">
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
          className=" text-shadow-orange-500"
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