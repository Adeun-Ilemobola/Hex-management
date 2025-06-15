"use client"


import { NumberBox } from '@/components/InputBox';
import React, { useState } from 'react'

export default function Page() {
  const [price, setPrice] = useState(100); 


  return (
    <div className='relative flex flex-col   min-h-screen  overflow-hidden'>


      {/* <MakeUpdate id={undefined}/> */}
      <NumberBox
        label="Price"
        value={price}
        setValue={setPrice}
        min={0}
        max={10000}
        step={1}
      />


    </div>
  )
}
