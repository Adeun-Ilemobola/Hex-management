"use client"
import PropertyForm from '@/components/Form/PropertyForm'
import { usePropertyModification } from '@/components/Hook/usePropertyModification'
import MultiStepForm from '@/components/MultiStepForm'
import PropertyCard from '@/components/Property/PropertyCard'
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
    <div >
      <MultiStepForm />
      


    </div>
  )
}
