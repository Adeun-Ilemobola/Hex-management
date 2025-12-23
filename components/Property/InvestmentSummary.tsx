import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  ShoppingCart,
  Home,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  Target,
  LucideIcon,
  ArrowUp,
  ArrowDown,
  Clock,
  Calculator,
  Users,
  AlertTriangle,
  Wallet
} from 'lucide-react';

// --- Type Definitions based on your New Logic ---

type TypeOfSale = 'SELL' | 'RENT' | 'LEASE';

export interface InvestmentBlock {
  typeOfSale: TypeOfSale;
  initialInvestment: number;
  margin: number;
  discountPercentage: number;
  leaseCycle: number;
  depreciationYears: number;
}

export interface Financials {
  result: number;
  duration: number;
  totalRevenue: number;
  totalProfit: number;
  base: number;
  marginAmount: number;
  discountAmount: number;
  netPayment: number;
}

export interface Investor {
  id?: string;
  name?: string;
  contributionPercentage: number;
  returnPercentage?: number;
  dollarValueReturn?: number;
}

export interface InvestorCalculations {
  updatedInvestors: Investor[];
  totalInvestorPercentage: number;
  remainingPercentage: number;
  isOverInvested: boolean;
}

interface ThemeConfig {
  primary: string;
  secondary: string;
  border: string;
  text: string;
  icon: LucideIcon;
  label: string;
  gradient: string;
  accent: string;
  glowColor: string;
}

interface InvestmentSummaryProps {
  investmentBlock: InvestmentBlock;
  financials: Financials;
  investorCalculations: InvestorCalculations;
}

const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({
  investmentBlock,
  financials,
  investorCalculations
}) => {
  // --- Theme Configuration (Preserved from Old Version) ---
  const getThemeConfig = (type: TypeOfSale): ThemeConfig => {
    switch (type) {
      case 'SELL':
        return {
          primary: 'bg-emerald-500',
          secondary: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
          border: 'border-emerald-300 dark:border-emerald-600',
          text: 'text-emerald-700 dark:text-emerald-400',
          icon: ShoppingCart,
          label: 'Property Sale',
          gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
          accent: 'emerald',
          glowColor: 'shadow-emerald-500/25'
        };
      case 'RENT':
        return {
          primary: 'bg-blue-500',
          secondary: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
          border: 'border-blue-300 dark:border-blue-600',
          text: 'text-blue-700 dark:text-blue-400',
          icon: Home,
          label: 'Rental Income',
          gradient: 'from-blue-500 via-blue-600 to-indigo-600',
          accent: 'blue',
          glowColor: 'shadow-blue-500/25'
        };
      case 'LEASE':
        return {
          primary: 'bg-purple-500',
          secondary: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
          border: 'border-purple-300 dark:border-purple-600',
          text: 'text-purple-700 dark:text-purple-400',
          icon: FileText,
          label: 'Lease Agreement',
          gradient: 'from-purple-500 via-purple-600 to-pink-600',
          accent: 'purple',
          glowColor: 'shadow-purple-500/25'
        };
      default:
        return {
          primary: 'bg-gray-500',
          secondary: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
          border: 'border-gray-300 dark:border-gray-600',
          text: 'text-gray-700 dark:text-gray-400',
          icon: DollarSign,
          label: 'Investment',
          gradient: 'from-gray-500 via-gray-600 to-slate-600',
          accent: 'gray',
          glowColor: 'shadow-gray-500/25'
        };
    }
  };

  const theme = getThemeConfig(investmentBlock.typeOfSale);
  const IconComponent = theme.icon;

  // --- Formatters ---
  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const formatPercentage = (value: number): string => `${value.toFixed(1)}%`;

  const getPaymentFrequency = (): string => {
    switch (investmentBlock.typeOfSale) {
      case 'SELL': return 'One-time payment';
      case 'RENT': return 'Monthly payment';
      case 'LEASE': return `Per ${investmentBlock.leaseCycle} month cycle`;
      default: return 'Payment';
    }
  };

  // --- Sub-Components ---
  interface MetricCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    isMain?: boolean;
    trend?: 'up' | 'down' | 'neutral';
    description?: string;
    highlight?: boolean;
  }

  const MetricCard: React.FC<MetricCardProps> = ({
    icon: Icon,
    label,
    value,
    isMain = false,
    trend = 'neutral',
    description,
    highlight = false
  }) => (
    <div
      className={
        `group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:translate-y-[-2px] ` +
        (isMain
          ? `${theme.secondary} ${theme.border} shadow-xl ${theme.glowColor} hover:shadow-2xl`
          : highlight 
            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700 hover:shadow-lg'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg')
      }
    >
      {isMain && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent" />
      )}
      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={
            `p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ` +
            (isMain
              ? `bg-gradient-to-br ${theme.gradient} shadow-lg`
              : highlight 
                ? 'bg-amber-100 dark:bg-amber-800'
                : 'bg-gray-100 dark:bg-gray-700')
          }>
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${isMain ? 'text-white' : highlight ? 'text-amber-600' : 'text-gray-600 dark:text-gray-300'}`} />
          </div>
          {trend !== 'neutral' && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ` +
              (trend === 'up'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400')
            }>
              {trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              <span>{trend === 'up' ? 'Gain' : 'Discount'}</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2">{label}</p>
          <p className={`text-xl sm:text-2xl font-semibold tracking-tight ${isMain ? theme.text : highlight ? 'text-amber-700 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 font-sans">
      {/* Styles */}
      <style>{`
        .shine:before{content:'';position:absolute;inset:-1px;border-radius:inherit;background:conic-gradient(from 180deg at 50% 50%,transparent,rgba(255,255,255,.35),transparent 30%);filter:blur(6px);opacity:.25}
        .tilt:hover{transform:translateY(-2px) rotate(.2deg)}
        .grid-auto-fit{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
      `}</style>

      {/* HEADER */}
      <Card className={`overflow-hidden border shadow-xl pt-0 ${theme.border} ${theme.glowColor} bg-white/90 dark:bg-gray-900/90 backdrop-blur`}>
        <CardHeader className={`relative p-0 bg-gradient-to-r ${theme.gradient} text-white`}>
          <div className="relative px-5 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="p-3 sm:p-4 rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur shadow-inner">
                  <IconComponent className="h-7 w-7 sm:h-9 sm:w-9" />
                </div>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold leading-tight">
                    {theme.label}
                  </CardTitle>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-white/90">
                    <Clock className="h-4 w-4 opacity-80" />
                    <span className="text-sm sm:text-base font-medium">{getPaymentFrequency()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1.5 backdrop-blur">
                  {investmentBlock.typeOfSale}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-8 space-y-8">
          
          {/* HERO: Final Amount & Profit Context */}
          <div className="text-center relative py-4">
             <div className="absolute inset-0 mx-auto max-w-3xl blur-3xl opacity-40 bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent rounded-full" />
             <div className="relative flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-2">
                   <Target className={`h-5 w-5 ${theme.text}`} />
                   <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Projected {investmentBlock.typeOfSale === 'SELL' ? 'Revenue' : 'Payment'}</span>
                </div>
                <div className={`text-5xl sm:text-6xl md:text-7xl font-black ${theme.text} tracking-tight drop-shadow-sm`}>
                   {formatCurrency(financials.result)}
                </div>
                
                {/* Duration & Depreciation Context */}
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <Badge variant="outline" className="px-3 py-1 border-gray-200 bg-gray-50 text-gray-600">
                        {financials.duration} Cycles
                    </Badge>
                    {(investmentBlock.typeOfSale === 'RENT' || investmentBlock.typeOfSale === 'LEASE') && (
                       <Badge variant="outline" className="px-3 py-1 border-gray-200 bg-gray-50 text-gray-600">
                         {investmentBlock.depreciationYears}yr Depreciation
                       </Badge>
                    )}
                </div>
             </div>
          </div>

          <Separator />

          {/* UNIT ECONOMICS GRID */}
          <div className="grid grid-auto-fit gap-4 sm:gap-6">
            <MetricCard
              icon={DollarSign}
              label="Base Calculation"
              value={formatCurrency(financials.base)}
              isMain
              description={investmentBlock.typeOfSale === 'SELL' ? 'Initial Value' : 'Per cycle base'}
            />
            <MetricCard
              icon={TrendingUp}
              label="Margin Added"
              value={formatCurrency(financials.marginAmount)}
              trend="up"
              description={`${formatPercentage(investmentBlock.margin)} markup`}
            />
            <MetricCard
              icon={Percent}
              label="Discount Applied"
              value={formatCurrency(financials.discountAmount)}
              trend="down"
              description={`${formatPercentage(investmentBlock.discountPercentage)} off`}
            />
             <MetricCard
              icon={Wallet}
              label="Total Profit"
              value={formatCurrency(financials.totalProfit)}
              highlight
              description={`Rev: ${formatCurrency(financials.totalRevenue)}`}
            />
          </div>

          {/* INVESTOR BREAKDOWN SECTION (NEW) */}
          <div className={`relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-inner`}>
             <div className="relative p-6 sm:p-8">
                
                {/* Investor Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <Users className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Investor Distribution</h3>
                    </div>
                    {investorCalculations.isOverInvested && (
                        <Badge variant="destructive" className="animate-pulse">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Over-allocated ({investorCalculations.totalInvestorPercentage}%)
                        </Badge>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mb-8 space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-indigo-600 dark:text-indigo-400">Investors: {investorCalculations.totalInvestorPercentage}%</span>
                        <span className="text-slate-500">Remaining: {investorCalculations.remainingPercentage}%</span>
                    </div>
                    <Progress 
                        value={investorCalculations.totalInvestorPercentage} 
                        className={`h-3 ${investorCalculations.isOverInvested ? 'bg-red-100' : 'bg-slate-200'}`}
                        // Note: You might need to inline style the indicator color if your Progress component doesn't support color props
                    />
                </div>

                {/* Investors List */}
                {investorCalculations.updatedInvestors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {investorCalculations.updatedInvestors.map((inv, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                        {inv.name ? inv.name.charAt(0) : `I${idx+1}`}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{inv.name || `Investor ${idx + 1}`}</p>
                                        <p className="text-xs text-slate-500">{inv.contributionPercentage}% Stake</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(inv.dollarValueReturn || 0)}</p>
                                    <p className="text-xs text-green-600 flex items-center justify-end gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        {inv.returnPercentage?.toFixed(1)}% ROI
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        No external investors added
                    </div>
                )}
             </div>
          </div>

          {/* CALCULATION BREAKDOWN (Styled from Old Version) */}
          <div className={`relative overflow-hidden rounded-3xl ${theme.secondary} ${theme.border} border-2 shadow-xl shine`}>
            <div className="relative p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-r ${theme.gradient}`}>
                  <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold ${theme.text}`}>Math Breakdown</h3>
              </div>

              <div className="space-y-4">
                 <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl flex justify-between items-center">
                    <span className="text-sm font-medium opacity-75">Initial Investment</span>
                    <span className="font-mono font-bold">{formatCurrency(investmentBlock.initialInvestment)}</span>
                 </div>
                 
                 <div className="flex justify-between items-center px-4">
                    <span className="text-xs uppercase tracking-wider opacity-60">Operations</span>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-100/50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200/50 dark:border-green-800/50">
                        <div className="text-xs text-green-700 dark:text-green-400 mb-1">Margin</div>
                        <div className="font-bold text-green-800 dark:text-green-300">+{formatCurrency(financials.marginAmount)}</div>
                    </div>
                    <div className="bg-red-100/50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200/50 dark:border-red-800/50">
                        <div className="text-xs text-red-700 dark:text-red-400 mb-1">Discount</div>
                        <div className="font-bold text-red-800 dark:text-red-300">-{formatCurrency(financials.discountAmount)}</div>
                    </div>
                 </div>

                 <div className={`mt-4 p-4 rounded-xl bg-gradient-to-r ${theme.gradient} text-white shadow-lg flex justify-between items-center`}>
                    <span className="font-medium">Total Revenue Generated</span>
                    <span className="text-2xl font-black">{formatCurrency(financials.totalRevenue)}</span>
                 </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </section>
  );
};

export default InvestmentSummary;