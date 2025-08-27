import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from '@/lib/prisma';
import { sendEmail } from "@/server/actions/sendEmail";
import { organization } from "better-auth/plugins"
import { createServerCaller } from "@/server/trpc/caller";
import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})
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
      stripeCustomerId: { type: "string", required: false, input: false },

      country: {
        type: "string",
        returned: false,
        required: false,
        input: true
      }
    },

  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const res = await sendEmail({
        templateText: "VerifyEmail",
        to: user.email,
        params: {
          verifyUrl: url
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

  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      

      subscription: {
        enabled: true,
        plans: [
          {
            name: "Deluxe",
            priceId: "price_1S03q92c20NQVeDjKSDVR7j8",
            annualDiscountPriceId: "price_1S04Wb2c20NQVeDjlhnehbj3",
            limits: {
              orgMembers: 12,
              ChatBoxs: 12,
              chatMessagesImage: 15,
              maxProjects: 10,
              maxProjectImages: 15,
              maxOrg: 4,
              PoolInvestor: 1 // 1=true, 0=false

            }

          },
          {
            name: "Premium",
            priceId: "price_1S03nJ2c20NQVeDj9SMnndNq",
            annualDiscountPriceId: "price_1S04aA2c20NQVeDjTA0JD0aA",
            limits: {
              orgMembers: 100,
              ChatBoxs: 100,
              chatMessagesImage: 45,
              maxProjects: 2000,
              maxProjectImages: 45,
              maxOrg: 10,
              PoolInvestor: 1 // 1=true, 0=false
            }
          },
          {
            name: "free",
            limits: {
              orgMembers: 4,
              ChatBoxs: 3,
              chatMessagesImage: 5,
              maxProjects: 2,
              maxProjectImages: 5,
              maxOrg: 1,
              PoolInvestor: 0 // 1=true, 0=false
            }
          }

        ],
        authorizeReference: async ({ user, referenceId }) => {
           if (!referenceId || referenceId === user.id) return true;
          const member = await prisma.member.findFirst({
            where: {
              userId: user.id,
              organizationId: referenceId
            }

          })
           return !!member && ["owner", "admin"].includes(member.role);
        }

      }
    }),

    organization({
      // async sendInvitationEmail(data) {
      //   const inviteLink = `https://app.com/accept-invite/${data.id}`;
      //   await sendEmail({
      //     to: data.email,
      //     subject: `Join ${data.organization.name}`,
      //     html: `<a href="${inviteLink}">Accept invite</a>`
      //   });
      // }


      allowUserToCreateOrganization: async () => {
        const caller = await createServerCaller();
        const { value: plan } = await caller.user.getUserPlan();
        if (!plan) {
          return false;
        }
        if (plan.plan === "free") {
          return false
        } else if (plan.plan === "Deluxe" || plan.plan === "Premium") {
          return true
        }
        return false

      }
    })
  ]

});