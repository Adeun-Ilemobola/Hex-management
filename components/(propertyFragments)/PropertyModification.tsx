"use client"
import React, { useMemo, useState } from 'react'
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
import { TextAreaBox } from '../InputBox'
import InvestmentSummary from './InvestmentSummary'
import InvestmentBlockSection from './InvestmentBlockSection'
import PoolInvestorsSection from './PoolInvestorsSection'

export default function PropertyModification({ id }: { id: string }) {
    const Session = authClient.useSession()
    const getProperty = api.Propertie.getPropertie.useQuery({ pID: id })
    const postProperty = api.Propertie.postPropertie.useMutation()

    const [section, Setsection] = useState(1)
    const [stopProses, setStopProses] = useState(false)
    const [propertyInfo, setPropertyInfo] = useState<PropertyInput>(defaultPropertyInput)
    const [investmentBlock, setInvestmentBlock] = useState<InvestmentBlockInput>(defaultInvestmentBlockInput)
    const [externalInvestor, setExternalInvestor] = useState<ExternalInvestorInput>(defaultExternalInvestorInput)

    const financials = useMemo(() => {
        const { typeOfSale, initialInvestment, margin, discountPercentage, leaseCycle, } = investmentBlock;
        let result = 0;
        let duration = 0;
        let markedUpPrice = 0;

        if (typeOfSale === "SELL") {
            // 1) compute markup
            markedUpPrice = initialInvestment * (1 + margin / 100);
            // 2) apply discount to the marked-up price
            result = markedUpPrice * (1 - discountPercentage / 100);
            // one‐time sale → 1 payment
            duration = 12;
        }
        else if (typeOfSale === 'RENT') {
            const base = initialInvestment / 12;               // monthly cost before markup
            const pay = base * (1 + margin / 100);            // after markup
            result = pay * (1 - discountPercentage / 100);
            duration = Math.ceil(initialInvestment / result);
        }
        else if (typeOfSale === 'LEASE') {
            const base = initialInvestment / leaseCycle;       // per‐cycle cost
            const pay = base * (1 + margin / 100);
            result = pay * (1 - discountPercentage / 100);
            duration = leaseCycle
        }
        else {
            throw new Error(`Unknown typeOfSale "${typeOfSale}"`);
        }

        // Round to cents
        result = Math.round(result * 100) / 100;

        // Now compute the other summary values
        const base =  typeOfSale === 'SELL' ? initialInvestment : typeOfSale === 'RENT' ? initialInvestment / 12 : leaseCycle > 0 ? initialInvestment / leaseCycle : 0;
        const marginAmount = base * (margin / 100);
        const discountAmount = (base + marginAmount) * (discountPercentage / 100);
        const netPayment = base + marginAmount - discountAmount;

        return {
            result,
            duration,
            base,
            marginAmount,
            discountAmount,
            netPayment,
        };
    }, [
        investmentBlock.typeOfSale,
        investmentBlock.initialInvestment,
        investmentBlock.margin,
        investmentBlock.discountPercentage,
        investmentBlock.leaseCycle,
    ]);




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

                                <TextAreaBox
                                    value={propertyInfo.description}
                                    onChange={val => setPropertyInfo(pre => ({ ...pre, description: val }))}
                                    label="Description"
                                    disabled={false}
                                    className='w-full  flex-1 resize-none'
                                />

                            </div>

                        </div>
                    )}


                    {section === 2 && (
                        <div className='flex flex-1 flex-col gap-4 p-2 justify-center items-center'>
                            <InvestmentBlockSection setInvestmentBlock={setInvestmentBlock} disable={false} investmentBlock={investmentBlock} />
                            <PoolInvestorsSection />
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
