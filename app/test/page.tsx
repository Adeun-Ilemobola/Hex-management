"use client"

import PropertyCard from '@/components/(propertyFragments)/propertyCard'
import { DatePicker } from '@/components/date-picker'
import ImgBox from '@/components/ImgBox'
import MakeUpdate from '@/components/MakeUpdate'
import { api } from '@/lib/trpc'
import { Base64FileResult } from '@/lib/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

export default function Page() {
  const [newDate, setNewDatw] = useState<Base64FileResult[]>([])




  function setData(params: Base64FileResult[]) {
    setNewDatw(pre => [...pre, ...params])

  }

  function SetMainImg(id: number) {
    setNewDatw(per => per.map((item, i) => {
      if (id === i) {
        item.Thumbnail = true
      } else {
        item.Thumbnail = false

      }
      return item
    }))


  }


  return (
    <div className='relative flex flex-col   min-h-screen  overflow-hidden'>

      {/* <ImgBox
        setData={setData}
        SetMainImg={SetMainImg}
        fileList={newDate}
        Class=' w-[50%]'

      /> */}


      <MakeUpdate id={undefined}/>









    </div>
  )
}
