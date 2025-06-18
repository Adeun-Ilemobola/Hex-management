import MakeUpdate from "@/components/MakeUpdate";

export default async function Page({
    searchParams

}: {
    searchParams: Promise<{ [key: string]: string | undefined }>

}) {

      const { id  } = await searchParams

    return (
        <div className='relative flex flex-col  min-h-screen  overflow-hidden '>
            <MakeUpdate id={id} />
        </div>
    )
}