import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { ShieldCheck, Crown, Star } from "lucide-react";

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

  const tierConfig = {
    free: {
      icon: ShieldCheck,
      iconColor: "text-slate-500 dark:text-slate-400",
      accentGradient: "from-slate-500/10 via-slate-400/10 to-slate-500/10",
      popularBadge: false,
    },
    Deluxe: {
      icon: Star,
      iconColor: "text-sky-500 dark:text-sky-400",
      accentGradient: "from-sky-500/20 via-purple-500/20 to-pink-500/20",
      popularBadge: true,
    },
    Premium: {
      icon: Crown,
      iconColor: "text-fuchsia-500 dark:text-fuchsia-400",
      accentGradient: "from-fuchsia-500/20 via-purple-500/20 to-sky-500/20",
      popularBadge: false,
    },
  };

  const config = tierConfig[tier];
  const IconComponent = config.icon;

  return (
    <div className="relative">
      {/* Popular badge for Deluxe */}
      {config.popularBadge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 text-white shadow-lg hover:brightness-110 px-4 py-1.5 rounded-full text-xs font-bold">
            Most Popular
          </div>
        </div>
      )}

      <Card
        className={`
          group relative w-full max-w-sm h-full
          bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px]
          rounded-xl shadow-xl border border-white/15 dark:border-white/5
          hover:shadow-2xl hover:scale-[1.02] 
          transition-all duration-500 ease-out
          overflow-hidden
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40
          ${config.popularBadge ? 'ring-2 ring-fuchsia-500/30 dark:ring-fuchsia-400/30' : ''}
        `}
      >
        {/* Aurora gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <CardHeader className="relative z-10 text-center space-y-4 pt-8">
          <CardTitle className="flex justify-center items-center gap-3 text-2xl font-bold capitalize">
            <div className={`p-2 rounded-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] border border-white/15 dark:border-white/5`}>
              <IconComponent
                className={`w-6 h-6 ${config.iconColor}`}
                strokeWidth={2}
              />
            </div>
            <span className="text-slate-900 dark:text-white">{tier}</span>
          </CardTitle>
          
          <div className="flex justify-center items-end gap-1">
            <span className="text-5xl font-black text-slate-900 dark:text-white">
              ${price}
            </span>
            <span className="text-base text-slate-600 dark:text-slate-300 mb-2">
              /{isMonthly ? "mo" : "yr"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-5 px-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
              What&apos;s included
            </h3>
          </div>
          
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-slate-600 dark:text-slate-300"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="p-1 rounded-full bg-emerald-500/20 backdrop-blur-[2px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <span className="text-sm leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="relative z-10 mt-6 px-6 pb-6">
          <Button
            disabled={isCurrent}
            onClick={() => onSelect(tier)}
            className={`
              w-full h-12 text-base font-semibold rounded-xl 
              transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40
              ${
                isCurrent
                  ? "bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] border border-white/15 dark:border-white/5 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 text-white shadow-lg hover:brightness-110 active:brightness-95 hover:scale-[1.01]"
              }
            `}
          >
            {isCurrent ? "Current Plan" : "Choose Plan"}
          </Button>
        </CardFooter>

        {/* Enhanced hover effect line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center shadow-lg"></div>
      </Card>
    </div>
  );
}