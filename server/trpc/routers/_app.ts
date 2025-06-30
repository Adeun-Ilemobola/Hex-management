import { z } from 'zod';

import { protectedProcedure, createTRPCRouter } from '../init';
import { PropertiesRouter } from './UserRouter';
import { stripe } from '@/lib/stripe';
import { TRPCError } from "@trpc/server";
export const appRouter = createTRPCRouter({

  Propertie: PropertiesRouter,

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
          // cancel any active paid subs
          const paidSub = await ctx.prisma.subscription.findFirst({
            where: {
              userId,
              isActive: true,
              status: "active",
              planTier: { in: ["Deluxe", "Premium"] },
            },
          });

          if (paidSub?.stripeSubscriptionId) {
            await stripe.subscriptions.cancel(paidSub.stripeSubscriptionId);
            await ctx.prisma.subscription.update({
              where: { id: paidSub.id },
              data: {
                status: "canceled",
                isActive: false,
                canceledAt: new Date(),
              },
            });
          }

          // create local free‐plan record
          await ctx.prisma.subscription.create({
            data: {
              userId,
              planTier: "Free",
              status: "active",
              isActive: true,
            },
          });

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
          success_url: `${process.env.NEXTAUTH_URL}/account?success=true`,
          cancel_url: `${process.env.NEXTAUTH_URL}/account?canceled=true`,
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
    })



});
// export type definition of API
export type AppRouter = typeof appRouter;