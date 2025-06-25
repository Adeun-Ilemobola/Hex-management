import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { ShieldCheck } from "lucide-react";

interface SubscriptionCardProp {
    price: number;
    isMonthly: boolean;
    tier: "Free" | "Deluxe" | "Premium";
    benefits: string[];
    isCurrent: boolean;
}

export default function SubscriptionCard({
    data,
}: {
    data: SubscriptionCardProp;
}) {
    const { price, isCurrent, isMonthly, tier, benefits } = data;
    // Ring color for Deluxe
    const deluxeRing =
        tier === "Deluxe"
            ? "ring-2 ring-offset-2 ring-blue-400/60 ring-offset-background shadow-[0_0_12px_2px_rgba(56,189,248,0.4)] dark:shadow-[0_0_18px_3px_rgba(56,189,248,0.4)]"
            : "";
    return (
        <Card
            className={`
        w-full  max-w-sm rounded-2xl shadow-xl border border-muted 
        transition-all duration-300
        hover:scale-[1.010] hover:shadow-2xl
        bg-background
        ${deluxeRing}
      `}
        >
            <CardHeader className="space-y-2">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight capitalize">
                    <ShieldCheck
                        aria-label="Subscription Tier Icon"
                        className={`w-6 h-6 ${tier === "Premium"
                                ? "text-yellow-500"
                                : tier === "Deluxe"
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            }`}
                        strokeWidth={2}
                    />
                    {tier}
                </CardTitle>
                <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-primary">
                        ${price}
                    </span>
                    <span className="text-base text-muted-foreground font-medium mb-1">
                        /{isMonthly ? "Monthly" : "Year"}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="py-2 flex flex-col">
                <h2 className="text-lg font-semibold mb-2 text-muted-foreground">
                    Benefits
                </h2>
                <ul className="flex flex-col gap-2">
                    {benefits.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-2 text-base text-muted-foreground"
                        >
                            <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={2} />
                            <span className="">{item}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="flex justify-center mt-2">
                <Button
                    disabled={isCurrent}
                    variant={isCurrent ? "outline" : "secondary"}
                    className={`w-full py-2 rounded-xl font-semibold text-base transition
            ${isCurrent
                            ? "border-primary/30 text-muted-foreground bg-muted"
                            : "bg-primary text-primary-foreground hover:bg-primary/80"
                        }`}
                >
                    {isCurrent ? "Current Plan" : "Choose Plan"}
                </Button>
            </CardFooter>
        </Card>
    );
}
