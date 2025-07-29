import PropertyModification from "@/components/(propertyFragments)/PropertyModification";

export default async function Page({
    searchParams

}: {
    searchParams: Promise<{ [key: string]: string | undefined }>

}) {

      const { id  } = await searchParams

    return (
        <div className='relative flex flex-col  min-h-screen  overflow-hidden '>
            <PropertyModification id={id || ""} />
        </div>
    )
}