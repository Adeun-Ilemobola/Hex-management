"use client"
import PropertyForm from '@/components/Form/PropertyForm'
import { usePropertyModification } from '@/components/Hook/usePropertyModification'
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

  const {
    propertyInfo,
    setPropertyInfo,

  } = usePropertyModification("")

  function handleSelectOrg() {
    
  }

  return (
    <div>
      <PropertyForm
        propertyInfo={propertyInfo}
        setPropertyInfo={setPropertyInfo}
        disable={false}
        handleSSubscriptionRequirement={() => 0}
        RemoveImage={() => { }}
        orgInfo={{
          data: data,
          loading: false,
          userId: "",
          refetch: () => { },
          showOwnershipConfig: false,
          disabled: false,
          handleSelectOrg: (id, type) => {
            setPropertyInfo(prev => ({
              ...prev,
              ownerId: id,
              ownerType: type
            }))
            setData(prev => prev.map(org => ({
              ...org,
              selected: org.id === id
            })))
          }
        }}

      />
    </div>
  )
}
