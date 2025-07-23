"use client"
import CustomSVG from '@/components/Icon/logo';
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
<CustomSVG size={40} className="fill-transparent stroke-blue-800 stroke-2" />
<CustomSVG size={40} className="fill-blue-800" />
<CustomSVG size={40} className="fill-blue-600 stroke-blue-800 stroke-1" />
<CustomSVG size={40} className="fill-red-500 stroke-red-800 stroke-2" />
<CustomSVG size={40} className="fill-green-400 stroke-green-600" />
<CustomSVG size={40} className="fill-purple-300 stroke-purple-700 stroke-[0.5]" />




// Blue gradient (vertical by default)
<CustomSVG size={67} gradientFrom="#3b82f6" gradientTo="#1e40af" />

// Horizontal gradient
<CustomSVG size={67} gradientFrom="#ef4444" gradientTo="#dc2626" gradientDirection="horizontal" />

// Diagonal gradient
<CustomSVG size={67} gradientFrom="#8b5cf6" gradientTo="#7c3aed" gradientDirection="diagonal" />


<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded">
  <CustomSVG size={67} className="fill-white" />
</div>

<CustomSVG size={67} gradientFrom="#f59e0b" gradientTo="#d97706" gradientId="gradient1" />
<CustomSVG size={67} gradientFrom="#10b981" gradientTo="#059669" gradientId="gradient2" />
<CustomSVG size={67} gradientFrom="#3b82f6" gradientTo="#1e40af" gradientId="gradient3" />



      

    </div>
  )
}
