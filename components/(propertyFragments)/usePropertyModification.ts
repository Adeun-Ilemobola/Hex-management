"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/trpc";
import { authClient } from "@/lib/auth-client";
import {
    defaultInvestmentBlockInput,
    defaultPropertyInput,
    InvestmentBlockInput,
    InvestmentTypeEnum,
    PropertyInput,
    PropertyTypeEnum,
    SaleTypeEnum,
    StatusEnum,

    ExternalInvestorInput,
    OwnerTypeEnum,
} from "@/lib/Zod";
import { useRouter } from "next/navigation";
import z from "zod";


export function usePropertyModification(id: string) {
    const router = useRouter();
    const session = authClient.useSession();
    

    // State
    const [propertyInfo, setPropertyInfo] = useState<PropertyInput>(defaultPropertyInput);
    const [investmentBlock, setInvestmentBlock] = useState<InvestmentBlockInput>(defaultInvestmentBlockInput);
    const [externalInvestor, setExternalInvestor] = useState<ExternalInvestorInput[]>([]);

    // Queries
    const { data: propertyData, isPending: propLoading, refetch } = api.Propertie.getPropertie.useQuery(
        { pID: id }, 
        { enabled: !!id } // Only run if ID exists
    );
    const { data: memberData, isPending: memberLoading } = api.organization.getActiveMember.useQuery();
    const { data: subscription, isPending: subLoading } = api.user.getUserPlan.useQuery();


    



    const financials = useMemo(() => {
        const { typeOfSale, initialInvestment, margin, discountPercentage, leaseCycle, depreciationYears } = investmentBlock;
       let result = 0, duration = 0;
        
        // 1. Calculate Base Logic
        const markupMult = 1 + margin / 100;
        const discountMult = 1 - discountPercentage / 100;

        if (typeOfSale === "SELL") {
            // Sell logic usually has a higher fixed markup (1.1) based on your original code
            result = (initialInvestment * (1.1 + margin / 100)) * discountMult;
            duration = 12;
        } else {
            // Rent or Lease logic
            const divisor = typeOfSale === 'RENT' ? (depreciationYears * 12) : (depreciationYears * leaseCycle);
            const basePay = initialInvestment / (divisor || 1); // prevent divide by zero
            result = (basePay * markupMult) * discountMult;
            duration = result > 0 ? Math.ceil(initialInvestment / result) : 0;
        }

        const base = typeOfSale === 'SELL' ? initialInvestment : 
                     typeOfSale === 'RENT' ? initialInvestment / 12 : 
                     (leaseCycle > 0 ? initialInvestment / leaseCycle : 0);
        
        const marginAmount = base * (margin / 100);
        const discountAmount = (base + marginAmount) * (discountPercentage / 100);
        const totalRevenue = typeOfSale === 'SELL' ? result : result * duration;
        return {
            result: Math.round(result * 100) / 100,
            duration,
            totalRevenue,
            totalProfit: totalRevenue - initialInvestment,
            base,
            marginAmount,
            discountAmount,
            netPayment: base + marginAmount - discountAmount
        };
    }, [investmentBlock]);
    // --- Core Logic: Investors (Derived State) ---
    const investorCalculations = useMemo(() => {
        const totalPct = externalInvestor.reduce((acc, cur) => acc + (cur.contributionPercentage || 0), 0);
        const updatedInvestors = externalInvestor.map(inv => {
            const investmentAmount = (inv.contributionPercentage / 100) * investmentBlock.initialInvestment;
            const profitShare = (inv.contributionPercentage / 100) * financials.totalProfit;
            
            return {
                ...inv,
                returnPercentage: investmentAmount > 0 ? (profitShare / investmentAmount) * 100 : 0,
                dollarValueReturn: investmentAmount + profitShare
            };
        });
        return {
            updatedInvestors,
            totalInvestorPercentage: totalPct,
            remainingPercentage: Math.max(0, 100 - totalPct),
            isOverInvested: totalPct > 100,
        };
    }, [financials.totalProfit, investmentBlock.initialInvestment , externalInvestor]);


    // --- Mutations ---
    const handleMutationSuccess = (msg: string) => {
        toast.success(msg);
        router.push("/home");
    };

    const handleMutationError = (err: any) => {
        toast.error(err.message || "Operation failed");
        console.error(err);
    };

    const postProperty = api.Propertie.postPropertie.useMutation({
        onSuccess: (data) => data?.success ? handleMutationSuccess(data.message) : toast.error(data?.message),
        onError: handleMutationError
    });

    const updateProperty = api.Propertie.updataPropertie.useMutation({
        onSuccess: (data) => data?.success ? handleMutationSuccess(data.message) : toast.error(data?.message),
        onError: handleMutationError
    });

    const delImage = api.Propertie.deleteImage.useMutation({
        onSuccess: (d) => d?.success ? toast.success(d.message) : toast.error(d.message),
        onMutate: () => toast.loading("Deleting image...")
    });
    const getSubmissionData = () => ({
        property: propertyInfo,
        investmentBlock: {
            ...investmentBlock,
            finalResult: financials.result, // Inject computed value here!
            saleDuration: financials.duration,
            externalInvestors: externalInvestor // Send raw investor data
        }
    });
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


    // --- Effects ---
    // 1. Load Data
    useEffect(() => {
        if (propertyData?.success && propertyData.value) {
            const { externalInvestors: Investors, property, investmentBlock } = propertyData.value;
            const formattedInvestors = Investors.map((inv) => ({
                ...inv,
                contributionPercentage: Number(inv.contributionPercentage) || 0,
                returnPercentage: Number(inv.returnPercentage) || 0,   // keep only if this is truly a stored field from DB
                dollarValueReturn: Number(inv.dollarValueReturn) || 0, // same note as above
                
            }));
            setPropertyInfo({...property});
            if (investmentBlock) {
                setInvestmentBlock({...investmentBlock, externalInvestors:formattedInvestors});                
                setExternalInvestor(formattedInvestors);
                
            }
        }
    }, [propertyData]);
    // 2. Set Default Owner (Only runs if creating new property)
    useEffect(() => {
        const user = session?.data?.user;
        const orgMember = memberData?.value;

        if (!id && user?.name && user?.email && !propertyInfo.ownerName) {
            setPropertyInfo(prev => ({ ...prev, ownerName: user.name, contactInfo: user.email }));
        }

        if (orgMember && ["member", "admin"].includes(orgMember.role || "")) {
            setPropertyInfo(prev => ({ ...prev, ownerId: orgMember.organizationId, ownerType: "ORGANIZATION" }));
        }
    }, [memberData, session.data, id]); // Simplified deps


   
    // useEffect(() => {
    //     if (getProperty.data?.success && getProperty.data?.value) {
    //         const { externalInvestors, property, investmentBlock: ib, images: files } = getProperty.data.value;

    //         setPropertyInfo({
    //             ...property,
    //             images: files.map((img) => ({
    //                 ...img,
    //                 lastModified: BigInt(img.lastModified),
    //             })),
    //             status: property.status as StatusEnumType,
    //             propertyType: property.propertyType as PropertyTypeEnumType,
    //             description: property.description || "",
    //             ownerId: property.ownerId || "",
    //             ownerType: property.ownerType as ownerTypeT,
    //         });

    //         if (ib) {
    //             const externalInvestorsCleaned = externalInvestors.map((inv) => ({
    //                 ...inv,
    //                 contributionPercentage: Number(inv.contributionPercentage) || 0,
    //                 // do NOT set computed fields into state
    //                 returnPercentage: Number(inv.returnPercentage) || 0,   // keep only if this is truly a stored field from DB
    //                 dollarValueReturn: Number(inv.dollarValueReturn) || 0, // same note as above
    //                 updatedAt: inv.updatedAt ? new Date(inv.updatedAt) : undefined,
    //                 createdAt: inv.createdAt ? new Date(inv.createdAt) : undefined,
    //                 fundedAt: inv.fundedAt ? new Date(inv.fundedAt) : undefined,
    //             }));

    //             setExternalInvestor(externalInvestorsCleaned);
    //             setInvestmentBlock({
    //                 ...ib,
    //                 typeOfInvestment: ib.typeOfInvestment as InvestmentTypeEnumType,
    //                 typeOfSale: ib.typeOfSale as SaleTypeEnumType,
    //                 externalInvestors: externalInvestorsCleaned, // if your schema needs it here
    //                 propertyId: property.id,
    //                 // do NOT write computed saleDuration/finalResult here
    //                 saleDuration: ib.saleDuration,
    //                 leaseCycle: ib.leaseCycle,
    //                 depreciationYears: ib.depreciationYears,
    //             });
    //         }
    //     }
    // }, [ getProperty.data ]);

    // useEffect(() => {
    //      const user = Session?.data?.user;
    //     const orgMember = memberData?.value

    //     if (user?.name && user?.email && id.length === 0) {
    //         setPropertyInfo((prev) => ({ ...prev, ownerName: user.name, contactInfo: user.email }));
    //     }

       

    //     if (orgMember && (orgMember.role === "member" || orgMember.role === "admin")) {
    //         console.log("Setting organization as owner");
    //         setPropertyInfo((prev) => ({
    //             ...prev,
    //             ownerId: orgMember.organizationId,
    //             ownerType: "ORGANIZATION",
    //         }));
    //     }        
    // }, [memberData , Session.data]);


    

    return {
        propertyInfo,
        setPropertyInfo,
        externalInvestor,
        setExternalInvestor,
        investmentBlock,
        setInvestmentBlock,
        financials,
        investorCalculations,
        Session: session,
        sub: subscription?.value,
        isLoading: subLoading || propLoading || session.isPending || memberLoading,
        isSubmitting: postProperty.isPending || updateProperty.isPending,
        
        // Simplified Actions
        CreateProperty: () => postProperty.mutate(getSubmissionData()),
        UpdateProperty: () => updateProperty.mutate({ ...getSubmissionData()}),
        RemoveImage: delImage.mutate,
        removeInvestor: (email: string) => setExternalInvestor(prev => prev.filter(m => m.email !== email)),
        reFresh: refetch
    }

}
