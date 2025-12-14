"use client"
import PropertyForm from '@/components/Form/PropertyForm'
import { usePropertyModification } from '@/components/Hook/usePropertyModification'
import MultiStepForm from '@/components/MultiStepForm'
import PropertyCard from '@/components/PropertyCard'
import { tr } from 'date-fns/locale'
import React from 'react'
import z from 'zod'


type Props = {
  id: string;
    name: string;
    selected: boolean;
    type: "USER" | "ORGANIZATION";
}

export default function page() {
  const [data, setData] = React.useState<Props[]>([
    {
      id: "1",
      name: "adeun",
      selected: false,
      type: "USER"
    },
    {
      id: "2",
      name: "org",
      selected: true,
      type: "ORGANIZATION"
    }
  ])



  function handleSelectOrg() {
    
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <PropertyCard
        data={{
          img: "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          name: "Property Name",
          address: "123 Main St, Anytown, USA",
          status: "pending",
          saleStatus: "SELL",
          id: "1"
        }}
        mode={true}
      />


    </div>
  )
}
