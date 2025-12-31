import Loading from '@/components/Loading'
import MultiStepForm from '@/components/Property/MultiStepForm'
import { Suspense } from 'react'

export default function page() {
  return (
    <>
    <Suspense fallback={<Loading />}>
    <MultiStepForm />
    </Suspense>
    </>
  )
}
