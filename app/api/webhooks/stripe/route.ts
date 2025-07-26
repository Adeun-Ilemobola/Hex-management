import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";       // your Prisma client
import { stripe } from "@/lib/stripe";       // your initialized Stripe client

export const config = {
    api: { bodyParser: false },               // disable Next.js’s default parser
};
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    // 1) Grab raw body and signature
    const signature = req.headers.get("stripe-signature")!;
    const textBody = await req.text();


    // 2) Verify the webhook signature
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            textBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("⚠️  Signature verification failed:", err.message);
        return NextResponse.json(
            { error: `Webhook signature verification failed: ${err.message}` },
            { status: 400 }
        );
    }

    // 3) Handle the event
    try {
        // A) New checkout → create a subscription in your DB
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const subscriptionId = session.subscription as string;
            const customerId = session.customer as string;
            const userEmail = session.customer_email as string;

            // Look up your user
            const user = await prisma.user.findUnique({
                where: { email: userEmail },
            });
            if (!user) return NextResponse.json({ received: true });

            //get the plan  old subscription
            const oldSub = await prisma.subscription.findFirst({
                where: { userId: user.id, isActive: true },
            });

            if (oldSub && oldSub.stripeSubscriptionId) {
                // Cancel the old subscription
                await stripe.subscriptions.cancel(oldSub.stripeSubscriptionId);
                await prisma.subscription.update({
                    where: { id: oldSub.id },
                    data: {
                        isActive: false,
                        canceledAt: new Date(),
                        status: "canceled",
                    },
                });
            }
        

            // Retrieve the Stripe.Subscription (full object)
            const subscription = await stripe.subscriptions.retrieve(
                subscriptionId
            ) as Stripe.Subscription;

            // Get the first subscription item
            const item = subscription.items.data[0];
            const product = item.price.product as Stripe.Product;

            // Deactivate any old subs
            await prisma.subscription.updateMany({
                where: { userId: user.id, isActive: true },
                data: { isActive: false },
            });

            // Create the new active subscription record
            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customerId,
                    stripeSubscriptionId: subscription.id,
                    priceId: item.price.id,
                    status: subscription.status,
                    // ← Pull these off the subscription item!
                    currentPeriodStart: new Date(item.current_period_start * 1000),
                    currentPeriodEnd: new Date(item.current_period_end * 1000),
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    canceledAt: subscription.canceled_at
                        ? new Date(subscription.canceled_at * 1000)
                        : undefined,
                    isActive: true,
                    planTier:product.name || "premium",
                   
                    
                },
            });
        }

        // B) Updates & cancellations → patch the existing record
        if (
            event.type === "customer.subscription.updated" ||
            event.type === "customer.subscription.deleted"
        ) {
            const subscription = event.data.object as Stripe.Subscription;
            const item = subscription.items.data[0];

            const userSub = await prisma.subscription.findFirst({
                where: { stripeSubscriptionId: subscription.id },
            });
            if (userSub) {
                await prisma.subscription.update({
                    where: { id: userSub.id },
                    data: {
                        status: subscription.status,
                        isActive: subscription.status === "active",
                        // update the new period end if it changed
                        currentPeriodEnd: new Date(item.current_period_end * 1000),
                        // if you want to update the start too:
                        currentPeriodStart: new Date(item.current_period_start * 1000),
                        cancelAtPeriodEnd: subscription.cancel_at_period_end,
                        canceledAt: subscription.canceled_at
                            ? new Date(subscription.canceled_at * 1000)
                            : null,
                    },
                });
            }
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("Webhook handler error:", err);
        return NextResponse.json(
            { error: "Webhook processing failed." },
            { status: 500 }
        );
    }
}
