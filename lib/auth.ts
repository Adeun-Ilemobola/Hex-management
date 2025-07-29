import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from '@/lib/prisma';
import { sendEmail } from "@/server/actions/sendEmail";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXTAUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://hex-management.vercel.app", // ✅ Production URL
    "https://hex-management-7t951livfx-adeuns-projects-408b65cf.vercel.app",
     process.env.NEXTAUTH_URL as string || "http://localhost:3000",
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    reddit: {
      clientId: process.env.REDDIT_CLIENT_ID as string,
      clientSecret: process.env.REDDIT_CLIENT_SECRET as string,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        returned: false,
        required: false,

        input: true
      },
      country: {
        type: "string",
        returned: false,
        required: false,
        input: true
      }
    },

  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      const res = await sendEmail({
        templateText: "VerifyEmail",
        to: user.email,
        params: {
          url,
          token
        }
      })

      console.log(res);

    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour


  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"]
    }
  },


});