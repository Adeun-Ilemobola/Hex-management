"use client"

import { DatePicker } from '@/components/date-picker'
import { api } from '@/lib/trpc'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

export default function Page() {
  const [newDate, setNewDatw] = useState<string | undefined>("")
  const helloQuery = useQuery(api().hello.queryOptions({ text: "ddfsd" }))
  const sumQuery = useQuery(api().addNumbers.queryOptions({ a: 4, b: 5 }));

  const reverseString = useMutation( api().reverseString.mutationOptions())
  const createUser = useMutation(api().createUser.mutationOptions());

  // Local state for mutations
  const [input, setInput] = useState("");
  const [user, setUser] = useState({ name: "", age: 0 });

  return (
    <div className='relative flex flex-col  min-h-screen  overflow-hidden'>

      <DatePicker
        value={newDate}
        onChange={(va) => {
          setNewDatw(va)
          console.log(va);

        }}


      />

      {/* Hello Query */}
      <div>
        <b>Hello:</b> {helloQuery.data?.greeting}
      </div>

      {/* Add Numbers Query */}
      <div>
        <b>Add 2 + 3:</b> {sumQuery.data?.result}
      </div>




      <h1>{newDate}</h1>


      {/* Reverse String Mutation */}
      <div>
        <input
          placeholder="Reverse this"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-2"
        />
        <button
          onClick={() => reverseString.mutate({ value: input })}
          className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
        >
          Reverse
        </button>
        <div>
          <b>Reversed:</b> {reverseString.data?.reversed}
        </div>
      </div>

      {/* Create User Mutation */}
      <div>
        <input
          placeholder="Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          className="border px-2"
        />
        <input
          type="number"
          placeholder="Age"
          value={user.age}
          onChange={(e) => setUser({ ...user, age: Number(e.target.value) })}
          className="border px-2 ml-2"
        />
        <button
          onClick={() => createUser.mutate({ name: user.name, age: user.age })}
          className="ml-2 px-2 py-1 bg-green-600 text-white rounded"
        >
          Create User
        </button>
        <div>
          <b>User Created:</b>{" "}
          {createUser.data &&
            `id: ${createUser.data.id}, name: ${createUser.data.name}, age: ${createUser.data.age}`}
        </div>
      </div>

    </div>
  )
}
