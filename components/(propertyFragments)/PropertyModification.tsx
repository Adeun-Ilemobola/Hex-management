"use client"
import React, { useState } from 'react'
import DropBack from '../DropBack'
import { authClient } from '@/lib/auth-client'
import { Nav } from '../Nav'
import { Button } from '../ui/button'
import {  investmentBlockSchema, propertySchema,  } from '@/lib/Zod'
import { toast } from 'sonner'
import { FileUploadResult } from '@/lib/utils'
import { DeleteImages, UploadImageList } from '@/lib/supabase'
import PropertyGIF from './PropertyGIF'
import { ImgBoxList } from '../ImgBox'
import { TextAreaBox } from '../InputBox'
import InvestmentSummary from './InvestmentSummary'
import InvestmentBlockSection from './InvestmentBlockSection'
import PoolInvestorsSection from './PoolInvestorsSection'
import { useSearchParams } from 'next/navigation'
import { usePropertyModification } from './usePropertyModification'

export default function PropertyModification() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") ?? "";
    const { 
        propertyInfo, 
        investmentBlock, 
        externalInvestor, 
        setPropertyInfo, 
        setInvestmentBlock, 
        setExternalInvestor  , 
        Session , 
        financials, 
        RemoveImage , 
        CreateProperty , 
        UpdateProperty ,
        disableInput , 
        isLoading
    } = usePropertyModification(id)

    const [section, Setsection] = useState(1)


    function validation() {
        const vInvestmentBlock = investmentBlockSchema.safeParse(investmentBlock)
        const validatedProperty = propertySchema.safeParse({
            ...propertyInfo,
            ...(section === 3 && {
                investmentBlock: vInvestmentBlock.data
            })
        });
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
            const uploadedImagesDB = data.images.filter(img => img.id && img.id !== "")
            const imagesToUpload = propertyInfo.images.filter(img => !img.supabaseID || img.supabaseID === "");
            uploadedImages = await UploadImageList(imagesToUpload, Session.data?.user?.id)
            // const uploadedImageToCL = propertyInfo.images.filter(img => img.supabaseID && img.supabaseID !== "")
            if (id.length <= 0) {
                CreateProperty({
                    property: {
                        ...data,
                        images: [...uploadedImages]
                    },
                    investmentBlock: {
                        ...investmentBlock,
                        externalInvestors: [...externalInvestor.filter(inv => inv.id.length === 0 && inv.investmentBlockId.length === 0)]
                    }

                });

            } else {
                UpdateProperty({
                    property: {
                        ...data,
                        images: [...uploadedImages, ...uploadedImagesDB],

                    },
                    investmentBlock: {
                        ...investmentBlock,
                        externalInvestors: [...externalInvestor.filter(inv => inv.id.length === 0 && inv.investmentBlockId.length === 0)]
                    }

                });
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
        <DropBack is={isLoading} >
            <Nav SignOut={authClient.signOut} session={Session.data} />
            <div className=' flex flex-col flex-1'>

                <div className=' flex w-full flex-1 overflow-auto '>
                    {section === 1 && (
                        <div className="flex flex-1 w-full items-center justify-center ">
                            <div className="flex-1 flex flex-col lg:flex-row gap-3 p-2 items-center justify-center">

                                {/* Property GIF Section */}
                                <div className="w-full lg:w-[32%] min-w-[320px]">
                                    <PropertyGIF
                                        disable={disableInput}
                                        setPropertyInfo={setPropertyInfo}
                                        propertyInfo={propertyInfo}
                                    />
                                </div>

                                {/* Right Panel: Images + Description */}
                                <div className=" min-w-max flex flex-col gap-3">
                                    {/* Image Uploader */}
                                    <ImgBoxList
                                        className="w-full"
                                        fileList={propertyInfo.images}
                                        disabled={disableInput}
                                        setData={(list) =>
                                            setPropertyInfo((prev) => ({
                                                ...prev,
                                                images: [...prev.images, ...list],
                                            }))
                                        }
                                        SetMainImg={(idx) => {
                                            setPropertyInfo((pre) => ({
                                                ...pre,
                                                images: pre.images.map((item, i) => ({
                                                    ...item,
                                                    thumbnail: idx === i,
                                                })),
                                            }));
                                        }}
                                        del={(id, index, supabaseID) => {
                                            setPropertyInfo((pre) => ({
                                                ...pre,
                                                images: pre.images.filter((_, i) => i !== index),
                                            }));
                                            if (id.length > 0 && supabaseID.length > 0) {
                                                RemoveImage({ id: id, supabaseID: supabaseID });
                                            }
                                        }}
                                    />

                                    {/* Description Box */}
                                    <TextAreaBox
                                        value={propertyInfo.description}
                                        onChange={(val) =>
                                            setPropertyInfo((pre) => ({ ...pre, description: val }))
                                        }
                                        label="Description"
                                        disabled={false}
                                        className=" w-full max-w-4xl h-[20rem] resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                    )}


                    {section === 2 && (
                        <div className='flex flex-1 flex-col gap-4 p-2 justify-center items-center'>
                            <InvestmentBlockSection setInvestmentBlock={setInvestmentBlock} disable={false} investmentBlock={investmentBlock} />
                            <PoolInvestorsSection mebers={externalInvestor} setMebers={setExternalInvestor} />
                        </div>
                    )}


                    {section === 3 && (
                        <div className=' flex flex-1 justify-center items-center flex-col gap-3'>
                            <InvestmentSummary
                                investmentBlock={investmentBlock}
                                financials={{
                                    netPayment: financials.netPayment,
                                    discountAmount: financials.discountAmount,
                                    marginAmount: financials.marginAmount,
                                    base: financials.base,
                                    duration: financials.duration,
                                    result: financials.result

                                }}
                            />



                        </div>
                    )}



                </div>

                <div className=' h-20 px-3.5 py-4 flex flex-row justify-center border-t border-t-amber-400/30'>
                    <Button
                        className=' mr-auto text-3xl font-bold '
                        disabled={section === 1}
                        size={"lg"}
                        onClick={() => {
                            if (section !== 1) {
                                Setsection(pre => --pre)
                            }
                        }}
                        variant={"ghost"}
                    >Back</Button>


                    <Button
                        className=' ml-auto text-3xl font-bold'
                        variant={"ghost"}
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
