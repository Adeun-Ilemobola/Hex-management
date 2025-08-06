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
    <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-105 ${isMain
        ? `${theme.secondary} ${theme.border} shadow-xl ${theme.glowColor} hover:shadow-2xl`
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg'
      }`}>
      {/* Gradient overlay for main cards */}
      {isMain && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent"></div>
      )}

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${isMain
              ? `bg-gradient-to-br ${theme.gradient} shadow-lg`
              : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
            }`}>
            <Icon className={`h-6 w-6 ${isMain ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
          </div>

          {trend !== 'neutral' && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${trend === 'up'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
              {trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              <span>{trend === 'up' ? 'Gain' : 'Discount'}</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</p>
          <p className={`text-2xl font-bold transition-colors ${isMain ? theme.text : 'text-gray-900 dark:text-white'
            }`}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Enhanced Header */}
      <Card className={`overflow-hidden border-2 ${theme.border} shadow-2xl pt-0 px-0 ${theme.glowColor} dark:bg-gray-900`}>
        <CardHeader className={`relative bg-gradient-to-r ${theme.gradient} text-white p-0`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="relative p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                  <IconComponent className="h-10 w-10" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold mb-2">{theme.label}</CardTitle>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{getPaymentFrequency()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-bold backdrop-blur-sm"
                >
                  {investmentBlock.typeOfSale}
                </Badge>
                <div className="text-right text-white/80">
                  <div className="text-xs">Investment ID</div>
                  <div className="text-sm font-mono">#INV-{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Hero Final Amount */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 dark:via-gray-800/50 to-transparent blur-xl"></div>
            <div className="relative">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${theme.gradient}`}>
                  <Target className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  Final Amount
                </span>
              </div>
              <div className={`text-6xl sm:text-7xl font-black ${theme.text} mb-4 tracking-tight`}>
                {formatCurrency(financials.result)}
              </div>
              {investmentBlock.typeOfSale !== 'SELL' && (
                <div className="flex items-center justify-center space-x-3 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-5 w-5" />
                  <span className="text-lg font-medium">
                    Duration: {financials.duration} payments
                  </span>
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-lg font-medium">
                    Total Value: {formatCurrency(financials.result * financials.duration)}
                  </span>
                  {(investmentBlock.typeOfSale === "RENT" || investmentBlock.typeOfSale === "LEASE") && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-lg font-medium">
                        depreciation Years: {investmentBlock.depreciationYears}
                      </span>
                    </>

                  )}

                </div>
              )}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Enhanced Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
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

          {/* Enhanced Breakdown */}
          <div className={`relative overflow-hidden rounded-3xl ${theme.secondary} ${theme.border} border-2 shadow-xl`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>

            <div className="relative p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${theme.gradient}`}>
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${theme.text}`}>Calculation Breakdown</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Initial Investment:</span>
                      <span className="font-bold text-xl text-gray-900 dark:text-white">
                        {formatCurrency(investmentBlock.initialInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Base per payment:</span>
                      <span className="font-bold text-xl text-gray-900 dark:text-white">
                        {formatCurrency(financials.base)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center space-x-2">
                        <ArrowUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 dark:text-green-400 font-medium">
                          Margin ({formatPercentage(investmentBlock.margin)}):
                        </span>
                      </div>
                      <span className="font-bold text-xl text-green-600 dark:text-green-400">
                        +{formatCurrency(financials.marginAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                      <div className="flex items-center space-x-2">
                        <ArrowDown className="h-4 w-4 text-red-600" />
                        <span className="text-red-700 dark:text-red-400 font-medium">
                          Discount ({formatPercentage(investmentBlock.discountPercentage)}):
                        </span>
                      </div>
                      <span className="font-bold text-xl text-red-600 dark:text-red-400">
                        -{formatCurrency(financials.discountAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className={`flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r ${theme.gradient} text-white shadow-xl`}>
                  <span className="text-2xl font-bold">Final Amount:</span>
                  <span className="text-3xl font-black">{formatCurrency(financials.result)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Payment Schedule */}
          {investmentBlock.typeOfSale !== 'SELL' && (
            <div className="mt-8 p-8 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 rounded-3xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-500">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Payment Schedule</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {financials.duration}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">Total Payments</div>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      {formatCurrency(financials.result * financials.duration)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">Total Value</div>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
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
    </div>
  );
};

export default InvestmentSummary;