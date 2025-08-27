"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/trpc";
import { authClient } from "@/lib/auth-client";
import {
    defaultInvestmentBlockInput,
    defaultPropertyInput,
    InvestmentBlockInput,
    InvestmentTypeEnumType,
    PropertyInput,
    PropertyTypeEnumType,
    SaleTypeEnumType,
    StatusEnumType,

    ExternalInvestorInput,
    ownerTypeT,
} from "@/lib/Zod";
import { DeleteImages, } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export function usePropertyModification(id: string) {
    const Router = useRouter();
    const [propertyInfo, setPropertyInfo] = useState<PropertyInput>(defaultPropertyInput)
    const [investmentBlock, setInvestmentBlock] = useState<InvestmentBlockInput>(defaultInvestmentBlockInput)
    const [externalInvestor, setExternalInvestor] = useState<ExternalInvestorInput[]>([])
    const getProperty = api.Propertie.getPropertie.useQuery({ pID: id },{
    })
    const Session = authClient.useSession();
    const { data: memberData , isPending: memberLoading } = api.organization.getActiveMember.useQuery();
    const { data: subscription, isPending: subscriptionLoading } = api.user.getUserPlan.useQuery();



    const postProperty = api.Propertie.postPropertie.useMutation({
        onSuccess(data, variables) {

            if (data && data.success) {
                toast.success(data.message, { id: "create" });
                setPropertyInfo(defaultPropertyInput)
                setInvestmentBlock(defaultInvestmentBlockInput)
                setExternalInvestor([])
                Router.push("/home")


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
        onError(error) {
            toast.error(error.message || "Failed to create property.", { id: "create" });
            console.log(error);
        }
    })
    // const hasInitializedCurrentUserRef = useRef(false);

    const updateProperty = api.Propertie.updataPropertie.useMutation({
        onSuccess(data) {
            if (data && data.success) {
                toast.success(data.message, { id: "updateproperty" });
                Router.push("/home")

            } else {
                toast.error(data.message, { id: "updateproperty" });
            }
        },
        onMutate() {
            toast.loading("Updating property...", { id: "updateproperty" });
        },
        onError(error) {
            toast.error(error.message || "Failed to update property.", { id: "updateproperty" });
            console.log(error);
        }
    })
    const delImage = api.Propertie.deleteImage.useMutation({
        onSuccess(data) {
            if (data && data.success) {
                toast.success(data.message, { id: "delete image" });
            } else {
                toast.error(data.message, { id: "delete image" });
            }
        },
        onMutate() {
            toast.loading("Deleting image...", { id: "delete image" });
        },

    })

    const removeInvestor = useCallback((email: string, name: string) => {
        setExternalInvestor(prev => prev.filter(m => !(m.email === email && m.name === name)));
    }, []);



    const financials = useMemo(() => {
        const { typeOfSale, initialInvestment, margin, discountPercentage, leaseCycle, depreciationYears } = investmentBlock;
        let result = 0;
        let duration = 0;
        let markedUpPrice = 0;

        if (typeOfSale === "SELL") {
            // 1) compute markup
            markedUpPrice = initialInvestment * (1.5 + margin / 100);
            // 2) apply discount to the marked-up price
            result = markedUpPrice * (1 - discountPercentage / 100);
            // one‐time sale → 1 payment
            duration = 12;
        }
        else if (typeOfSale === 'RENT') {

            const base = initialInvestment / (depreciationYears * 12);
            const pay = base * (1 + margin / 100);
            result = pay * (1 - discountPercentage / 100);
            duration = Math.ceil(initialInvestment / result);

        }
        else if (typeOfSale === 'LEASE') {

            const base = initialInvestment / (depreciationYears * leaseCycle);       // per‐cycle cost
            const pay = base * (1 + margin / 100);
            result = pay * (1 - discountPercentage / 100);
            duration = Math.ceil(initialInvestment / result);
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
        investmentBlock.depreciationYears
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
    }, [financials.totalProfit, investmentBlock.initialInvestment]);

    useEffect(() => {
        if (financials.result !== investmentBlock.finalResult) {
            setInvestmentBlock({
                ...investmentBlock,
                finalResult: financials.result,
            });
        }

        if (externalInvestor.length === 0) return;

        const isSame = JSON.stringify(investorCalculations.updatedInvestors) === JSON.stringify(externalInvestor);
        if (!isSame) {
            setExternalInvestor(investorCalculations.updatedInvestors);
        }

    }, [financials, investorCalculations.updatedInvestors]);


    // useEffect(() => {
    //     if (getProperty.data?.success && getProperty.data?.value) {
    //         const { externalInvestors, property, investmentBlock, images } = getProperty.data.value;


    //         setPropertyInfo({
    //             ...property,
    //             images,
    //             status: property.status as StatusEnumType,
    //             propertyType: property.propertyType as PropertyTypeEnumType,
    //             description: property.description || "",
    //             ownerId: property.ownerId || "",
    //             ownerType: property.ownerType as ownerTypeT
    //         });

    //         if (investmentBlock) {
    //             const externalInvestorsCleaned = externalInvestors.map(inv => ({
    //                 ...inv,
    //                 contributionPercentage: Number(inv.contributionPercentage) || 0,
    //                 returnPercentage: Number(inv.returnPercentage) || 0,
    //                 dollarValueReturn: Number(inv.dollarValueReturn) || 0,
    //                 updatedAt: inv.updatedAt ? new Date(inv.updatedAt) : undefined,
    //                 createdAt: inv.createdAt ? new Date(inv.createdAt) : undefined,
    //                 fundedAt: inv.fundedAt ? new Date(inv.fundedAt) : undefined,
    //             }));
    //             setExternalInvestor(externalInvestorsCleaned);
    //             setInvestmentBlock({
    //                 ...investmentBlock,
    //                 typeOfInvestment: investmentBlock.typeOfInvestment as InvestmentTypeEnumType,
    //                 typeOfSale: investmentBlock.typeOfSale as SaleTypeEnumType,
    //                 externalInvestors: externalInvestorsCleaned,
    //                 propertyId: property.id,
    //                 saleDuration: investmentBlock.saleDuration,
    //                 leaseCycle: investmentBlock.leaseCycle,
    //                 depreciationYears: investmentBlock.depreciationYears

    //             });
    //         }
    //     }

    //     const user = Session?.data?.user;
    //     const userPlan = plan?.value;
    //     if (user?.name && user?.email && id.length === 0) {
    //         setPropertyInfo(prev => ({
    //             ...prev,
    //             ownerName: user.name,
    //             contactInfo: user.email,
    //         }));
    //     }

    //     if (userPlan && userPlan.inOrganization && userPlan.inOrganization.role !== "owner") {
    //         const oid = userPlan.inOrganization.id
    //         setPropertyInfo(prev => ({
    //             ...prev,
    //             ownerId: oid,
    //             ownerType: "ORGANIZATION"
    //         }));
    //     }



    // }, [ id, getProperty.data,]);


    // useEffect(() => {
    //     const { result, duration } = financials;

    //     setInvestmentBlock(prev => {
    //         if (prev.saleDuration === duration && prev.finalResult === result) return prev;

    //         return {
    //             ...prev,
    //             saleDuration: duration,
    //             finalResult: result,
    //         };
    //     });
    // }, [financials.result, financials.duration]);

    // useEffect(() => {
    //     setExternalInvestor(prev => {
    //         const updated = investorCalculations.updatedInvestors;

    //         // Merge calculated outputs into existing investors, preserve their contributionPercentage
    //         const merged = updated.map(u => {
    //             const existing = prev.find(p => p.email === u.email && p.name === u.name);
    //             if (!existing) return {
    //                 ...u,
    //                 contributionPercentage: u.contributionPercentage ?? 0, // fallback if new
    //             };
    //             return {
    //                 ...existing,
    //                 returnPercentage: u.returnPercentage,
    //                 dollarValueReturn: u.dollarValueReturn,
    //             };
    //         });

    //         // If lengths differ or any key field differs, replace
    //         const isSame =
    //             prev.length === merged.length &&
    //             merged.every(m => {
    //                 const corresponding = prev.find(p => p.email === m.email && p.name === m.name);
    //                 if (!corresponding) return false;
    //                 return (
    //                     corresponding.contributionPercentage === m.contributionPercentage &&
    //                     corresponding.returnPercentage === m.returnPercentage &&
    //                     corresponding.dollarValueReturn === m.dollarValueReturn
    //                 );
    //             });

    //         if (isSame) return prev;
    //         return merged;
    //     });
    // }, [investorCalculations.updatedInvestors]);

    useEffect(() => {
        if (getProperty.data?.success && getProperty.data?.value) {
            const { externalInvestors, property, investmentBlock: ib, images: files } = getProperty.data.value;

            setPropertyInfo({
                ...property,
                images: files.map((img) => ({
                    ...img,
                    lastModified: BigInt(img.lastModified),
                })),
                status: property.status as StatusEnumType,
                propertyType: property.propertyType as PropertyTypeEnumType,
                description: property.description || "",
                ownerId: property.ownerId || "",
                ownerType: property.ownerType as ownerTypeT,
            });

            if (ib) {
                const externalInvestorsCleaned = externalInvestors.map((inv) => ({
                    ...inv,
                    contributionPercentage: Number(inv.contributionPercentage) || 0,
                    // do NOT set computed fields into state
                    returnPercentage: Number(inv.returnPercentage) || 0,   // keep only if this is truly a stored field from DB
                    dollarValueReturn: Number(inv.dollarValueReturn) || 0, // same note as above
                    updatedAt: inv.updatedAt ? new Date(inv.updatedAt) : undefined,
                    createdAt: inv.createdAt ? new Date(inv.createdAt) : undefined,
                    fundedAt: inv.fundedAt ? new Date(inv.fundedAt) : undefined,
                }));

                setExternalInvestor(externalInvestorsCleaned);
                setInvestmentBlock({
                    ...ib,
                    typeOfInvestment: ib.typeOfInvestment as InvestmentTypeEnumType,
                    typeOfSale: ib.typeOfSale as SaleTypeEnumType,
                    externalInvestors: externalInvestorsCleaned, // if your schema needs it here
                    propertyId: property.id,
                    // do NOT write computed saleDuration/finalResult here
                    saleDuration: ib.saleDuration,
                    leaseCycle: ib.leaseCycle,
                    depreciationYears: ib.depreciationYears,
                });
            }
        }

        const user = Session?.data?.user;
        const orgMember = memberData?.value

        if (user?.name && user?.email && id.length === 0) {
            setPropertyInfo((prev) => ({ ...prev, ownerName: user.name, contactInfo: user.email }));
        }

        if (orgMember && orgMember.role !=="owner" ) {
            setPropertyInfo((prev) => ({
                ...prev,
                ownerId: orgMember.organizationId,
                ownerType: "ORGANIZATION",
            }));
        }
    }, [ getProperty.data]);

    

    return {
        propertyInfo,
        setPropertyInfo,
        externalInvestor,
        setExternalInvestor,
        removeInvestor,
        investmentBlock,
        setInvestmentBlock,
        financials,
        investorCalculations,
        Session,
        sub: subscription?.value ,
        isLoading: subscriptionLoading || getProperty.isPending || Session.isPending || postProperty.isPending || updateProperty.isPending || memberLoading, 
        disableInput: postProperty.isPending || updateProperty.isPending,
        CreateProperty: postProperty.mutate,
        UpdateProperty: updateProperty.mutate,
        RemoveImage: delImage.mutate,
        memberData: memberData?.value,
        reFresh: () => {
            getProperty.refetch();
        }

    }

}
