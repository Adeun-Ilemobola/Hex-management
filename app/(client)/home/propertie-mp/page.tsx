import PropertyModification from "@/components/(propertyFragments)/PropertyModification";
import { useSearchParams } from "next/navigation";

export default async function Page() {
   
    return (
        <div className='relative flex flex-col  min-h-screen  overflow-hidden '>
            <PropertyModification />
        </div>
    )
}