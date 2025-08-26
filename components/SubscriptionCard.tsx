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
  tier: "free" | "Deluxe" | "Premium";
  benefits: string[];
  isCurrent: boolean;
}

export default function SubscriptionCard({
  data,
  onSelect,
}: {
  data: SubscriptionCardProp;
  onSelect: (id: "free" | "Deluxe" | "Premium") => void;
}) {
  const { price, isMonthly, tier, benefits, isCurrent } = data;

  const tierColors = {
    free: "from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800",
    Deluxe: "from-blue-500 to-cyan-500",
    Premium: "from-yellow-400 to-orange-500",  
  };

  return (
    <Card
      className={`group relative w-full max-w-sm rounded-3xl overflow-hidden border border-muted bg-background transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        tier === "Deluxe"
          ? "ring-2 ring-offset-2 ring-blue-400/60 dark:ring-blue-300/40 shadow-[0_0_24px_4px_rgba(56,189,248,0.3)]"
          : ""
      }`}
    >
      {/* Animated Gradient Aura */}
      <div
        className={`absolute inset-0 z-0 bg-gradient-to-br ${tierColors[tier]} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500`}
      />

      <CardHeader className="relative z-10 text-center space-y-2">
        <CardTitle className="flex justify-center items-center gap-2 text-2xl font-extrabold capitalize">
          <ShieldCheck
            className={`w-6 h-6 ${
              tier === "Premium"
                ? "text-yellow-500"
                : tier === "Deluxe"
                ? "text-blue-500"
                : "text-muted-foreground"
            }`}
            strokeWidth={2}
          />
          {tier}
        </CardTitle>
        <div className="flex justify-center items-end gap-1">
          <span className="text-4xl font-black text-primary">${price}</span>
          <span className="text-base text-muted-foreground mb-1">
            /{isMonthly ? "mo" : "yr"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        <h3 className="text-lg font-medium text-muted-foreground">Benefits</h3>
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="relative z-10 mt-6">
        <Button
          disabled={isCurrent}
          onClick={() => onSelect(tier)}
          variant={isCurrent ? "outline" : "secondary"}
          className={`w-full py-2 text-base font-semibold rounded-xl transition-all ${
            isCurrent
              ? "border-primary/30 text-muted-foreground bg-muted cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {isCurrent ? "Current Plan" : "Choose Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
