"use client"

import React from 'react'
import DropBack from '@/components/DropBack'
import SubscriptionCard from '@/components/SubscriptionCard'
import { authClient } from '@/lib/auth-client'
import { api } from '@/lib/trpc'
import { toast } from 'sonner'
// import { useRouter } from 'next/navigation'
const subscriptionPlans = [
  {
    tier: 'free' as const,
    value: 'free',
    price: 0,
    isMonthly: true,
    isCurrent: true,
    benefits: ['Basic usage', 'Access to community forum'],
  },
  {
    tier: 'Deluxe' as const,
    value: 'deluxe',
    price: 12,
    isMonthly: true,
    isCurrent: false,
    benefits: [
      'All Free benefits',
      'Priority email support',
      'Custom profile page',
      'Monthly usage analytics',
    ],
  },
  {
    tier: 'Premium' as const,
    value: 'premium',
    price: 25,
    isMonthly: true,
    isCurrent: false,
    benefits: [
      'All Deluxe benefits',
      'Dedicated account manager',
      'Advanced integrations and APIs',
      'Early access to new features',
      '24/7 VIP support',
      'Unlimited data exports',
    ],
  },
];

export default function Page() {
  // const router = useRouter();
  const { isPending: sessionLoading } = authClient.useSession();
  const {data:getUserPlan , isPending:getUserPlanLoading} = api.user.getUserPlan.useQuery()
  const subscriptionMutation = api.subscription.UpgradeSubscription.useMutation({
    onSuccess(data) {
      if (data?.success && data.value?.url){
        toast.success(data.message);
        window.location.href = data.value.url
       
      }else{
        toast.error(data.message||"Something went wrong");
      }
    },
    onError(err) {
      toast.error(err.message);
    },
  });



  

  const isPending = sessionLoading || subscriptionMutation.isPending ||getUserPlanLoading

  
  return (
    <DropBack is={isPending}>
      <div className="container mx-auto px-6 py-16">
        <header className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Select Your Plan
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Upgrade or downgrade anytime. No hidden fees.
          </p>
        </header>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <SubscriptionCard
              key={plan.tier}
              
              data={
                {
                  ...plan,
                  isCurrent: plan.tier.toLowerCase()  === getUserPlan?.value?.plan.toLowerCase() 
                }
              }
              onSelect={(tier) => {
                subscriptionMutation.mutate({
                  plan: tier,
                  organizationId: null
                });
              }}
            />
          ))}
        </div>
      </div>

    </DropBack>
  );
}
