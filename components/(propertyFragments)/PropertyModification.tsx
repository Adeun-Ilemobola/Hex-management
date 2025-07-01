"use client"
import React, { useState } from 'react'
import DropBack from '../DropBack'
import { authClient } from '@/lib/auth-client'
import { api } from '@/lib/trpc'
import { Nav } from '../Nav'
import { Button } from '../ui/button'
import { defaultExternalInvestorInput, defaultInvestmentBlockInput, defaultPropertyInput, ExternalInvestorInput, InvestmentBlockInput, investmentBlockSchema, PropertyInput, propertySchema } from '@/lib/Zod'
import { toast } from 'sonner'
import { FileUploadResult } from '@/lib/utils'
import { DeleteImages, UploadImageList } from '@/lib/supabase'
import PropertyGIF from './PropertyGIF'
import { ImgBoxList } from '../ImgBox'
import PropertyIF from './propertyIF'

export default function PropertyModification({ id }: { id: string }) {
    const Session = authClient.useSession()
    const getProperty = api.Propertie.getPropertie.useQuery({ pID: id })
    const postProperty = api.Propertie.postPropertie.useMutation()

    const [section, Setsection] = useState(1)
    const [stopProses, setStopProses] = useState(false)
    const [propertyInfo, setPropertyInfo] = useState<PropertyInput>(defaultPropertyInput)
    const [investmentBlock, setInvestmentBlock] = useState<InvestmentBlockInput>(defaultInvestmentBlockInput)
    const [externalInvestor, setExternalInvestor] = useState<ExternalInvestorInput>(defaultExternalInvestorInput)



    function validation() {

        const vInvestmentBlock = investmentBlockSchema.safeParse(investmentBlock)
        const validatedProperty = propertySchema.safeParse({
            ...propertyInfo,
            ownerName: Session.data?.user?.name,
            contactInfo: Session.data?.user?.email,
            ...(section === 3 && {
                investmentBlock: vInvestmentBlock.data
            })

        });

        //
        if (!validatedProperty.success) {
            validatedProperty.error.errors.forEach(err => {
                toast.error(`Error in ${err.path.join(".")}: ${err.message}`);
            }
            );
            return null

        }

        if (section === 3 && !vInvestmentBlock.success) {
            vInvestmentBlock.error.errors.forEach(err => {
                toast.error(`Error in ${err.path.join(".")}: ${err.message}`);
            }
            );
            return null

        }

        return validatedProperty.data

    }




    async function handleSubmit() {
        if (Session.data?.user?.id === undefined) {
            toast.error("User session not found. Please log in.");
            return;
        }
        let uploadedImages: FileUploadResult[] = [];
        try {



            const data = validation()
            if (!data) {
                return
            }

            // Prevent duplications uploads
            const imagesToUpload = propertyInfo.images.filter(img => !img.supabaseID || img.supabaseID === "");
            uploadedImages = await UploadImageList(imagesToUpload, Session.data?.user?.id)
            const uploadedImageToCL = propertyInfo.images.filter(img => img.supabaseID && img.supabaseID !== "")

            console.log("Uploading property:", data);
            const post = await postProperty.mutateAsync({
                property: {
                    ...data,
                    images: [...uploadedImages, ...uploadedImageToCL]
                },

            });

            console.log("Post response:", post);
            if (post.success) {
                setPropertyInfo(defaultPropertyInput);
                if (getProperty.data) {
                    toast.success("Property updated successfully!");
                }
            } else {
                toast.error("Failed to update property.");
                await DeleteImages(uploadedImages.map(img => img.supabaseID));
            }
        } catch (error) {
            if (uploadedImages.length > 0) {
                await DeleteImages(uploadedImages.map(img => img.supabaseID));
            }
            if (error instanceof Error) {

                console.log("Error in handleSubmit:", error);
                toast.error(error.message);
            } else {
                console.log("Unexpected error:", error);
                toast.error("An unexpected error occurred.");
            }
        }
    }








    return (
        <DropBack is={Session.isPending || getProperty.isPending || postProperty.isPending} >
            <Nav SignOut={authClient.signOut} session={Session.data} />
            <div className=' flex flex-col flex-1'>

                <div className=' flex w-full flex-1 '>

                    {section === 1 && (
                        <div className=' flex flex-1 flex-col gap-3'>
                            <div className=' flex-1 flex flex-col gap-4 p-1.5 items-center'>
                                <div className=' flex flex-col gap-0.5 p-1'>
                                    <PropertyGIF disable={postProperty.isPending} setPropertyInfo={setPropertyInfo} propertyInfo={propertyInfo} />
                                </div>

                                <ImgBoxList
                                    className=' w-[67rem]!'
                                    fileList={propertyInfo.images}
                                    disabled={false}
                                    setData={list => setPropertyInfo(prev => ({ ...prev, images: [...prev.images, ...list] }))}
                                    SetMainImg={idx => {
                                        setPropertyInfo(pre => ({
                                            ...pre,
                                            images: [
                                                ...pre.images.map((item, i) => {
                                                    idx === i ? item.thumbnail = true : item.thumbnail = false;
                                                    return item
                                                })
                                            ]
                                        }))

                                    }}
                                    del={(id) => {
                                        setPropertyInfo(pre => ({
                                            ...pre,
                                            images: [
                                                ...pre.images.filter((item, i) => {
                                                    if (i !== id) {
                                                        return item
                                                    }
                                                })
                                            ]
                                        }))

                                    }}


                                />

                            </div>

                        </div>
                    )}


                    {section === 2 && (
                        <div className=' flex flex-1 flex-col gap-6 justify-center items-center'>
                            Investment type individual or pool or other types of things
                        </div>
                    )}


                    {section === 3 && (
                        <div className=' flex flex-1 flex-col gap-3'>
                           
                           <div className=' flex-1 flex flex-col'>
                            <PropertyIF setInvestmentBlock={setInvestmentBlock} disable={false} investmentBlock={investmentBlock}/>

                           </div>

                        </div>
                    )}



                </div>

                <div className=' h-20 px-3.5 py-4 flex flex-row justify-center border-t border-t-amber-400/30'>
                    <Button
                        className=' mr-auto text-2xl font-bold'
                        disabled={section === 1}
                        size={"lg"}
                        onClick={() => {
                            if (section !== 1) {
                                Setsection(pre => --pre)
                            }
                        }}
                    >Back</Button>


                    <Button
                        className=' ml-auto text-2xl font-bold'

                        size={"lg"}
                        onClick={() => {
                            if (section !== 3) {
                                if (section === 1) {
                                    const data = validation()
                                    if (!data) { return; }
                                }

                                Setsection(pre => ++pre)
                            } else {
                                handleSubmit()

                            }
                        }}
                    >
                        {section === 3 ? "submit" : "Next"}


                    </Button>

                </div>



            </div>

        </DropBack>
    )
}
