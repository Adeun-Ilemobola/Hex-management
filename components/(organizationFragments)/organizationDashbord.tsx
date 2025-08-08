'use client'
import React, {  useEffect } from 'react'
import { Nav } from '../Nav'
import { authClient } from '@/lib/auth-client'
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Shield, Clock, CheckCircle2, XCircle, Building2, Crown, User } from 'lucide-react';

import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/trpc'
import { InvitationStatus } from 'better-auth/plugins'
import DropBack from '../DropBack';

type invitations = {
    id: string;
    organizationId: string;
    email: string;
    role: "member" | "admin" | "owner";
    status: InvitationStatus;
    inviterId: string;
    expiresAt: Date;
}[] | undefined

type member = {
    id: string;
    organizationId: string;
    role: "member" | "admin" | "owner";
    createdAt: Date;
    userId: string;
    user: {
        email: string;
        name: string;
        image?: string;
    };
}[] | undefined

interface OrganizationMetadata {
    planType: string;
    seatLimit: number;
    isExpired: boolean
}

export interface XOrganization {
    id: string;
    name: string;
    slug: string;
    logo?: string | null | undefined;
    createdAt: Date;
    metadata: OrganizationMetadata;
    invitations: invitations;
    members: member;
}

export default function OrganizationDashbord() {
    const searchParams = useSearchParams()
    const OrgId = searchParams.get('id')
    const slug = searchParams.get('slug')
    const { data: getOrganization , isPending } = api.organization.getOrganization.useQuery({ id: OrgId || '', slug: slug || '' })
    const [organization, setOrganization] = React.useState<XOrganization | null>(null)
    const { data } = authClient.useSession()

    useEffect(() => {
        const info = getOrganization?.value

        if (info) {
            setOrganization({
                id: info.id,
                name: info.name,
                slug: info.slug,
                logo: info.logo,
                createdAt: new Date(info.createdAt),
                metadata: info.metadata,
                invitations: info.invitations?.map((invitation) => {
                    return {
                        id: invitation.id,
                        organizationId: invitation.organizationId,
                        email: invitation.email,
                        role: invitation.role,
                        status: invitation.status,
                        inviterId: invitation.inviterId,
                        expiresAt: new Date(invitation.expiresAt)
                    }
                }),
                members: info.members?.map((member) => {
                    return {
                        id: member.id,
                        organizationId: member.organizationId,
                        role: member.role,
                        createdAt: new Date(member.createdAt),
                        userId: member.userId,
                        user: {
                            email: member.user.email,
                            name: member.user.name,
                            image: member.user.image
                        }
                    }
                })
            })
        }
    }, [getOrganization])

    return (
        <DropBack is={isPending} >
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
                    33% { transform: translate3d(20px, -20px, 0) rotate(120deg); }
                    66% { transform: translate3d(-15px, 15px, 0) rotate(240deg); }
                }
                @keyframes float-reverse {
                    0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
                    50% { transform: translate3d(-30px, -25px, 0) rotate(180deg); }
                }
                .blob-1 { animation: float 25s ease-in-out infinite; }
                .blob-2 { animation: float-reverse 30s ease-in-out infinite; }
                .gradient-text {
                    background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .glass-surface {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
                }
                .dark .glass-surface {
                    background: rgba(17, 24, 39, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
                }
                .table-container {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
                }
                .dark .table-container {
                    background: rgba(17, 24, 39, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
                }
            `}</style>

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="blob-1 absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-purple-200/30 dark:from-blue-600/20 dark:to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="blob-2 absolute bottom-0 -left-32 w-80 h-80 bg-gradient-to-r from-purple-200/25 to-pink-200/25 dark:from-purple-600/15 dark:to-pink-600/15 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 left-1/2 w-56 h-56 bg-gradient-to-r from-sky-100/20 to-blue-100/20 dark:from-sky-700/10 dark:to-blue-700/10 rounded-full blur-2xl"></div>
            </div>

            <Nav session={data} SignOut={() => authClient.signOut()} />

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
                {organization && (
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="glass-surface rounded-3xl p-8">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    {organization.logo ? (
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
                                            <img src={organization.logo} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-600 flex items-center justify-center shadow-xl">
                                            <Building2 className="w-10 h-10 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold gradient-text leading-tight">{organization.name}</h1>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-lg">Organization Management</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-surface rounded-3xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center shadow-lg">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Plan</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{organization.metadata.planType}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-surface rounded-3xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Seats</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{organization.metadata.seatLimit}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-surface rounded-3xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                                        organization.metadata.isExpired
                                            ? 'bg-gradient-to-br from-red-500 to-rose-600'
                                            : 'bg-gradient-to-br from-emerald-500 to-green-600'
                                    }`}>
                                        {organization.metadata.isExpired ? (
                                            <XCircle className="w-6 h-6 text-white" />
                                        ) : (
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</p>
                                        <p className={`text-2xl font-bold ${
                                            organization.metadata.isExpired
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-emerald-600 dark:text-emerald-400'
                                        }`}>
                                            {organization.metadata.isExpired ? 'Expired' : 'Active'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Members Section */}
                        <div>
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold gradient-text">Team Members</h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">Active members in your organization</p>
                            </div>

                            <div className="table-container rounded-3xl p-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-200 dark:border-gray-700">
                                            <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Member</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Role</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Joined</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {organization.members?.map((member) => (
                                            <TableRow key={member.id} className="border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 shadow-lg ring-2 ring-white/50 dark:ring-gray-600/50">
                                                            <AvatarImage src={member.user.image} />
                                                            <AvatarFallback className="font-semibold bg-gradient-to-br from-gray-500 to-gray-700 text-white">
                                                                {member.user.name?.[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-semibold text-gray-900 dark:text-white">{member.user.name}</p>
                                                                {member.role === 'owner' && <Crown className="w-4 h-4 text-amber-500" />}
                                                            </div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">{member.user.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`font-medium px-3 py-1 rounded-full ${
                                                            member.role === 'owner' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                                            member.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                        }`}
                                                    >
                                                        {member.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {member.createdAt.toLocaleDateString()}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Invitations Section */}
                        <div>
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold gradient-text">Pending Invitations</h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">Outstanding invitations to join your organization</p>
                            </div>

                            <div className="table-container rounded-3xl p-6">
                                {organization.invitations?.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">No pending invitations</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-200 dark:border-gray-700">
                                                <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Email</TableHead>
                                                <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Role</TableHead>
                                                <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Status</TableHead>
                                                <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Expires</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {organization.invitations?.map((invite) => (
                                                <TableRow key={invite.id} className="border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg">
                                                                <User className="w-5 h-5 text-white" />
                                                            </div>
                                                            <p className="font-medium text-gray-900 dark:text-white">{invite.email}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className="font-medium px-3 py-1 rounded-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                                                        >
                                                            {invite.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={`font-medium px-3 py-1 rounded-full ${
                                                                invite.status === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                                                invite.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                            }`}
                                                        >
                                                            {invite.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            {invite.expiresAt.toLocaleDateString()}
                                                        </p>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
        </DropBack>
    );
}