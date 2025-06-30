"use client"



import { ImgBoxList } from '@/components/ImgBox';
import { Base64FileResult } from '@/lib/utils';
import React, { useState } from 'react'
// Fake data for all tiers



export default function Page() {
  const [imageUrls, setImageUrls] = useState<Base64FileResult[]>([]);


  return (
    <div className='relative flex flex-row gap-4  min-h-screen  overflow-hidden'>



      <ImgBoxList
       className=' w-[67rem]!'
        fileList={imageUrls}
        disabled={false}
        setData={list => setImageUrls(prev => ([...prev, ...list]))}
        SetMainImg={idx => {
          setImageUrls(pre => [...pre.map((item, i) => {
            idx === i ? item.Thumbnail = true : item.Thumbnail = false;

            return item
          })])

        }}
        del={(id) => {
          setImageUrls(pre => [...pre.filter((item, i) => {
            if (id !== i) {
              return item
            }
          })])

        }}


      />




    </div>
  )
}
