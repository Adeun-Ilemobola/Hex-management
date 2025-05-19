import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from '@/lib/prisma';
 
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: { 
    enabled: true, 
  }, 

  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
    //   await sendEmail({
    //     to: user.email,
    //     subject: "Verify your email address",
    //     text: `Click the link to verify your email: ${url}`,
    //   });
    },
  },
});