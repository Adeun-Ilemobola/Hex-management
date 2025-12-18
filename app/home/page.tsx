
import PropertyFilterView from "@/components/Property/PropertyFilterView"
import { use } from "react"


export default function Page({searchParams}:{ searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {

  const dat = use(searchParams)
  return (

    <div className='relative flex flex-col  min-h-screen  overflow-hidden'>
      

      <PropertyFilterView data={dat}/>
     
    </div>

  )
}
