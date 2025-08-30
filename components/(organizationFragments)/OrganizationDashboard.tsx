"use client";
import React, { useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    UserPlus,
    Users,
    Shield,
    Mail,
    Crown,
    Clock,
   
    User,
   
    Search,
    Calendar,
    Sparkles,
    Package,
    Building2,
    Plus,
    CheckCircle,
    XCircle,
    Ban,
    Hourglass,
    AlertCircle,
} from "lucide-react";
import { InvitationStatus, OrganizationX, Role } from "@/lib/Zod";
import { toast } from "sonner";
import { api } from "@/lib/trpc";
import z from "zod";
import InputBox, { SelectorBox } from "../InputBox";
import { useSearchParams } from "next/navigation";
import Loading from "../Loading";



type selectedCardType = {
    name: string;
    role: Role;
    email: string,
    id: string
}

const getRoleIcon = (role: string) => {
    switch (role) {
        case 'owner': return <Crown className="w-4 h-4" />;
        case 'admin': return <Shield className="w-4 h-4" />;
        default: return <User className="w-4 h-4" />;
    }
};





export default function OrganizationDashboard() {
    const searchParams = useSearchParams()
    const OrgId = searchParams.get('id')
    const slug = searchParams.get('slug')
    const { data: getOrganization, isPending } = api.organization.getOrganization.useQuery({ id: OrgId || '', slug: slug || '' })
    const organization = getOrganization?.value


    const [selectedCard, setSelectedCard] = useState<selectedCardType | null>(null);
    const [memberFilter, setMemberFilter] = useState('');
    const [invitationFilter, setInvitationFilter] = useState('');
    const [showAddUser, setShowAddUser] = useState(false)
    const [showMemberUpdate, setShowMemberUpdate] = useState(false)

    // Filter members based on email
    const filteredMembers = useMemo(() => {
        if (!organization) return [];
        return organization.members.filter(member =>
            member.user.email.toLowerCase().includes(memberFilter.toLowerCase())
        );
    }, [organization, memberFilter]);

    // Filter invitations based on email
    const filteredInvitations = useMemo(() => {
        if (!organization) return [];
        return organization.invitations.filter(invitation =>
            invitation.email.toLowerCase().includes(invitationFilter.toLowerCase())
        );
    }, [organization, invitationFilter]);

    // function daysLeft(org: OrganizationX | null | undefined) {
    //     if (org && org.metadata) {
    //         const activeSubscription = org.metadata
    //         const trialEnd = DateTime.fromJSDate(new Date(activeSubscription.trialEnd || DateTime.local().toJSDate())).diff(DateTime.local()).days
    //         const periodEnd = DateTime.fromJSDate(new Date(activeSubscription.periodEnd || DateTime.local().toJSDate())).diff(DateTime.local()).days
    //         const daysLeft = activeSubscription.status === "trialing" ? trialEnd : periodEnd
    //         console.log({
    //             trialEnd,
    //             periodEnd,
    //             daysLeft,
    //             activeSubscription
    //         });
            
    //         return daysLeft
    //     }
    //     return 0


    // }




    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'trialing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'past_due': return 'bg-red-500/10 text-red-600 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    if (!organization || isPending) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loading full={false} />
            </div>
        );
    }




    return (
        <div className="flex-1 gap-2.5 flex flex-col">
            {/* Part 1: Action Buttons */}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 dark:border-white/10 p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Organization Dashboard
                    </h1>
                    <div className="flex gap-3">
                        <Button onClick={() => {
                            setShowMemberUpdate(false)
                            setShowAddUser(true)
                        }}
                            className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <UserPlus className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">Start Onboarding</span>
                        </Button>
                        <Button className="group px-6 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-100 rounded-xl font-semibold shadow-md hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span>Add Existing Users</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Part 2: Organization Information */}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 dark:border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Organization Details</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/70">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Organization Name</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-slate-100">{organization.name}</p>
                                </div>
                                <Sparkles className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                                    <span className="text-sm text-gray-600 dark:text-slate-300">
                                        Plan: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{organization.metadata?.plan || 'Free'}</span>
                                    </span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(organization.metadata?.status || 'active')}`}>
                                    {organization.metadata?.status || 'active'}
                                </div>
                            </div>
                        </div>

                        {organization.metadata?.daysLeft !== undefined && (
                            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm text-gray-700 dark:text-slate-200">Billing Period</span>
                                    </div>
                                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{organization.metadata?.daysLeft} days left</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Limits */}
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-3">Usage Limits</p>
                        <div className="grid grid-cols-2 gap-3">
                            {organization.metadata?.limits && Object.entries(organization.metadata.limits).slice(0, 4).map(([key, value]) => (
                                <div key={key} className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-gray-200 dark:border-slate-700/70">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-slate-100">
                                        {key === 'orgMembers' ? `${organization.members.length}/${value}` : value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Part 3: Members List */}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 dark:border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Team Members ({filteredMembers.length})</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Filter by email..."
                            value={memberFilter}
                            onChange={(e) => setMemberFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="grid gap-3">
                    {filteredMembers.map((member) => (
                        <MemberCardView
                            key={member.id}
                            data={member}
                            onclick={() => {
                                setShowAddUser(false)
                                setSelectedCard({
                                    id: member.id,
                                    name: member.user.name,
                                    email: member.user.email,
                                    role: member.role
                                })
                                setShowMemberUpdate(true)
                            }}
                        />

                        // <ContextMenu
                        //     key={member.id}

                        // >
                        //     <ContextMenuTrigger>

                        //     </ContextMenuTrigger>
                        //     <ContextMenuContent
                        //     className=" 
                        //     bg-indigo-50 dark:bg-slate-900/10
                        //     bg-gradient-to-r 
                        //     from-indigo-50 to-blue-50 
                        //     dark:from-indigo-900/35 dark:to-blue-900/55 
                        //     rounded-md border 
                        //     border-gray-200 dark:border-slate-700/70 hover:border-indigo-300 
                        //     dark:hover:border-indigo-500 transition-all duration-200
                        //     backdrop-blur-3xl
                        //     "

                        //     >
                        //         <ContextMenuItem>Profile</ContextMenuItem>
                        //         <ContextMenuItem>Billing</ContextMenuItem>
                        //         <ContextMenuItem>Team</ContextMenuItem>
                        //         <ContextMenuItem >Subscription</ContextMenuItem>
                        //     </ContextMenuContent>
                        // </ContextMenu>
                    ))}
                </div>
            </div>

            {/* Part 4: Invitations */}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 dark:border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Invitations ({filteredInvitations.length})</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Filter by email..."
                            value={invitationFilter}
                            onChange={(e) => setInvitationFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="grid gap-3">
                    {filteredInvitations.map((invitation) => (

                        <InvitationCard
                            key={invitation.id}
                            data={invitation}

                        />
                    ))}
                </div>
            </div>
            <AddMemberDialog
                isOpen={showAddUser}
                onClose={(v) => {
                    setShowAddUser(v)
                    setSelectedCard(null)

                }}
                organizationId={organization.id}
                maxMembersReached={(organization.members.length + 1) >= (organization.metadata?.limits?.orgMembers || 0)}
                reLoadData={() => {

                }}
            />


            {selectedCard && (
                <UpdateMemberDialog
                    isOpen={showMemberUpdate}
                    onClose={(v) => {
                        setShowMemberUpdate(v)
                        setSelectedCard(null)
                    }}
                    member={selectedCard}
                    organizationId={organization.id}
                    organizationName={organization.name}
                />
            )}
        </div>
    );


}

type invitationType = {
    data: {
        id: string;
        organizationId: string;
        email: string;
        role: Role;
        status: InvitationStatus;
        inviterId: string;
        expiresAt: Date | string;
    }


}

function InvitationCard(data: invitationType) {
    const { data: invitation } = data
    const getStatusIcon = (status: InvitationStatus) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'accepted': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'canceled': return <Ban className="w-4 h-4 text-gray-500" />;
            case 'expired': return <Hourglass className="w-4 h-4 text-orange-500" />;
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };
    return (
        <div
            className="group p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 rounded-xl border border-gray-200 dark:border-slate-700/70 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-200"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white shadow-md">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-slate-100">{invitation.email}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-500 dark:text-slate-400">Role: {invitation.role}</span>
                            <span className="text-sm text-gray-400 dark:text-slate-600">•</span>
                            <span className="text-sm text-gray-500 dark:text-slate-400">
                                Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {getStatusIcon(invitation.status)}
                    <span className="text-sm font-medium capitalize text-gray-700 dark:text-slate-200">{invitation.status}</span>
                </div>
            </div>
        </div>

    )

}
type MemberCardViewType = {
    data: {
        id: string;
        organizationId: string;
        role: Role;
        createdAt: Date | string;
        userId: string;
        user: {
            email: string;
            name: string;
            image?: string | undefined;
        };
    }
    onclick: () => void


}

function MemberCardView(data: MemberCardViewType) {
    const { data: member, onclick } = data


    return (
        <div
            onClick={onclick}

            className="group p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-900/20 dark:hover:to-blue-900/20 rounded-xl border border-gray-200 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                        {member.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-slate-100">{member.user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{member.user.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    {getRoleIcon(member.role)}
                    <span className="text-sm font-medium capitalize text-gray-700 dark:text-slate-200">{member.role}</span>
                </div>
            </div>
        </div>
    )

}



interface AddMemberDialogProps {
    isOpen: boolean;
    onClose: (value: boolean) => void;
    organizationId: string;
    reLoadData: () => void;
    maxMembersReached: boolean
}

interface UpdateMemberDialogProps {
    isOpen: boolean;
    onClose: (value: boolean) => void;
    organizationId: string;
    organizationName: string;
    member: selectedCardType,


}


function AddMemberDialog({ isOpen, onClose, organizationId, reLoadData , maxMembersReached }: AddMemberDialogProps) {

    const zNewMember = z.object({
        email: z.string().email(),
        role: z.enum(["member", "admin", "owner"]),
        name: z.string().min(1, "Name is required"),
    });
    const [formData, setFormData] = React.useState({
        email: '',
        role: 'member',
        name: ''
    });

    const onboardUser = api.organization.onboardUserToOrg.useMutation({
        onMutate() {
            toast.loading('Adding member...', { id: 'add-member' });
        },
        onSuccess(data) {
            if (data && data.success) {
                toast.success(data.message, { id: 'add-member' });
                onClose(false);
                reLoadData();
            } else {
                toast.error(data.message, { id: 'add-member' });
            }
        },
        onError(error) {
            toast.error(error.message || 'Failed to add member.', { id: 'add-member' });
            console.log(error);
        }
    });


    function handleAddMember() {
        if (maxMembersReached) {
            toast.error('Maximum number of members reached.', { id: 'add-member' });
            return;
        }
        const validation = zNewMember.safeParse(formData);
        if (!validation.success) {
            if (validation.error.errors) {
                validation.error.errors.forEach(error => {
                    toast.error(error.message, { id: 'add-member' });
                });
            }
            return;
        }
        onboardUser.mutate({
            name: formData.name,
            email: formData.email,
            organizationId,
            role: formData.role as "member" | "admin" | "owner"
        });

    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}  >
            <DialogOverlay className="fixed inset-0 min-h-screen backdrop-blur-md bg-fuchsia-400/30 dark:bg-fuchsia-900/30 " />
            <DialogContent
                className="bg-white/80 dark:bg-slate-900/20 backdrop-blur-lg rounded-xl shadow-xl border border-white/15 dark:border-white/5 "

            >
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                    <DialogDescription>
                        Please enter the email address of the new member you want to add.
                    </DialogDescription>
                </DialogHeader>


                <div className='flex flex-col  gap-5'>
                    <InputBox
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e })}
                        placeholder='Email address'
                        label="Email"
                        disabled={onboardUser.isPending}
                    />
                    <InputBox
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e })}
                        placeholder='Name'
                        label="Name"
                        disabled={onboardUser.isPending}
                    />
                    <SelectorBox
                        value={formData.role}
                        setValue={(e) => setFormData({ ...formData, role: e })}
                        options={[
                            { value: 'member', label: 'Member' },
                            { value: 'admin', label: 'Admin' },
                            // { value: 'owner', label: 'Owner' },
                        ]}
                        label="Role"
                        ClassName="w-full"
                        isDisable={onboardUser.isPending}
                    />


                </div>

                <DialogFooter >
                    <Button disabled={onboardUser.isPending} onClick={handleAddMember} className='ml-auto'>
                        {onboardUser.isPending ? 'Adding...' : 'Add Member'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

function UpdateMemberDialog({ isOpen, onClose, organizationId, organizationName, member }: UpdateMemberDialogProps) {
    const switchRole = api.organization.updateMemberRole.useMutation({
        onMutate() {
            toast.loading('Updating member...', { id: 'update-member' });
        },
        onSuccess(data) {
            if (data && data.success) {
                toast.success(data.message, { id: 'update-member' });
                onClose(false);
            } else {
                toast.error(data.message, { id: 'update-member' });
            }
        },
        onError(error) {
            toast.error(error.message || 'Failed to update member.', { id: 'update-member' });
            console.log(error);
        }

    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}  >
            <DialogOverlay className="fixed inset-0 min-h-screen backdrop-blur-md bg-fuchsia-400/30 dark:bg-fuchsia-900/30 " />
            <DialogContent
                className="bg-white/80 dark:bg-slate-900/20 backdrop-blur-lg rounded-xl shadow-xl border border-white/15 dark:border-white/5 p-6 "

            >
                <div className='flex flex-col  gap-6'>
                    <div
                        className="group p-4   rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 "
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-slate-100">{member.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                {getRoleIcon(member.role)}
                                <span className="text-sm font-medium capitalize text-gray-700 dark:text-slate-200">{member.role}</span>
                            </div>
                        </div>
                    </div>


                    <div className='flex flex-row  gap-3 justify-center '>
                        {member.role === "owner" ? (
                            <h1 className='text-2xl font-semibold text-gray-800 dark:text-slate-100'>
                                owner cannot be updated
                            </h1>

                        ) : (
                            <>
                                <Button
                                    disabled={switchRole.isPending}
                                    onClick={() => switchRole.mutate({ organizationId: organizationId, memberId: member.id, ActionType: "admin", organizationName: organizationName, memberEmail: member.email, memberName: member.name })}
                                    size={"lg"}
                                >set as  admin</Button>
                                <Button
                                    disabled={switchRole.isPending}
                                    onClick={() => switchRole.mutate({ organizationId: organizationId, memberId: member.id, ActionType: "member", organizationName: organizationName, memberEmail: member.email, memberName: member.name })}
                                    size={"lg"} >set as  member</Button>
                                <Button
                                    disabled={switchRole.isPending}
                                    onClick={() => switchRole.mutate({ organizationId: organizationId, memberId: member.id, ActionType: "remove", organizationName: organizationName, memberEmail: member.email, memberName: member.name })}

                                    size={"lg"} variant='destructive'>remove member</Button>

                            </>
                        )}

                    </div>




                </div>

            </DialogContent>
        </Dialog>
    )

}

