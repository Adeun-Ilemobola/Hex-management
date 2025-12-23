"use client"

import DropBack from '@/components/DropBack'
import SubscriptionCard from '@/components/SubscriptionCard'
import { authClient } from '@/lib/auth-client'
import { trpc as api } from '@/lib/client'
import { toast } from 'sonner'
import { Nav } from '@/components/Nav'
import { Button } from '@/components/ui/button'

// Define the plan type for stricter usage
type PlanTier = 'free' | 'deluxe' | 'premium';

export const subscriptionPlans = [
  {
    tier: 'Free',
    value: 'free' as PlanTier,
    price: 0,
    isMonthly: true,
    description: 'Perfect for managing your first few properties.',
    benefits: [
      'Manage up to 3 Properties',
      '1 Organization',
      'Basic Resident Chat',
      'Standard Support',
    ],
  },
  {
    tier: 'Deluxe',
    value: 'deluxe' as PlanTier,
    price: 12,
    isMonthly: true,
    description: 'For growing agencies needing investor tools.',
    benefits: [
      'Manage up to 20 Properties',
      '3 Organizations',
      'Investor Onboarding Flows',
      'Remove Hex Branding',
      'Priority Email Support',
      'Advanced Analytics',
    ],
  },
  {
    tier: 'Premium',
    value: 'premium' as PlanTier,
    price: 25,
    isMonthly: true,
    description: 'Full scale management for large portfolios.',
    benefits: [
      'Unlimited Properties',
      '10 Organizations',
      'Unlimited External Investors',
      'AI Pricing Engine (Beta)',
      'Dedicated Account Manager',
      '24/7 VIP Support',
      'Early Access to New Features',
    ],
  },
];

export default function Page() {
  // 1. Consolidated Session Hook
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const { data: userPlanData, isPending: userPlanLoading } = api.user.getUserPlan.useQuery();

  const subscriptionMutation = api.subscription.UpgradeSubscription.useMutation({
    onSuccess(data) {
      if (data?.success && data.value?.url) {
        toast.success("Redirecting to checkout...");
        window.location.href = data.value.url;
      } else {
        toast.error(data.message || "Something went wrong");
      }
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const isPending = sessionPending || subscriptionMutation.isPending || userPlanLoading;

  const currentPlanValue = userPlanData?.planDetail?.PlanTier?.toLowerCase() || 'free';

  return (
    <DropBack is={isPending}>
      <Nav session={session} SignOut={() => authClient.signOut()} />
      <div className="container mx-auto px-6 py-16">
        <div>
          <header className="text-center mb-14">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Select Your Plan
            </h1>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Upgrade or downgrade anytime. No hidden fees.
            </p>
          </header>





        </div>


        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptionPlans.map((plan) => {
            const isCurrent = plan.value === currentPlanValue;

            return (
              <SubscriptionCard
                key={plan.tier}
                data={{
                  ...plan,
                  tier: plan.tier,

                  isCurrent: isCurrent,

                }}
                onSelect={() => {
                  if (plan.value === 'free' && currentPlanValue !== 'free') {
                    toast.info("Please use the Billing Portal to cancel or downgrade.");
                    return;
                  }

                  // Don't re-upgrade to the same plan
                  if (isCurrent) return;

                  subscriptionMutation.mutate({

                    plan: plan.value,
                    organizationId: null,
                    annual: false
                  });
                }}
              />
            );
          })}
        </div>


        <div className="flex flex-row gap-2.5 justify-center mt-6">
          <Button
            variant={"outline"}
            onClick={async () => {
              if (!userPlanData?.planDetail?.userId) {
                toast.error("No user found");
                return;
              }
              const { data, error } = await authClient.subscription.billingPortal({
                locale: "auto",
                referenceId: userPlanData.planDetail.userId,
                returnUrl: window.location.origin,
              });

              if (error) {
                toast.error(error.message);
                return;
              }

              if (data?.url) {
                window.location.href = data.url;
              }

            }}

          >
            Billing Portal
          </Button>

          {userPlanData?.planDetail.PlanTier !== "Free" && (<>
            <Button
              variant={"outline"}
              onClick={async () => {
                if (!userPlanData) {
                  toast.error("No user found");
                  return;
                }
                const { data, error } = await authClient.subscription.cancel({
                  referenceId: userPlanData.planDetail.userId,
                  subscriptionId: userPlanData.planDetail.stripeSubscriptionId,
                  returnUrl: `${process.env.NEXTAUTH_URL}/home/account?canceled=true`, // required
                });

                if (error) {
                  toast.error(error.message);
                  return;
                }

                if (data?.url) {
                  window.location.href = data.url;
                }

                
              }}
            >
              Cancel Subscription
            </Button>
          </>)}


        </div>
      </div>
    </DropBack>
  );
}