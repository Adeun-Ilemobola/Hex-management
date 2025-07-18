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
  LucideIcon
} from 'lucide-react';

// Type definitions
type TypeOfSale = "SELL" | "RENT" | "LEASE";

interface InvestmentBlock {
  typeOfSale: TypeOfSale;
  initialInvestment: number;
  margin: number;
  discountPercentage: number;
  leaseCycle: number;
  saleDuration?: number;
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
}

interface InvestmentSummaryProps {
  investmentBlock: InvestmentBlock;
  financials: Financials;
}

const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({ 
  investmentBlock, 
  financials 
}) => {
  // Theme configuration for each type
  const getThemeConfig = (type: TypeOfSale): ThemeConfig => {
    switch (type) {
      case 'SELL':
        return {
          primary: 'bg-emerald-500',
          secondary: 'bg-emerald-50 dark:bg-emerald-900/20',
          border: 'border-emerald-200 dark:border-emerald-700',
          text: 'text-emerald-700 dark:text-emerald-400',
          icon: ShoppingCart,
          label: 'Sale',
          gradient: 'from-emerald-500 to-emerald-600'
        };
      case 'RENT':
        return {
          primary: 'bg-blue-500',
          secondary: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-700',
          text: 'text-blue-700 dark:text-blue-400',
          icon: Home,
          label: 'Rental',
          gradient: 'from-blue-500 to-blue-600'
        };
      case 'LEASE':
        return {
          primary: 'bg-purple-500',
          secondary: 'bg-purple-50 dark:bg-purple-900/20',
          border: 'border-purple-200 dark:border-purple-700',
          text: 'text-purple-700 dark:text-purple-400',
          icon: FileText,
          label: 'Lease',
          gradient: 'from-purple-500 to-purple-600'
        };
      default:
        return {
          primary: 'bg-gray-500',
          secondary: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-700',
          text: 'text-gray-700 dark:text-gray-400',
          icon: DollarSign,
          label: 'Investment',
          gradient: 'from-gray-500 to-gray-600'
        };
    }
  };

  const theme = getThemeConfig(investmentBlock.typeOfSale);
  const IconComponent = theme.icon;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
  }

  const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value, isMain = false }) => (
    <div className={`p-4 rounded-lg ${isMain ? theme.secondary : 'bg-gray-50 dark:bg-gray-800'} ${isMain ? theme.border : 'border-gray-200 dark:border-gray-700'} border`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${isMain ? theme.primary : 'bg-gray-200 dark:bg-gray-700'}`}>
          <Icon className={`h-4 w-4 ${isMain ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className={`text-lg font-bold ${isMain ? theme.text : 'text-gray-900 dark:text-white'}`}>{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <Card className={`${theme.border} border-2 dark:bg-gray-900 py-0 overflow-hidden`}>
        <CardHeader className={`bg-gradient-to-r ${theme.gradient} text-white `}>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-3">
              <IconComponent className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl font-bold">{theme.label} Summary</CardTitle>
                <p className="text-blue-100 opacity-90">{getPaymentFrequency()}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {investmentBlock.typeOfSale}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Main Result */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className={`h-6 w-6 ${theme.text}`} />
              <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">Final Amount</span>
            </div>
            <div className={`text-5xl font-bold ${theme.text} mb-2`}>
              {formatCurrency(financials.result)}
            </div>
            {investmentBlock.typeOfSale !== 'SELL' && (
              <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Duration: {financials.duration} payments</span>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              icon={DollarSign}
              label="Base Amount"
              value={formatCurrency(financials.base)}
              isMain={true}
            />
            <MetricCard
              icon={TrendingUp}
              label="Margin Added"
              value={formatCurrency(financials.marginAmount)}
            />
            <MetricCard
              icon={Percent}
              label="Discount Applied"
              value={formatCurrency(financials.discountAmount)}
            />
            <MetricCard
              icon={Target}
              label="Net Payment"
              value={formatCurrency(financials.netPayment)}
            />
          </div>

          {/* Breakdown Section */}
          <div className={`p-4 rounded-lg ${theme.secondary} ${theme.border} border`}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Calculation Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Initial Investment:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(investmentBlock.initialInvestment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Base per payment:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(financials.base)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Margin ({formatPercentage(investmentBlock.margin)}):</span>
                <span className="font-semibold text-green-600 dark:text-green-400">+{formatCurrency(financials.marginAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Discount ({formatPercentage(investmentBlock.discountPercentage)}):</span>
                <span className="font-semibold text-red-600 dark:text-red-400">-{formatCurrency(financials.discountAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span className={theme.text}>Final Amount:</span>
                <span className={theme.text}>{formatCurrency(financials.result)}</span>
              </div>
            </div>
          </div>

          {/* Additional Info for Rent/Lease */}
          {investmentBlock.typeOfSale !== 'SELL' && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Payment Schedule</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Payments:</span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">{financials.duration}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Value:</span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">{formatCurrency(financials.result * financials.duration)}</span>
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