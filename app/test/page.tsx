"use client"


import { NumberBox } from '@/components/InputBox';
import SubscriptionCard from '@/components/SubscriptionCard';
import React, { useState } from 'react'
// Fake data for all tiers

const subscriptionPlans = [
  {
    tier: "Free" as const,
    price: 0,
    isMonthly: true,
    isCurrent: false,
    benefits: [
      "Basic usage",
      "Access to community forum",
    ],
  },
  {
    tier: "Deluxe" as const,
    price: 12,
    isMonthly: true,
    isCurrent: false,
    benefits: [
      "All Free benefits",
      "Priority email support",
      "Custom profile page",
      "Monthly usage analytics",
    ],
  },
  {
    tier: "Premium"as const,
    price: 29,
    isMonthly: true,
    isCurrent: true,
    benefits: [
      "All Deluxe benefits",
      "Dedicated account manager",
      "Advanced integrations and APIs for your workflow",
      "Early access to new features and beta releases",
      "24/7 VIP support with live chat",
      "Export and backup your data anytime",
    ],
  },
];


export default function Page() {
  const [price, setPrice] = useState(100);


  return (
    <div className='relative flex flex-row gap-4 items-center justify-center   min-h-screen p-14  overflow-hidden'>

     


    </div>
  )
}
