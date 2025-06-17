


export default async function Page({
    params,

}: {
    params: Promise<{ id: string }>

}) {

    const { id } = await params;
    //get the propertie id from params
    return (
        <div className="relative flex flex-col  min-h-screen  overflow-hidden">
            <h1 className="text-2xl font-bold text-center mt-10">Propertie ID: {id}</h1>
            {/* You can add more components or content here related to the propertie */}
            <p className="text-center mt-4">This is the page for propertie with ID: {id}</p>


        </div>
    )
}