import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";       // your Prisma client
import { stripe } from "@/lib/stripe";       // your initialized Stripe client
import { DateTime } from "luxon";


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
    } catch (err: unknown) {
        const error = err as Error;
        console.error("⚠️  Signature verification failed:", error.message);
        return NextResponse.json(
            {
                error: `Webhook signature verification failed: ${error.message}`,
                status: 400,
            }
        );
    }

    // 3) Handle the event
    try {
        if (
            event.type === "checkout.session.completed" ||
            event.type === "customer.subscription.updated" ||
            event.type === "customer.subscription.deleted"
        ) {
            // STEP 1: Get correct subscriptionId and email
            let subscriptionId: string;
            let userEmail: string | null = null;

            if (event.type === "checkout.session.completed") {
                const session = event.data.object as Stripe.Checkout.Session;
                subscriptionId = session.subscription as string;
                userEmail = session.customer_email;
            } else {
                const sub = event.data.object as Stripe.Subscription;
                subscriptionId = sub.id;
                const customer = await stripe.customers.retrieve(sub.customer as string);
                userEmail = (customer as Stripe.Customer).email ?? null;
            }

            console.log("Webhook received:", event.type, subscriptionId, userEmail);


            if (!userEmail) return NextResponse.json({ received: true });

            // STEP 2: Lookup user
            const user = await prisma.user.findUnique({ where: { email: userEmail } });
            if (!user) {
                console.log("User not found:", userEmail);

                return NextResponse.json({ received: true });

            };

            // STEP 3: Retrieve subscription (full object)
            const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
            const item = stripeSub.items.data[0];

            console.log("Stripe subscription:", stripeSub);
            console.log("Stripe item:", item);



            // STEP 4: Find current DB sub
            const currentSub = await prisma.subscription.findFirst({
                where: { userId: user.id }
            });

            const daysLeft = currentSub?.currentPeriodEnd
                ? DateTime.fromJSDate(currentSub.currentPeriodEnd).diffNow("days").days
                : null;

            const isExpired = daysLeft !== null && daysLeft <= 0;
            const shouldArchive =
                stripeSub.status === "canceled" ||
                stripeSub.cancel_at_period_end ||
                stripeSub.canceled_at;


            const subName = item.price.id === "price_1ResTb2c20NQVeDjj0lmeLk1" ? "Deluxe" : "Premium";
            if (currentSub && isExpired && shouldArchive) {
                // archive logic
                const {
                    id,
                    createdAt,
                    updatedAt,
                    ...archivableData
                } = currentSub;
                await prisma.subscriptionArchives.create({
                    data: {
                        userId: user.id,
                        Subscriptions: {
                            create: {
                                ...archivableData,
                            },
                        },
                    },
                });
                console.log(id , createdAt, updatedAt,);
                
                await prisma.subscription.delete({
                    where: {
                        id: currentSub.id
                    }
                })
                await prisma.subscription.create({
                    data: {
                        userId: user.id,
                        stripeSubscriptionId: null,
                        currentPeriodEnd: null,
                        planTier: "Free",
                        isActive: true,
                    },
                });

                return NextResponse.json({ received: true });

            }

            // STEP 5: Update sub or create free tier if needed
            if (!currentSub) {
                console.log("Creating new subscription for user:", user.id);


                await prisma.subscription.create({
                    data: {
                        userId: user.id,
                        status: stripeSub.status,
                        isActive: stripeSub.status === "active",
                        // update the new period end if it changed
                        currentPeriodEnd: new Date(item.current_period_end * 1000),
                        // if you want to update the start too:
                        currentPeriodStart: new Date(item.current_period_start * 1000),
                        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
                        canceledAt: stripeSub.canceled_at
                            ? new Date(stripeSub.canceled_at * 1000)
                            : null,

                        stripeSubscriptionId: stripeSub.id,
                        planTier: subName,
                        priceId: item.price.id,
                        stripeCustomerId: stripeSub.customer as string
                    },
                });
            } else {
                await prisma.subscription.update({
                    where: { id: currentSub.id },
                    data: {
                        nextStripeSubscriptionId: item.id,
                        isActive: true,
                        status: stripeSub.status,
                        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
                        currentPeriodStart: new Date(item.current_period_start * 1000),
                        currentPeriodEnd: new Date(item.current_period_end * 1000),
                        canceledAt: stripeSub.canceled_at ? new Date(stripeSub.canceled_at * 1000) : null,
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
