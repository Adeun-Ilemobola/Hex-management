"use client"
import { Button } from '@/components/ui/button';
import { sendEmail } from '@/server/actions/sendEmail';
import { useMutation } from '@tanstack/react-query'


import { toast } from 'sonner';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerOverlay
  
} from "@/components/ui/drawer"

// Fake data for all tiers

const email = "adeun2020@gmail.com"

export default function Page() {
  const VerifyEmail = useMutation({
    mutationFn: async () => await sendEmail({
      templateText: "VerifyEmail",
      to: email,
      params: {
        verifyUrl: "https://google.com"
      }
    }),
    onSuccess: (data) => {
      console.log("Email sent successfully:", data);
      toast.success("Email sent successfully!" , {id: "email-VerifyEmail"});
    },
    onError: (error) => {
      console.error("Error sending email:", error);
      toast.error("Failed to send email", {id: "email-VerifyEmail"});
    }

  });

  const ResetPassword = useMutation({
    mutationFn: async () => await sendEmail({
      templateText: "ResetPassword",
      to: email,
      params: {
        resetUrl: "https://google.com"
      }
    }),
    onSuccess: (data) => {
      console.log("Email sent successfully:", data);
      toast.success("Email sent successfully!" , {id: "email-ResetPassword"});
    },
    onError: (error) => {
      console.error("Error sending email:", error);
      toast.error("Failed to send email", {id: "email-ResetPassword"});
    }
  });

  const WelcomeEmail = useMutation({
    mutationFn: async () => await sendEmail({
      templateText: "Welcome",
      to: email,
      params: {
       userName: "Adekunle",
      }
    }),
    onSuccess: (data) => {
      console.log("Email sent successfully:", data);
      toast.success("Email sent successfully!" , {id: "email-WelcomeEmail"});
    },
    onError: (error) => {
      console.error("Error sending email:", error);
      toast.error("Failed to send email", {id: "email-WelcomeEmail"});
    }
  });


  const VerifyExternalInvestor = useMutation({
    mutationFn: async () => await sendEmail({
      templateText: "VerifyExternalInvestor",
      to: email,
      params: {
       name: "Adekunle",
       organizationName: "Adekunle's Org",
       propertyName: "Adekunle's Property",
       propertyLink: "https://google.com",
       email: "adeun2020@gmail.com",
       DollarValueReturn: 1000,
       verificationLink: `${process.env.NEXTAUTH_URL}/home/verifyExternalInvestor?investorId=${"533431bc-2e1d-462e-99c3-aec440c75530"}&propertieid=${"d93abec1-d97b-43b1-9e75-5f0591807e86"}`,
       contributionPercent: 10,
       accessCode: "P7qG6Pb1qTZW"
      }
    }),
    onSuccess: (data) => {
      console.log("Email sent successfully:", data);
      toast.success("Email sent successfully!" , {id: "email-VerifyExternalInvestor"});
    },
    onError: (error) => {
      console.error("Error sending email:", error);
      toast.error("Failed to send email", {id: "email-VerifyExternalInvestor"});
    }
  });


  const onboardingFinished = useMutation({
    mutationFn: async () => await sendEmail({
      templateText: "onboardingFinished",
      to: email,
      params: {
        name: "Adekunle",
        organizationName: "Adekunle's Org",
        email: "adeun2020@gmail.com",
        fallbackUrl: "https://google.com",
        tempPassword: "password",
          userExists: false
      }
    }),
    onSuccess: (data) => {
      console.log("Email sent successfully:", data);
      toast.success("Email sent successfully!" , {id: "email-onboardingFinished"});
    },
    onError: (error) => {
      console.error("Error sending email:", error);
      toast.error("Failed to send email", {id: "email-onboardingFinished"});
    }
  });




  // const [message, setMessage] = useState<{ message: string, file: FileUploadResult[] }[]>([]);
  // const [data, setData] = useState(new Date().toISOString());



  return (
    <div className='relative flex flex-col gap-4 p-9  min-h-screen  overflow-hidden'>

      <Drawer preventScrollRestoration direction='right'>
        <DrawerOverlay className=' bg-purple-500/15 backdrop-blur-sm' />
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent className=' min-w-[46rem] sm:min-w-[50rem]'>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className='flex flex-row  gap-6 items-center justify-center'>
        <Button size={"lg"} onClick={() => VerifyEmail.mutate()}>Send Verify Email</Button>
        <Button size={"lg"} onClick={() => ResetPassword.mutate()}>Send Reset Password Email</Button>
        <Button size={"lg"} onClick={() => WelcomeEmail.mutate()}>Send Welcome Email</Button>
        <Button size={"lg"} onClick={() => VerifyExternalInvestor.mutate()}>Send Verify External Investor Email</Button>
        <Button size={"lg"} onClick={() => onboardingFinished.mutate()}>Send Onboarding Finished Email</Button>

      </div>


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
