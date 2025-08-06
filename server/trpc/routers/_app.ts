import { z } from 'zod';
import { DateTime } from "luxon";

import { protectedProcedure, createTRPCRouter } from '../init';
import { PropertiesRouter } from './UserRouter';
import { stripe } from '@/lib/stripe';
import { TRPCError } from "@trpc/server";
import { userCongiRouter } from './userCongi';
import Stripe from 'stripe';
import { createServerCaller } from '../caller';
//import { headers } from "next/headers";

export const appRouter = createTRPCRouter({

  Propertie: PropertiesRouter,
  user: userCongiRouter,

  // Add other routers here as needed
  makeSubscription: protectedProcedure
    .input(z.object({ tier: z.enum(["Free", "Deluxe", "Premium"]) }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session?.user;
      if (!user) {
        console.warn("[makeSubscription] not signed in, tier=", input.tier);
        // you can either throw or return a shaped error
        throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in" });
      }

      const userId = user.id;
      const Prices: Record<"Free" | "Deluxe" | "Premium", string> = {
        Free: "",
        Deluxe: "price_1ResTb2c20NQVeDjj0lmeLk1",
        Premium: "price_1ResU72c20NQVeDjSFUqPejn",
      };

      try {
        // ─── FREE TIER ─────────────────────────────────────────────
        if (input.tier === "Free") {
          // find any active paid subs
          const paidSub = await ctx.prisma.subscription.findFirst({
            where: { userId, stripeSubscriptionId: { not: null } },
          });
          if (paidSub?.stripeSubscriptionId) {
            await stripe.subscriptions.cancel(paidSub.stripeSubscriptionId);

            if (paidSub.currentPeriodEnd) {
              const { id, createdAt, updatedAt, ...archivableData } = paidSub;

              const daysLeft = DateTime.fromJSDate(paidSub.currentPeriodEnd).diff(DateTime.local()).days;
              if (daysLeft <= 0) {
                const hasHistory = await ctx.prisma.subscriptionArchives.findFirst({
                  where: {
                    userId: userId,
                  },
                })

                if (!hasHistory) {
                  await ctx.prisma.subscriptionArchives.create({
                    data: {
                      userId: userId,
                      Subscriptions: {
                        create: {
                          ...archivableData
                        },
                      }
                    },

                  });
                } else {
                  await ctx.prisma.subscriptionArchives.update({
                    where: {
                      userId: userId,
                    },
                    data: {
                      Subscriptions: {
                        create: {
                          ...archivableData
                        },
                      }
                    },
                  });

                }
              }


            }
            await ctx.prisma.subscription.create({
              data: {
                userId: userId,
                stripeSubscriptionId: null,
                currentPeriodEnd: null,
                planTier: "Free",
                isActive: true
              },

            });
            // The processing of the subscription will be done in the webhook.

          }
          return { url: null, message: "Now on Free tier." };
        }

        // ─── PAID TIERS ─────────────────────────────────────────────
        const priceId = Prices[input.tier];
        if (!priceId) {
          console.error("[makeSubscription] missing priceId for tier", input.tier);
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid plan selected" });
        }

        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [{ price: priceId, quantity: 1 }],
          customer_email: user.email,
          success_url: `${process.env.NEXTAUTH_URL}/home/account?success=true`,
          cancel_url: `${process.env.NEXTAUTH_URL}/home/account?canceled=true`,
        });

        return { url: session.url!, message: "Redirecting to Stripe checkout…" };
      } catch (err: any) {
        console.error("[makeSubscription] error processing", {
          userId,
          tier: input.tier,
          error: err,
        });
        // surface the message so your client onError can toast it
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err?.message ?? "Subscription service unavailable",
        });
      }
    }),


    test: protectedProcedure.query(async ({ ctx }) => {
      const user = ctx.session?.user;
      if (!user) {
        console.warn("[test] not signed in");
        // you can either throw or return a shaped error
        throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in" });
      }
       const trpc = await createServerCaller();
       await trpc.user.getUserPlan()
      return { ok: true };
    }),


});
// export type definition of API
export type AppRouter = typeof appRouter;