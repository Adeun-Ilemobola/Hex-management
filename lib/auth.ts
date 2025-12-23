import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// import { sendEmail } from "@/server/actions/sendEmail";
import { organization } from "better-auth/plugins"
// import { createServerCaller } from "@/server/trpc/caller";
import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"
import { magicLink } from "better-auth/plugins";
import prisma from "./prisma";
import { sendEmail } from "@/server/sendEmail";
import { getPlanLimits } from "./PlanConfig";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover", // Latest API version as of Stripe SDK v20.0.0
})
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.APP_URL!,
  
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

    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url, token }, request) => {
        const res = await sendEmail({
          templateText: 'getConfirmEmailChangeHtml',
          to: user.email,
          params: {
            confirmUrl: url,
            newEmail
          }
        })
        console.log(res);

      }
    }

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
      stripeWebhookSecret:`${process.env.APP_URL!}/api/auth/stripe/webhook`,
      createCustomerOnSignUp: true,
      onCustomerCreate: async ({ stripeCustomer, user }, ctx) => {

        console.log(`Customer ${stripeCustomer.id} created for user ${user.id} and  email ${user.email}`);
      },


      subscription: {
        enabled: true,
        plans: [
          {
            name: "deluxe",
            priceId: "price_1S03q92c20NQVeDjKSDVR7j8",
            annualDiscountPriceId: "price_1S04Wb2c20NQVeDjlhnehbj3",
            limits: { ...getPlanLimits("Deluxe") }
          },
          {
            name: "premium",
            priceId: "price_1S03nJ2c20NQVeDj9SMnndNq",
            annualDiscountPriceId: "price_1S04aA2c20NQVeDjTA0JD0aA",
            limits: { ...getPlanLimits("Premium") }
          },
          {
            name: "free",
            // No priceId here means this is a logical plan only.
            // You CANNOT "upgrade" to this via Stripe.
            // Users must cancel their sub to fall back to this.
            limits: { ...getPlanLimits("Free") }
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


    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        console.log(token);

        await sendEmail({
          templateText: "generateMagicLinkEmail",
          to: email,
          params: {
            email,
            url: url
          }
        })
      }
    }),

    organization({
      requireEmailVerificationOnInvitation: true,
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.APP_URL}/accept-invite?id=${data.id}`;
        const sendPayload = {
          organizationName: data.organization.name,
          userEmail: data.email,
          inviteLink,
          role: data.role as "member" | "owner" | "admin"
        }

        await sendEmail({
          templateText: "generateOrganizationInviteEmail",
          to: data.email,
          params: sendPayload
        })

      },


      // allowUserToCreateOrganization: async (user) => {
      //   const sub = await prisma.subscription.findFirst({
      //     where: { referenceId: user.id, status: "active" }
      //   });
      //   return !!sub;
      // }
    })
  ]

});