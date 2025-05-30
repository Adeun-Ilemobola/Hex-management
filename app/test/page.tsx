"use client"

import PropertyCard from '@/components/(propertyFragments)/propertyCard'
import { DatePicker } from '@/components/date-picker'
import { api } from '@/lib/trpc'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

export default function Page() {
  const [newDate, setNewDatw] = useState<string | undefined>("")
  const helloQuery = useQuery(api().hello.queryOptions({ text: "ddfsd" }))
  const sumQuery = useQuery(api().addNumbers.queryOptions({ a: 4, b: 5 }));

  const reverseString = useMutation(api().reverseString.mutationOptions())
  const createUser = useMutation(api().createUser.mutationOptions());

  // Local state for mutations
  const [input, setInput] = useState("");
  const [user, setUser] = useState({ name: "", age: 0 });

  return (
    <div className='relative flex flex-col  min-h-screen  overflow-hidden'>






      <div className=" flex flex-row p-2.5 shrink-0 gap-2.5">
       
      </div>



    </div>
  )
}
