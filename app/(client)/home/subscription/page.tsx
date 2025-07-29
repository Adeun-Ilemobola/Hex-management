"use client"

import React from 'react'
import DropBack from '@/components/DropBack'
import SubscriptionCard from '@/components/SubscriptionCard'
import { authClient } from '@/lib/auth-client'
import { api } from '@/lib/trpc'
import { toast } from 'sonner'

const subscriptionPlans = [
  {
    tier: 'Free' as const,
    value: 'Free',
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

export default function SubscriptionPage() {
  const {  isPending: sessionLoading } = authClient.useSession();
  const [subscriptionList, setSubscriptionList] = React.useState(subscriptionPlans);
  const getUserPlan = api.user.getUserPlan.useQuery()
  const subscriptionMutation = api.makeSubscription.useMutation({
    onSuccess({ url, message }) {
      if (url) {
        window.location.href = url;
      } else {
        toast.success(message);
      }
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  React.useEffect(() => {
    if (getUserPlan.data) {
      console.log(getUserPlan.data);
      
      setSubscriptionList(pre => pre.map(p => ({ ...p, isCurrent: (p.value === getUserPlan.data.data.planTier )})));
    }

   
  }, [getUserPlan.data]);

  function handleSelect(tier: 'Free' | 'Deluxe' | 'Premium') {
    subscriptionMutation.mutate({ tier });
  };

  const isPending = sessionLoading || subscriptionMutation.isPending || getUserPlan.isPending || getUserPlan.isFetching;

  return (
    <DropBack is={isPending}>
      <div className="container mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold">Select Your Plan</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Upgrade or downgrade at any time, no hidden fees.
          </p>
        </header>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptionList.map((plan) => (
            <SubscriptionCard
              key={plan.tier}
              data={plan}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </DropBack>
  );
}
