import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Home,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  Target,
  LucideIcon,
  ArrowUp,
  ArrowDown,
  Clock,
  Calculator
} from 'lucide-react';

// Type definitions
type TypeOfSale = 'SELL' | 'RENT' | 'LEASE';

interface InvestmentBlock {
  typeOfSale: TypeOfSale;
  initialInvestment: number;
  margin: number;
  discountPercentage: number;
  leaseCycle: number;
  saleDuration?: number;
  depreciationYears: number;
}

interface Financials {
  result: number;
  duration: number;
  base: number;
  marginAmount: number;
  discountAmount: number;
  netPayment: number;
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
}

const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({
  investmentBlock,
  financials
}) => {
  const getThemeConfig = (type: TypeOfSale): ThemeConfig => {
    switch (type) {
      case 'SELL':
        return {
          primary: 'bg-emerald-500',
          secondary:
            'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
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
          secondary:
            'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
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
          secondary:
            'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
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
          secondary:
            'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
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

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const formatPercentage = (value: number): string => `${value}%`;

  const getPaymentFrequency = (): string => {
    switch (investmentBlock.typeOfSale) {
      case 'SELL':
        return 'One-time payment';
      case 'RENT':
        return 'Monthly payment';
      case 'LEASE':
        return `Per ${investmentBlock.leaseCycle} month cycle`;
      default:
        return 'Payment';
    }
  };

  interface MetricCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    isMain?: boolean;
    trend?: 'up' | 'down' | 'neutral';
    description?: string;
  }

  const MetricCard: React.FC<MetricCardProps> = ({
    icon: Icon,
    label,
    value,
    isMain = false,
    trend = 'neutral',
    description
  }) => (
    <div
      className={
        `group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:translate-y-[-2px] focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-${theme.accent}-500/40 ` +
        (isMain
          ? `${theme.secondary} ${theme.border} shadow-xl ${theme.glowColor} hover:shadow-2xl`
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg')
      }
      role="listitem"
      aria-label={label}
    >
      {isMain && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent" />
      )}

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={
              `p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ` +
              (isMain
                ? `bg-gradient-to-br ${theme.gradient} shadow-lg`
                : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600')
            }
          >
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${isMain ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
          </div>

          {trend !== 'neutral' && (
            <div
              className={
                `flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ` +
                (trend === 'up'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400')
              }
            >
              {trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              <span>{trend === 'up' ? 'Gain' : 'Discount'}</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2">{label}</p>
          <p className={`text-xl sm:text-2xl font-semibold tracking-tight ${isMain ? theme.text : 'text-gray-900 dark:text-white'}`}>
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
    <section className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      {/* Decorative styles */}
      <style>{`
        .shine:before{content:'';position:absolute;inset:-1px;border-radius:inherit;background:conic-gradient(from 180deg at 50% 50%,transparent,rgba(255,255,255,.35),transparent 30%);filter:blur(6px);opacity:.25}
        .tilt:hover{transform:translateY(-2px) rotate(.2deg)}
        .grid-auto-fit{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
      `}</style>

      {/* HEADER */}
      <Card
        className={`overflow-hidden border shadow-xl pt-0 ${theme.border} ${theme.glowColor} dark:bg-gray-950/60 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/50`}
        role="region"
        aria-labelledby="summary-heading"
      >
        <CardHeader className={`relative p-0 bg-gradient-to-r ${theme.gradient} text-white`}> 
          <div className="relative px-5 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="p-3 sm:p-4 rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                  <IconComponent className="h-7 w-7 sm:h-9 sm:w-9" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle id="summary-heading" className="text-2xl sm:text-3xl font-bold leading-tight">
                    {theme.label}
                  </CardTitle>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-white/90">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm sm:text-base font-medium">{getPaymentFrequency()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end md:items-center justify-between md:justify-end gap-4">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 px-3 py-1.5 text-xs sm:text-sm font-semibold backdrop-blur"
                >
                  {investmentBlock.typeOfSale}
                </Badge>
                <div className="text-right text-white/85">
                  <div className="text-[10px] uppercase tracking-wider">Investment ID</div>
                  <div className="text-xs sm:text-sm font-mono">#INV-{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-8">
          {/* HERO: Final Amount */}
          <div className="text-center mb-8 sm:mb-12 relative">
            <div className="absolute inset-0 mx-auto max-w-3xl blur-2xl opacity-60 bg-gradient-to-r from-transparent via-gray-100/60 dark:via-gray-800/50 to-transparent rounded-full" />
            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
                <div className={`p-2.5 sm:p-3 rounded-full bg-gradient-to-r ${theme.gradient} ring-1 ring-white/30`}> 
                  <Target className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Final Amount</span>
              </div>
              <div className={`text-5xl sm:text-6xl md:text-7xl font-black ${theme.text} tracking-tight`}> 
                {formatCurrency(financials.result)}
              </div>

              {investmentBlock.typeOfSale !== 'SELL' && (
                <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm sm:text-base font-medium">Duration: {financials.duration} payments</span>
                  <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gray-400/70" />
                  <span className="text-sm sm:text-base font-medium">Total Value: {formatCurrency(financials.result * financials.duration)}</span>
                  {(investmentBlock.typeOfSale === 'RENT' || investmentBlock.typeOfSale === 'LEASE') && (
                    <>
                      <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gray-400/70" />
                      <span className="text-sm sm:text-base font-medium">Depreciation Years: {investmentBlock.depreciationYears}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6 sm:my-8" />

          {/* METRICS */}
          <div className="grid grid-auto-fit gap-4 sm:gap-6 mb-8 sm:mb-10" role="list" aria-label="Key metrics">
            <MetricCard
              icon={DollarSign}
              label="Base Amount"
              value={formatCurrency(financials.base)}
              isMain
              description="Per payment cycle"
            />
            <MetricCard
              icon={TrendingUp}
              label="Margin Added"
              value={formatCurrency(financials.marginAmount)}
              trend="up"
              description={`${formatPercentage(investmentBlock.margin)} increase`}
            />
            <MetricCard
              icon={Percent}
              label="Discount Applied"
              value={formatCurrency(financials.discountAmount)}
              trend="down"
              description={`${formatPercentage(investmentBlock.discountPercentage)} reduction`}
            />
            <MetricCard
              icon={Target}
              label="Net Payment"
              value={formatCurrency(financials.netPayment)}
              description="Final calculated amount"
            />
          </div>

          {/* BREAKDOWN */}
          <div
            className={`relative overflow-hidden rounded-3xl ${theme.secondary} ${theme.border} border-2 shadow-xl shine`}
            aria-label="Calculation breakdown"
          >
            <div className="relative p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-r ${theme.gradient}`}>
                  <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold ${theme.text}`}>Calculation Breakdown</h3>
              </div>

              <div className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 ring-1 ring-black/5 dark:ring-white/10">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Initial Investment:</span>
                      <span className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
                        {formatCurrency(investmentBlock.initialInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 ring-1 ring-black/5 dark:ring-white/10">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Base per payment:</span>
                      <span className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
                        {formatCurrency(financials.base)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20 ring-1 ring-green-200/70 dark:ring-green-700/40">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 dark:text-green-400 font-medium">
                          Margin ({formatPercentage(investmentBlock.margin)}):
                        </span>
                      </div>
                      <span className="font-bold text-lg sm:text-xl text-green-600 dark:text-green-400">
                        +{formatCurrency(financials.marginAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20 ring-1 ring-red-200/70 dark:ring-red-700/40">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4 text-red-600" />
                        <span className="text-red-700 dark:text-red-400 font-medium">
                          Discount ({formatPercentage(investmentBlock.discountPercentage)}):
                        </span>
                      </div>
                      <span className="font-bold text-lg sm:text-xl text-red-600 dark:text-red-400">
                        -{formatCurrency(financials.discountAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-5 sm:my-6" />

                <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r ${theme.gradient} text-white shadow-xl tilt`}>
                  <span className="text-xl sm:text-2xl font-bold">Final Amount:</span>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight">{formatCurrency(financials.result)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT SCHEDULE */}
          {investmentBlock.typeOfSale !== 'SELL' && (
            <div className="mt-6 sm:mt-8 p-5 sm:p-8 bg-gradient-to-br from-gray-50 to-blue-50/40 dark:from-gray-800 dark:to-blue-900/10 rounded-3xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="p-2.5 sm:p-3 rounded-xl bg-blue-500">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Payment Schedule</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {financials.duration}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">Total Payments</div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      {formatCurrency(financials.result * financials.duration)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">Total Value</div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {investmentBlock.typeOfSale === 'LEASE' ? `${investmentBlock.leaseCycle}mo` : '1mo'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">Payment Cycle</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default InvestmentSummary;
