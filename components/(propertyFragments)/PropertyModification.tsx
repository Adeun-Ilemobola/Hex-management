"use client"
import React, {  useCallback, useEffect, useMemo, useState } from 'react'
import DropBack from '../DropBack'
import { authClient } from '@/lib/auth-client'
import { api } from '@/lib/trpc'
import { Nav } from '../Nav'
import { Button } from '../ui/button'
import {  defaultInvestmentBlockInput, defaultPropertyInput, ExternalInvestorInput, InvestmentBlockInput, investmentBlockSchema, PropertyInput, propertySchema } from '@/lib/Zod'
import { toast } from 'sonner'
import { FileUploadResult } from '@/lib/utils'
import { DeleteImages, UploadImageList } from '@/lib/supabase'
import PropertyGIF from './PropertyGIF'
import { ImgBoxList } from '../ImgBox'
import { TextAreaBox } from '../InputBox'
import InvestmentSummary from './InvestmentSummary'
import InvestmentBlockSection from './InvestmentBlockSection'
import PoolInvestorsSection from './PoolInvestorsSection'
// const fakeInvestors: ExternalInvestorInput[] = [
//     {
//         name: "Sarah Johnson",
//         email: "sarah.johnson@venture.com",
//         contributionPercentage: 25.5,
//         returnPercentage: 15.2,
//         isInternal: false,
//         accessRevoked: false,
//         dollarValueReturn: 127500,
//         investmentBlockId: "inv-001",
//         id: "inv-001",
//     },
//     {
//         name: "Michael Chen",
//         email: "m.chen@investment.group",
//         contributionPercentage: 18.3,
//         returnPercentage: 12.8,
//         isInternal: false,
//         accessRevoked: false,
//         dollarValueReturn: 89200,
//         investmentBlockId: "inv-002",
//         id: "inv-002",
//     },
//     {
//         name: "Emma Rodriguez",
//         email: "emma@capitalfunds.net",
//         contributionPercentage: 22.0,
//         returnPercentage: 14.1,
//         isInternal: true,
//         accessRevoked: false,
//         dollarValueReturn: 108400,
//         investmentBlockId: "inv-003",
//         id: "inv-003",
//     },
//     {
//         name: "David Park",
//         email: "david.park@wealthmgmt.com",
//         contributionPercentage: 15.7,
//         returnPercentage: 11.3,
//         isInternal: false,
//         accessRevoked: false,
//         dollarValueReturn: 76850,
//         investmentBlockId: "inv-004",
//         id: "inv-004",
//     },
//     {
//         name: "Lisa Thompson",
//         email: "lisa.t@privatequity.org",
//         contributionPercentage: 12.2,
//         returnPercentage: 9.8,
//         isInternal: false,
//         accessRevoked: false,
//         dollarValueReturn: 58960,
//         investmentBlockId: "inv-005",
//         id: "inv-005",
//     }
// ];
export default function PropertyModification({ id }: { id: string }) {
    const Session = authClient.useSession()
    const getProperty = api.Propertie.getPropertie.useQuery({ pID: id })


    const [section, Setsection] = useState(1)
    // const [stopProses, setStopProses] = useState(false)
    const [propertyInfo, setPropertyInfo] = useState<PropertyInput>(defaultPropertyInput)
    const [investmentBlock, setInvestmentBlock] = useState<InvestmentBlockInput>(defaultInvestmentBlockInput)
    const [externalInvestor, setExternalInvestor] = useState<ExternalInvestorInput[]>([])

    const postProperty = api.Propertie.postPropertie.useMutation({
        onSuccess(data, variables) {

            if (data && data.success) {
                toast.success(data.message, { id: "create" });
                setPropertyInfo(defaultPropertyInput)
                setInvestmentBlock(defaultInvestmentBlockInput)
                setExternalInvestor([])


            } else {
                toast.error(data.message, { id: "create" });
                if (variables && variables.property && variables.property.images && variables.property.images.length > 0) {
                    const imagesToDelete = variables.property.images.map(img => img.supabaseID as string)
                        .filter(imgID => imgID !== "" && imgID !== undefined);
                    DeleteImages(imagesToDelete)

                }
            }

        },
        onMutate() {
            toast.loading("Creating property...", { id: "create" });
        },
    })

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
        const base = typeOfSale === 'SELL' ? initialInvestment : typeOfSale === 'RENT' ? initialInvestment / 12 : leaseCycle > 0 ? initialInvestment / leaseCycle : 0;
        const marginAmount = base * (margin / 100);
        const discountAmount = (base + marginAmount) * (discountPercentage / 100);
        const netPayment = base + marginAmount - discountAmount;

        // Calculate total profit/return ---------
        const totalRevenue = typeOfSale === 'SELL' ? result : result * duration;
        const totalProfit = totalRevenue - initialInvestment;
        return {
            totalRevenue,
            totalProfit,
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
    const investorCalculations = useMemo(() => {
        const totalInvestorPercentage = externalInvestor.reduce(
            (sum, investor) => sum + (investor.contributionPercentage || 0),
            0
        );

        const updatedInvestors = externalInvestor.map(investor => {
            // Calculate dollar investment amount based on percentage
            const investmentAmount = (investor.contributionPercentage / 100) * investmentBlock.initialInvestment;

            // Calculate dollar profit share based on their percentage of total profit
            const investorProfitShare = (investor.contributionPercentage / 100) * financials.totalProfit;

            // Total dollar return is investment + profit share
            const dollarValueReturn = investmentAmount + investorProfitShare;

            // Calculate return percentage for this investor
            const returnPercentage = investmentAmount > 0
                ? (investorProfitShare / investmentAmount) * 100
                : 0;

            return {
                ...investor,
                returnPercentage: Math.round(returnPercentage * 100) / 100,
                dollarValueReturn: Math.round(dollarValueReturn * 100) / 100,
            };
        });


        return {
            totalInvestorPercentage: Math.round(totalInvestorPercentage * 100) / 100,
            updatedInvestors,
            remainingPercentage: Math.max(0, 100 - totalInvestorPercentage),
            isOverInvested: totalInvestorPercentage > 100,
            remainingDollarAmount: Math.round(((100 - totalInvestorPercentage) / 100) * investmentBlock.initialInvestment * 100) / 100,
        };
    }, [externalInvestor, financials.totalProfit, investmentBlock.initialInvestment]);


    const updataFinancials = useCallback(() => {
        const { result, duration, } = financials;
        setInvestmentBlock(prev => ({
            ...prev,
            saleDuration: duration,
            finalResult: result,

        }))
    }, [financials])

    const updateExternalInvestor = useCallback(() => {
        const { updatedInvestors } = investorCalculations;
        setExternalInvestor(updatedInvestors);

    }, [investorCalculations.updatedInvestors])


    useEffect(() => {
        if (Session.data?.user?.name && Session.data?.user?.email) {
            const name = Session.data?.user?.name;
            const email = Session.data?.user?.email;
            setPropertyInfo(prev => ({ ...prev, ownerName: name, contactInfo: email }));
        }
    }, [Session]);


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

            console.log("externalInvestor", externalInvestor);
            console.log("investmentBlock", investmentBlock);
            console.log("propertyInfo", propertyInfo);


            // Prevent duplications uploads
            const imagesToUpload = propertyInfo.images.filter(img => !img.supabaseID || img.supabaseID === "");
            uploadedImages = await UploadImageList(imagesToUpload, Session.data?.user?.id)
            // const uploadedImageToCL = propertyInfo.images.filter(img => img.supabaseID && img.supabaseID !== "")

            console.log("Uploading property:", data);
            await postProperty.mutateAsync({
                property: {
                    ...data,
                    images: [...uploadedImages]
                },
                investmentBlock: {
                    ...investmentBlock,
                    externalInvestors: [...externalInvestor.filter(inv => inv.id.length === 0 && inv.investmentBlockId.length === 0)]
                }

            });

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

                <div className=' flex w-full flex-1 overflow-auto '>
                    {section === 1 && (
                        <div className=' flex flex-1  '>
                            <div className=' flex-1 flex flex-row gap-1 p-0.5 items-center justify-center'>
                                <div className=' flex flex-col gap-0.5 p-1'>
                                    <PropertyGIF disable={postProperty.isPending} setPropertyInfo={setPropertyInfo} propertyInfo={propertyInfo} />
                                </div>

                                <div className=' flex flex-col gap-0.5 p-1 w-[70%]'>
                                    <ImgBoxList
                                        className='w-full'
                                        fileList={propertyInfo.images}
                                        disabled={false}
                                        setData={list => setPropertyInfo(prev => ({ ...prev, images: [...prev.images, ...list] }))}
                                        SetMainImg={idx => {
                                            setPropertyInfo(pre => ({
                                                ...pre,
                                                images: [
                                                    ...pre.images.map((item, i) => {
                                                        item.thumbnail = idx === i;

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
                                        className='w-full h-[20rem]   resize-none'
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
                            updateExternalInvestor()
                                updataFinancials()
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
                                updateExternalInvestor()
                                updataFinancials()
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
