"use client"

// import { sendEmail } from '@/server/actions/sendEmail';
// import { useMutation } from '@tanstack/react-query'

import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerOverlay

} from "@/components/ui/drawer"
// import { mockOrganization } from '@/lib/Zod';
// import OrganizationDashboard from '@/components/(organizationFragments)/OrganizationDashboard';
// import { api } from '@/lib/trpc';
import InputBtu from '@/components/InputBtu';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Loading from '@/components/Loading';
// Fake data for all tiers

const email = "adeun2020@gmail.com"

export default function Page() {
  // const VerifyEmail = useMutation({
  //   mutationFn: async () => await sendEmail({
  //     templateText: "VerifyEmail",
  //     to: email,
  //     params: {
  //       verifyUrl: "https://google.com"
  //     }
  //   }),
  //   onSuccess: (data) => {
  //     console.log("Email sent successfully:", data);
  //     toast.success("Email sent successfully!", { id: "email-VerifyEmail" });
  //   },
  //   onError: (error) => {
  //     console.error("Error sending email:", error);
  //     toast.error("Failed to send email", { id: "email-VerifyEmail" });
  //   }

  // });

  // const ResetPassword = useMutation({
  //   mutationFn: async () => await sendEmail({
  //     templateText: "ResetPassword",
  //     to: email,
  //     params: {
  //       resetUrl: "https://google.com"
  //     }
  //   }),
  //   onSuccess: (data) => {
  //     console.log("Email sent successfully:", data);
  //     toast.success("Email sent successfully!", { id: "email-ResetPassword" });
  //   },
  //   onError: (error) => {
  //     console.error("Error sending email:", error);
  //     toast.error("Failed to send email", { id: "email-ResetPassword" });
  //   }
  // });

  // const WelcomeEmail = useMutation({
  //   mutationFn: async () => await sendEmail({
  //     templateText: "Welcome",
  //     to: email,
  //     params: {
  //       userName: "Adekunle",
  //     }
  //   }),
  //   onSuccess: (data) => {
  //     console.log("Email sent successfully:", data);
  //     toast.success("Email sent successfully!", { id: "email-WelcomeEmail" });
  //   },
  //   onError: (error) => {
  //     console.error("Error sending email:", error);
  //     toast.error("Failed to send email", { id: "email-WelcomeEmail" });
  //   }
  // });


  // const VerifyExternalInvestor = useMutation({
  //   mutationFn: async () => await sendEmail({
  //     templateText: "VerifyExternalInvestor",
  //     to: email,
  //     params: {
  //       name: "Adekunle",
  //       organizationName: "Adekunle's Org",
  //       propertyName: "Adekunle's Property",
  //       propertyLink: "https://google.com",
  //       email: "adeun2020@gmail.com",
  //       DollarValueReturn: 1000,
  //       verificationLink: `${process.env.NEXTAUTH_URL}/home/verifyExternalInvestor?investorId=${"533431bc-2e1d-462e-99c3-aec440c75530"}&propertieid=${"d93abec1-d97b-43b1-9e75-5f0591807e86"}`,
  //       contributionPercent: 10,
  //       accessCode: "P7qG6Pb1qTZW"
  //     }
  //   }),
  //   onSuccess: (data) => {
  //     console.log("Email sent successfully:", data);
  //     toast.success("Email sent successfully!", { id: "email-VerifyExternalInvestor" });
  //   },
  //   onError: (error) => {
  //     console.error("Error sending email:", error);
  //     toast.error("Failed to send email", { id: "email-VerifyExternalInvestor" });
  //   }
  // });


  // const onboardingFinished = useMutation({
  //   mutationFn: async () => await sendEmail({
  //     templateText: "onboardingFinished",
  //     to: email,
  //     params: {
  //       name: "Adekunle",
  //       organizationName: "Adekunle's Org",
  //       email: "adeun2020@gmail.com",
  //       fallbackUrl: "https://google.com",
  //       tempPassword: "password",
  //       userExists: false
  //     }
  //   }),
  //   onSuccess: (data) => {
  //     console.log("Email sent successfully:", data);
  //     toast.success("Email sent successfully!", { id: "email-onboardingFinished" });
  //   },
  //   onError: (error) => {
  //     console.error("Error sending email:", error);
  //     toast.error("Failed to send email", { id: "email-onboardingFinished" });
  //   }
  // });

  // const searchUsers = api.user.SearchUserByEmail.useMutation();




  // const [message, setMessage] = useState<{ message: string, file: FileUploadResult[] }[]>([]);
  // const [data, setData] = useState(new Date().toISOString());



  return (
    <div className='relative flex flex-col gap-4 p-9  min-h-screen  overflow-hidden'>

      {/* <OrganizationDashboard
     
      /> */}

      {/* <Drawer preventScrollRestoration direction='right'>
        <DrawerOverlay className=' bg-purple-500/15 backdrop-blur-sm' />
        <DrawerTrigger>
          <Button
          size={"icon"}
          variant="ghost"
          className="absolute right-4 top-4 z-30 rounded-full p-2 opacity-90 hover:opacity-100 md:hidden"
          onClick={() => {

          }}
          >
            new chat
          </Button>
        </DrawerTrigger>
        <DrawerContent className='bg-white/80 dark:bg-slate-900/20 backdrop-blur-lg rounded-xl shadow-xl border border-white/15 dark:border-white/5  min-w-[40rem] sm:min-w-[28rem]'>

          <div className='flex-1 flex flex-col gap-3'>
            <div className=' flex flex-row gap-4 p-2 '>
              <InputBtu
              className='w-full'
                onSubmit={(text) => {
                  console.log(text)
                  searchUsers.mutate({ email: text })
                }}
                icon={<>
                  <Search className='w-4 h-4 text-muted-foreground' />
                  <span className='sr-only'>Search</span>
                </>}

              />

            </div>
            {searchUsers.isPending ? (<div className='flex-1'>
            <Loading full={false} />

            </div>)
              : (
                <div className='flex-1 overflow-y-auto p-2'>
                  {searchUsers.data?.value.map((user) => {
                    return (
                      <div
                        key={user.id}
                        className="flex flex-row p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 rounded-xl border border-gray-200 dark:border-slate-700/70 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-200"

                      >
                        <div className='flex flex-row gap-3'>
                          <Avatar>
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className='flex flex-col gap-1'>
                            <p className='text-sm font-medium leading-none'>{user.name}</p>
                            <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
                          </div>
                        </div>
                        <div className='ml-auto flex items-center'>
                          {user.directMessage ? (
                            <Button size={"sm"} disabled>Message</Button>
                          ) : (
                            <Button size={"sm"}>Start Message</Button>
                          )}
                        </div>

                      </div>
                    )
                  })}
                </div>
              )}






          </div>
        </DrawerContent>
      </Drawer> */}

      {/* <div className='flex flex-row  gap-6 items-center justify-center'>
        <Button size={"lg"} onClick={() => VerifyEmail.mutate()}>Send Verify Email</Button>
        <Button size={"lg"} onClick={() => ResetPassword.mutate()}>Send Reset Password Email</Button>
        <Button size={"lg"} onClick={() => WelcomeEmail.mutate()}>Send Welcome Email</Button>
        <Button size={"lg"} onClick={() => VerifyExternalInvestor.mutate()}>Send Verify External Investor Email</Button>
        <Button size={"lg"} onClick={() => onboardingFinished.mutate()}>Send Onboarding Finished Email</Button>

      </div> */}


      {/* <div className='flex flex-col gap-4 w-64'>
        {message.map((data, index) => (
          <ChatBox key={index} id={data.message} text={data.message} img={data.file} />
        ))}


      </div>


      <ChatSend sendMessage={(data) => {
        console.log(data)
        setMessage(prev => [...prev, { message: data.message, file: data.file }]);

      }} />


      <DatePicker value={data} onChange={setData} /> */}

      {/* <Button onClick={() => handleImageUrlsChange()}>Click</Button>
<CustomSVG size={40} className="fill-transparent stroke-blue-800 stroke-2" />
<CustomSVG size={40} className="fill-blue-800" />
<CustomSVG size={40} className="fill-blue-600 stroke-blue-800 stroke-1" />
<CustomSVG size={40} className="fill-red-500 stroke-red-800 stroke-2" />
<CustomSVG size={40} className="fill-green-400 stroke-green-600" />
<CustomSVG size={40} className="fill-purple-300 stroke-purple-700 stroke-[0.5]" />




// Blue gradient (vertical by default)
<CustomSVG size={67} gradientFrom="#3b82f6" gradientTo="#1e40af" />

// Horizontal gradient
<CustomSVG size={67} gradientFrom="#ef4444" gradientTo="#dc2626" gradientDirection="horizontal" />

// Diagonal gradient
<CustomSVG size={67} gradientFrom="#8b5cf6" gradientTo="#7c3aed" gradientDirection="diagonal" />


<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded">
  <CustomSVG size={67} className="fill-white" />
</div>

<CustomSVG size={67} gradientFrom="#f59e0b" gradientTo="#d97706" gradientId="gradient1" />
<CustomSVG size={67} gradientFrom="#10b981" gradientTo="#059669" gradientId="gradient2" />
<CustomSVG size={67} gradientFrom="#3b82f6" gradientTo="#1e40af" gradientId="gradient3" /> */}





    </div>
  )
}
