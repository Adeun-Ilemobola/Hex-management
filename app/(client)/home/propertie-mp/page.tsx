import PropertyModification from "@/components/(propertyFragments)/PropertyModification";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default async function Page() {
   
    return (
        <div className='relative flex flex-col  min-h-screen  overflow-hidden '>

            <Suspense fallback={<Loading />}>
                        <PropertyModification />

            </Suspense>
        </div>
    )
}