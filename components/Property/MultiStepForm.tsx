"use client"
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { usePropertyModification } from './Hook/usePropertyModification'
import { investmentBlockSchema, OwnerTypeEnum, propertySchema } from '@/lib/ZodObject'
import { toast } from 'sonner'
import { trpc as api } from '@/lib/client'
import { Button } from './ui/button'
import PropertyForm from './Form/PropertyForm'
import z, { set } from 'zod'
import { se } from 'date-fns/locale'
import FinancialMetrics from './Property/FinancialMetrics'
import InvestmentSummary from './Property/InvestmentSummary'
import PoolInvestorsSection from './Property/ExternalInvestor'
import { Spinner } from './ui/spinner'


function MultiStepForm() {
    const searchParams = useSearchParams()
    const Id = searchParams.get('id')
    const {
        propertyInfo,
        setPropertyInfo,
        investmentBlock,
        setInvestmentBlock,
        externalInvestor,
        setExternalInvestor,
        RemoveImage,
        CreateProperty,
        UpdateProperty,
        Session,
        isLoading,
        isSubmitting,
        financials,
        investorCalculations,
        member

    } = usePropertyModification(Id)
     
    const { data: ownerList, ...organizationsQuery } = api.organization.getAllOrganization.useQuery(undefined, {
        
    });
//    const [ownerList, setOwnerList] = useState(() => {
//         const list =orgList?.value
//         if (list) {
//             return [...list]
//         }
//         return []
//     })

    const [section, Setsection] = useState(1)


    function validation() {

        const blockForValidation = {
            ...investmentBlock,
            externalInvestors: externalInvestor,
        };


        const vInvestmentBlock = investmentBlockSchema.safeParse(blockForValidation);

        const validatedProperty = propertySchema.safeParse({
            ...propertyInfo,
            ...(section === 3 && { investmentBlock: blockForValidation }),
        });
        if (!validatedProperty.success) {
            validatedProperty.error.issues.forEach(err => {
                toast.error(`Error in ${err.path.join(".")}: ${err.message}`);
            }
            );
            return null
        }
        if (section === 2 && !vInvestmentBlock.success) {
            vInvestmentBlock.error.issues.forEach(err => {
                toast.error(`Error in ${err.path.join(".")}: ${err.message}`);
            }
            );
            return null
        }
        return validatedProperty.data
    }

    
    async function handleSubmit() {
        const data = validation()
        if (!data) { return; }
        if (Id) {
            UpdateProperty()
        } else {
            CreateProperty()
        }
    }


    return (
        < >

            <div className=' flex flex-col flex-1 '>

                <section className='w-full max-w-5xl mx-auto'>
                    {section === 1 && <>
                        <PropertyForm
                            propertyInfo={propertyInfo}
                            setPropertyInfo={setPropertyInfo}
                            disable={isSubmitting}
                            handleSSubscriptionRequirement={() => 0}
                            RemoveImage={(id, supabaseID) => {
                                // RemoveImage(id, supabaseID)
                            }}
                            orgInfo={{
                                data: ownerList?.value || [],
                                loading: organizationsQuery.isLoading,
                                userId: Session.data?.user?.id || "",
                                refetch: () => {
                                    organizationsQuery.refetch()
                                },
                                showOwnershipConfig: true,
                                disabled: false,
                                handleSelectOrg: (id, type) => {
                                    setPropertyInfo(prev => ({
                                        ...prev,
                                        ownerId: id,
                                        ownerType: type
                                    }))
                                },
                                SelectedID: propertyInfo.ownerId
                            }}

                        />
                    </>}
                    {section === 2 && <div className=' flex flex-col gap-4 p-3 '>
                        <FinancialMetrics
                            investmentBlock={investmentBlock}
                            setInvestmentBlock={setInvestmentBlock}
                            disable={isSubmitting}
                            allowed={externalInvestor.some(inv => inv.status !== "DRAFT")}
                        />
                        <PoolInvestorsSection
                            members={externalInvestor}
                            setMembers={setExternalInvestor}
                            reLoad={organizationsQuery.refetch}
                            removeInvestor={(email, name) => {
                                setExternalInvestor(prev => prev.filter(inv => inv.email !== email))
                                
                            }}
                            Locked={() => externalInvestor.some(inv => inv.status !== "DRAFT")}
                        />
                    </div>}
                    {section === 3 && <InvestmentSummary
                        investmentBlock={investmentBlock}
                        financials={financials}
                        investorCalculations={investorCalculations}
                    />}

                    <div className=' fixed bottom-0 left-0 right-0 h-20 px-3.5 py-4 flex flex-row justify-center '>
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
                                    const data = validation()
                                    if (!data) { return; }
                                    Setsection(pre => ++pre)
                                } else {
                                    handleSubmit()
                                }
                            }}
                        >
                            {section === 3 ? ( isSubmitting ? (<> <Spinner /> {"Submitting" }</>): "Submit") : "Next"}
                        </Button>
                    </div>
                </section>

            </div>

        </>
    )
}

export default MultiStepForm