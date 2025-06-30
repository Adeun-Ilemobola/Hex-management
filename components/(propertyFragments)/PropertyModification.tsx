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

export default function PropertyModification({ id }: { id: string }) {
    const Session = authClient.useSession()
    const getProperty = api.Propertie.getPropertie.useQuery({ pID: id })
    const postProperty = api.Propertie.postPropertie.useMutation()
    
    const [section, Setsection] = useState(1)
    const [propertyInfo, setPropertyInfo] = useState<PropertyInput>(defaultPropertyInput)
    const [investmentBlock, setInvestmentBlock] = useState<InvestmentBlockInput>(defaultInvestmentBlockInput)
    const [externalInvestor, setExternalInvestor] = useState<ExternalInvestorInput>(defaultExternalInvestorInput)




    async function handleSubmit() {
        if (Session.data?.user?.id === undefined) {
            toast.error("User session not found. Please log in.");
            return;
        }
        let uploadedImages: FileUploadResult[] = [];
        try {
             const vInvestmentBlock = await investmentBlockSchema.safeParseAsync(investmentBlock)
            const validatedProperty = await propertySchema.safeParseAsync({
                ...propertyInfo,
                ownerName: Session.data?.user?.name,
                contactInfo: Session.data?.user?.email,
                investmentBlock:vInvestmentBlock.data
                
            });
           
            //
            if (!validatedProperty.success) {
                validatedProperty.error.errors.forEach(err => {
                    toast.error(`Error in ${err.path.join(".")}: ${err.message}`);
                }
                );
                return;
            }

            if (!vInvestmentBlock.success) {
                vInvestmentBlock.error.errors.forEach(err => {
                    toast.error(`Error in ${err.path.join(".")}: ${err.message}`);
                }
                );
                return;
            }
            // Prevent duplications uploads
            const imagesToUpload = propertyInfo.images.filter(img => !img.supabaseID || img.supabaseID === "");
            uploadedImages = await UploadImageList(imagesToUpload, Session.data?.user?.id)
            const uploadedImageToCL = propertyInfo.images.filter(img => img.supabaseID && img.supabaseID !== "")

            console.log("Uploading property:", validatedProperty.data);
            const post = await postProperty.mutateAsync({
               property: {
                ...validatedProperty.data,
                images:[...uploadedImages , ...uploadedImageToCL]
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





    function ViewSwitcher() {

        if (section === 1) {
            return (
                <div className=' bg-pink-500 flex-1'>
                    General information of the property

                </div>
            )

        } else if (section === 2) {
            return (
                <div>
                    Investment type individual or pool or other types of things

                </div>
            )

        } else if (section === 3) {

            return (
                <div>
                    Summary of the investment and creation of it


                </div>
            )

        } else {
            return null
        }

    }


    return (
        <DropBack is={Session.isPending || getProperty.isPending || postProperty.isPending} >
            <Nav SignOut={authClient.signOut} session={Session.data} />
            <div className=' flex flex-col flex-1'>

                <div className=' flex w-full flex-1 bg-amber-500'>

                    <ViewSwitcher />

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
                        disabled={section === 3}
                        size={"lg"}
                        onClick={() => {
                            if (section !== 3) {
                                if (section === 1) {

                                }

                                Setsection(pre => ++pre)
                            }
                        }}
                    >Next</Button>

                </div>



            </div>

        </DropBack>
    )
}
