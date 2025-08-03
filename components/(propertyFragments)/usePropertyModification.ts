"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "@/lib/Zod";
import { DeleteImages, } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export function usePropertyModification(id: string) {
    const Router = useRouter();
    const [propertyInfo, setPropertyInfo] = useState<PropertyInput>(defaultPropertyInput)
    const [investmentBlock, setInvestmentBlock] = useState<InvestmentBlockInput>(defaultInvestmentBlockInput)
    const [externalInvestor, setExternalInvestor] = useState<ExternalInvestorInput[]>([])
    const getProperty = api.Propertie.getPropertie.useQuery({ pID: id })
    const Session = authClient.useSession();
    const getUserPlan = api.user.getUserPlan.useQuery();



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
    })
    const updateProperty = api.Propertie.updataPropertie.useMutation({
        onSuccess(data) {
            if (data && data.success) {
                toast.success(data.message, { id: "update" });
                Router.push("/home")

            } else {
                toast.error(data.message, { id: "update" });
            }
        },
        onMutate() {
            toast.loading("Updating property...", { id: "update" });
        },
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
            const depreciationYears = 8; // Investor wants to recover in 8 years
            const base = initialInvestment / (depreciationYears * 12);
            const pay = base * (1 + margin / 100);
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


    useEffect(() => {
        if (getProperty.data?.success && getProperty.data?.value) {
            const { externalInvestors, property, investmentBlock, images } = getProperty.data.value;

            setPropertyInfo({
                ...property,
                images,
                status: property.status as StatusEnumType,
                propertyType: property.propertyType as PropertyTypeEnumType,
                description: property.description || "",
            });

            if (investmentBlock) {
                setExternalInvestor(externalInvestors);
                setInvestmentBlock({
                    ...investmentBlock,
                    typeOfInvestment: investmentBlock.typeOfInvestment as InvestmentTypeEnumType,
                    typeOfSale: investmentBlock.typeOfSale as SaleTypeEnumType,
                    externalInvestors,
                    propertyId: property.id,
                    saleDuration: investmentBlock.saleDuration,
                    leaseCycle: investmentBlock.leaseCycle,
                });
            }
        }

        const user = Session?.data?.user;
        if (user?.name && user?.email && id.length === 0) {
            setPropertyInfo(prev => ({
                ...prev,
                ownerName: user.name,
                contactInfo: user.email,
            }));
        }



    }, [Session, id, getProperty.data]);


    useEffect(() => {
        const { result, duration } = financials;

        setInvestmentBlock(prev => {
            if (prev.saleDuration === duration && prev.finalResult === result) return prev;

            return {
                ...prev,
                saleDuration: duration,
                finalResult: result,
            };
        });
    }, [investmentBlock.discountPercentage, investmentBlock.margin, investmentBlock.typeOfSale]);

    useEffect(() => {
        setExternalInvestor(prev => {
            const updated = investorCalculations.updatedInvestors;
            const isSame =
                prev.length === updated.length &&
                prev.every((inv, i) =>
                    inv.dollarValueReturn === updated[i].dollarValueReturn &&
                    inv.returnPercentage === updated[i].returnPercentage
                );

            if (isSame) return prev;
            return updated;
        });
    }, [investmentBlock.externalInvestors, investorCalculations.updatedInvestors]);





    return {
        propertyInfo,
        setPropertyInfo,
        externalInvestor,
        setExternalInvestor,
        investmentBlock,
        setInvestmentBlock,
        financials,
        investorCalculations,
        Session,
        sub: getUserPlan.data,
        isLoading: getUserPlan.isPending || getProperty.isPending || Session.isPending || postProperty.isPending || updateProperty.isPending,
        disableInput: postProperty.isPending || updateProperty.isPending,
        CreateProperty: postProperty.mutate,
        UpdateProperty: updateProperty.mutate,
        RemoveImage: delImage.mutate

    }

}
