import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { ShieldCheck, Crown, Star, Check } from "lucide-react";

// 1. Define the strictly typed IDs to match your DB/Zod schema
type PlanId = "free" | "deluxe" | "premium";

export type SubscriptionCardProp = {
  tier: string;      // Display Label (e.g. "Free", "Deluxe")
  value: PlanId;     // Logic ID (e.g. "free", "deluxe")
  price: number;
  isMonthly: boolean;
  isCurrent: boolean;
  description: string;
  benefits: string[];
};

export default function SubscriptionCard({
  data,
  onSelect,
}: {
  data: SubscriptionCardProp;
  onSelect: (value: PlanId) => void;
}) {
  const { price, isMonthly, tier, value, benefits, isCurrent } = data;

  // 2. Configuration mapped by the stable 'value' ID
  const tierConfig: Record<PlanId, {
    icon: React.ElementType;
    iconColor: string;
    accentGradient: string;
    popularBadge: boolean;
  }> = {
    free: {
      icon: ShieldCheck,
      iconColor: "text-slate-500 dark:text-slate-400",
      accentGradient: "from-slate-500/10 via-slate-400/10 to-slate-500/10",
      popularBadge: false,
    },
    deluxe: {
      icon: Star,
      iconColor: "text-sky-500 dark:text-sky-400",
      accentGradient: "from-sky-500/20 via-purple-500/20 to-pink-500/20",
      popularBadge: true,
    },
    premium: {
      icon: Crown,
      iconColor: "text-fuchsia-500 dark:text-fuchsia-400",
      accentGradient: "from-fuchsia-500/20 via-purple-500/20 to-sky-500/20",
      popularBadge: false,
    },
  };

  const config = tierConfig[value] || tierConfig.free;
  const IconComponent = config.icon;

  return (
    <div className="relative h-full">
      {/* Popular badge */}
      {config.popularBadge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 text-white shadow-lg px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
            Most Popular
          </div>
        </div>
      )}

      <Card
        className={`
          group relative w-full h-full flex flex-col justify-between
          bg-white/40 dark:bg-slate-900/40 backdrop-blur-md
          rounded-2xl shadow-xl border border-white/20 dark:border-white/10
          hover:shadow-2xl hover:scale-[1.02] 
          transition-all duration-500 ease-out
          overflow-hidden
          ${config.popularBadge ? 'ring-1 ring-fuchsia-500/30 dark:ring-fuchsia-400/30' : ''}
        `}
      >
        {/* Dynamic Background Gradients */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
          <CardHeader className="text-center space-y-4 pt-8 pb-2">
            <CardTitle className="flex justify-center items-center gap-3 text-2xl font-bold capitalize">
              <div className="p-2.5 rounded-full bg-white/30 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-sm">
                <IconComponent className={`w-6 h-6 ${config.iconColor}`} strokeWidth={2} />
              </div>
              <span className="text-slate-900 dark:text-white tracking-tight">{tier}</span>
            </CardTitle>
            
            <div className="flex justify-center items-end gap-1">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                ${price}
              </span>
              <span className="text-base font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                /{isMonthly ? "mo" : "yr"}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 px-4 h-10 flex items-center justify-center">
              {data.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-6 px-8 py-6 flex-grow">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200 dark:border-slate-700/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent px-2 text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                  Features
                </span>
              </div>
            </div>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="p-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                    </div>
                  </div>
                  <span className="text-sm font-medium leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="px-6 pb-8 pt-2">
            <Button
              disabled={isCurrent}
              onClick={() => onSelect(value)}
              className={`
                w-full h-12 text-base font-bold rounded-xl shadow-md
                transition-all duration-300
                ${
                  isCurrent
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default shadow-none border border-slate-300 dark:border-slate-700"
                    : "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-sky-600 text-white hover:brightness-110 active:scale-[0.98] hover:shadow-lg hover:shadow-purple-500/20"
                }
              `}
            >
              {isCurrent ? "Current Plan" : `Select ${tier}`}
            </Button>
          </CardFooter>
        </div>

        {/* Bottom hover accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
      </Card>
    </div>
  );
}