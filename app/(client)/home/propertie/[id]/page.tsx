import PropertyListing from "@/components/(propertyFragments)/PropertyListing";



export default async function Page({ params, }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    //get the propertie id from params
    return (
        <div className="relative flex flex-col  min-h-screen  overflow-hidden">
           

           <PropertyListing id={id} />  


        </div>
    )
}