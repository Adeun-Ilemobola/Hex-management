import React from 'react';
import { Button } from '@/components/ui/button';
import { 
    Mail, 
    DollarSign, 
    Edit2, 
    X, 
    Shield, 
    CheckCircle2,
    AlertCircle,
    Banknote,
    Activity,
    ArrowUpRight
} from 'lucide-react';

interface ExternalInvestorInput {
    id: string;
    name: string;
    status: "DRAFT" | "FINALIZED" | "LOCKED";
    email: string;
    contributionPercentage: number;
    returnPercentage: number;
    dollarValueReturn: number;
    isInternal: boolean;
    accessRevoked: boolean;
    funded: boolean;
    investmentBlockId: string;
    investorUserId?: string | null | undefined;
    fundedAt?: Date | null | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}

function InvestorCard({
    member,
    onEdit,
    onRemove,
    locked
}: {
    member: ExternalInvestorInput;
    onEdit: () => void;
    onRemove: () => void;
    locked: boolean;
}) {
    const getStatusColor = () => {
        switch (member.status) {
            case 'FINALIZED': return 'from-green-400 to-emerald-500';
            case 'LOCKED': return 'from-gray-400 to-gray-500';
            default: return 'from-yellow-400 to-amber-500';
        }
    };

    const getStatusIcon = () => {
        switch (member.status) {
            case 'FINALIZED': return <CheckCircle2 className="h-3 w-3" />;
            case 'LOCKED': return <Shield className="h-3 w-3" />;
            default: return <AlertCircle className="h-3 w-3" />;
        }
    };

    return (
        <div className="group relative overflow-hidden ml-1">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main card container */}
            <div className="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-400/10 transition-all duration-500 hover:border-purple-300/50 dark:hover:border-purple-600/50 ">
                
                {/* Animated gradient border */}
                {/* <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 animate-pulse" /> */}
                
                {/* Status badge */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${getStatusColor()} text-white text-xs font-semibold shadow-lg`}>
                        {getStatusIcon()}
                        <span className="uppercase tracking-wider">{member.status}</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    {/* Top section - Investor Identity */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                        {/* Enhanced Avatar */}
                        <div className="relative group/avatar">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-xl transform transition-transform duration-300 group-hover/avatar:scale-110 group-hover/avatar:rotate-3">
                                {member.name ? member.name.substring(0, 2).toUpperCase() : '??'}
                            </div>
                            {member.funded && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center animate-pulse">
                                    <Banknote className="h-3 w-3 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Investor Details */}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    {member.name || 'Unnamed Investor'}
                                </h3>
                                {member.isInternal && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                        Internal
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm font-medium">{member.email || 'No email provided'}</span>
                            </div>
                            {member.fundedAt && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                                    <Activity className="h-3 w-3" />
                                    <span>Funded on {new Date(member.fundedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Financial Metrics Grid */}
                    <div className="flex flex-col sm:flex-row gap-4 ">
                        {/* Contribution */}
                        <div className="relative flex-1/2 overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/30">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl" />
                            <div className="relative space-y-1">
                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Contribution</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-100">
                                    {member.contributionPercentage.toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        {/* Return Percentage */}
                        {/* <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/30">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl" />
                            <div className="relative space-y-1">
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                    <TrendingUp className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Return Rate</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">
                                    {member.returnPercentage.toFixed(1)}%
                                </div>
                            </div>
                        </div> */}

                        {/* Dollar Return */}
                        <div className="relative flex-1/2 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-800/10 rounded-2xl p-4 border border-green-200/50 dark:border-green-700/30">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/10 rounded-full blur-2xl" />
                            <div className="relative space-y-1">
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <ArrowUpRight className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Expected</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100">
                                    ${member.dollarValueReturn.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {!locked && (
                        <div className="flex gap-3 pt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                            <Button
                                onClick={onEdit}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 rounded-xl py-2.5 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 font-semibold"
                            >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Details
                            </Button>
                            <Button
                                onClick={onRemove}
                                variant="outline"
                                className="flex-1 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 rounded-xl py-2.5 transition-all duration-300 font-semibold"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Remove
                            </Button>
                        </div>
                    )}
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
        </div>
    );
}

export default InvestorCard;