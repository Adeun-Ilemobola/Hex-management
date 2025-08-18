"use client"
import React, { Suspense } from 'react'
import DropBack from '../DropBack'
import { authClient } from '@/lib/auth-client'
import { Nav } from '../Nav'
import { Button } from '../ui/button'
import { investmentBlockSchema, ownerTypeT, propertySchema, } from '@/lib/Zod'
import { toast } from 'sonner'
import { FileUploadResult } from '@/lib/utils'
import { DeleteImages, UploadImageList } from '@/lib/supabase'
import PropertyDetails from './PropertyDetails'

import InvestmentSummary from './InvestmentSummary'
import InvestmentBlockSection from './InvestmentBlockSection'
import PoolInvestorsSection from './PoolInvestorsSection'
import { useSearchParams } from 'next/navigation'
import { usePropertyModification } from './usePropertyModification'
import Loading from '../Loading'
import PayWall from '../PayWall'
import { api } from '@/lib/trpc'

export default function PropertyModification() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") ?? "";
    const {
        propertyInfo,
        investmentBlock,
        externalInvestor,
        setPropertyInfo,
        setInvestmentBlock,
        setExternalInvestor,
        Session,
        financials,
        RemoveImage,
        CreateProperty,
        UpdateProperty,
        disableInput,
        isLoading,
        sub,
        reFresh
    } = usePropertyModification(id)
    const { data: orgList, ...organizationsQuery } = api.organization.getAllOrganization.useQuery();

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

        let uploadedImages: FileUploadResult[] = [];
        try {
              const data = validation()
            if (!data) {
                return
            }
            if (Session.data?.user?.id === undefined) {
                toast.error("User session not found. Please log in.");
                return;
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
                        images: [...uploadedImages],

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
    function handleSSubscriptionRequirement() {
        const tier = sub.planTier
        if (tier === 'Free') {
            return 5
        } else if (tier === 'Deluxe') {
            return 35
        } else if (tier === 'Premium') {
            return 100
        }
        return 5;
    }

    function orgListClean() {
        const cleaned = orgList?.value.map(org => ({
            id: org.id,
            name: org.name,
            selected: propertyInfo.ownerId === org.id,
            type: "ORGANIZATION" as ownerTypeT
        })) || [];
        if (Session.data?.user) {
            cleaned.push({
                id: Session.data.user.id,
                name: Session.data.user.name,
                selected: propertyInfo.ownerId === Session.data.user.id,
                type: "USER" as ownerTypeT
            });
        }
        return cleaned;
    }


    const isSubscribed = sub.isActive && sub.planTier !== "free" || sub.planTier !== "Free"
    return (
        <DropBack is={isLoading} >
            <Nav SignOut={authClient.signOut} session={Session.data} />
            <div className=' flex flex-col flex-1'>

                <div className=' flex w-full flex-1 overflow-auto '>
                    {section === 1 && (
                        <div className=" mx-auto px-4 py-6">
                            <div className="flex flex-col lg:flex-row gap-6">

                                <PropertyDetails
                                    disable={disableInput}
                                    setPropertyInfo={setPropertyInfo}
                                    propertyInfo={propertyInfo}
                                    RemoveImage={(id, supabaseID) => {
                                        RemoveImage({ id, supabaseID });

                                    }}
                                    handleSSubscriptionRequirement={handleSSubscriptionRequirement}
                                    orgInfo={
                                        {
                                            data: orgListClean(),
                                            loading: organizationsQuery.isLoading,
                                            userId: Session.data?.user.id || "",
                                            refetch: organizationsQuery.refetch,
                                            showOwnershipConfig: (sub.inOrganization && sub.inOrganization.role === "owner") || false,
                                            disabled: (sub.inOrganization && sub.inOrganization.role !== "owner") || false

                                        }
                                    }
                                />

                            </div>
                        </div>
                    )}

                    {section === 2 && (
                        <div className='flex flex-1 flex-col gap-4 p-2 justify-center items-center'>
                            <InvestmentBlockSection setInvestmentBlock={setInvestmentBlock} disable={false} investmentBlock={investmentBlock} />

                            {Session.data?.user && (
                                <PayWall allowed={isSubscribed}>
                                    <PoolInvestorsSection mebers={externalInvestor} setMebers={setExternalInvestor} reLoad={reFresh} />
                                </PayWall>
                            )}


                        </div>
                    )}


                    {section === 3 && (
                        <Suspense fallback={<Loading />}>
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
                        </Suspense>
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
