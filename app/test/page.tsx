"use client"
import { ImgBoxList } from '@/components/ImgBox';
import showToastSystem from '@/components/toastSystem';
import { Button } from '@/components/ui/button';
import { Base64FileResult } from '@/lib/utils';
import React, { useState } from 'react'

// Fake data for all tiers



export default function Page() {
  const [imageUrls, setImageUrls] = useState<Base64FileResult[]>([]);


  function handleImageUrlsChange() {
    showToastSystem({
       title: "Storage Full!",
      description: "Your storage is 95% full. Consider upgrading to continue uploading files.",
      buttonText: "View Plans",
      buttonIcon: true,
      action: () => {
        console.log('View Plans clicked');
        // Navigate to plans page
      }
     
    })
    
  }


  return (
    <div className='relative flex flex-row gap-4 p-4  min-h-screen items-center justify-center  overflow-hidden'>

      <Button onClick={() => handleImageUrlsChange()}>Click</Button>



      

    </div>
  )
}
