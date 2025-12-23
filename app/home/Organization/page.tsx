"use client"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { trpc as api } from "@/lib/client"
import { Nav } from '@/components/Nav'
import React from 'react'
import DropBack from "@/components/DropBack"
import { OrgList } from "@/lib/ZodObject"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Building2, Plus, Search as SearchIcon, ArrowRight, Calendar } from "lucide-react"

export default function page() {
    const [open, setOpen] = React.useState(false)
    const [newOrganization, setNewOrganization] = React.useState("")
    const [seachText, setSearchText] = React.useState("")
    const ListOrg = api.organization.getOwnerOrganizations.useQuery(undefined, {})
    const [organizationList, setOrganizationList] = React.useState<OrgList[]>([])
    
    const createOrg = api.organization.createOrganization.useMutation({
        onSuccess(data) {
            if (data?.success) {
                toast.success(data.message, { id: "createOrg" })
                setOpen(false)
                setNewOrganization("")
                ListOrg.refetch()
            } else {
                toast.error(data.message, { id: "createOrg" })
            }
        },
        onError(err) {
            toast.error(err.message, { id: "createOrg" })
        },
        onMutate() {
            toast.loading("Creating organization...", { id: "createOrg" });
        }
    })

    React.useEffect(() => {
        const data = ListOrg.data
        if (data) {
            setOrganizationList(data)
        }
    }, [ListOrg.data])

    function Search() {
        if (seachText === "") {
            setOrganizationList(ListOrg.data || [])
            return
        }
        const data = ListOrg.data?.filter((item) => {
            return item.name.toLowerCase().includes(seachText.toLowerCase())
        })
        if (data) {
            setOrganizationList(data)
            setSearchText("")
        }
    }

    function CreateOrganization() {
        if (newOrganization === "") {
            toast.error("Organization name is required", { id: "createOrg" })
            return
        }
        createOrg.mutate({ name: newOrganization })
    }

    return (
        <>
            <DropBack is={ListOrg.isLoading || ListOrg.isFetching}>
                <Nav session={null} SignOut={() => { }} />

                <section className="flex flex-col p-6 gap-6 min-h-screen bg-transparent">
                    {/* Header / Actions Bar */}
                    <div className="
                        flex flex-col sm:flex-row gap-4 items-center justify-between
                        p-4 rounded-2xl
                        bg-white/40 dark:bg-black/40
                        backdrop-blur-[20px]
                        ring-1 ring-white/20 dark:ring-white/10
                        shadow-[0_4px_30px_rgba(0,0,0,0.05)]
                    ">
                        <div className="relative w-full sm:w-auto sm:min-w-[300px] group">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400 group-focus-within:text-[#2563eb] dark:group-focus-within:text-[#d8b4fe] transition-colors" />
                            <Input 
                                placeholder="Search by name..." 
                                value={seachText} 
                                onChange={(e) => setSearchText(e.target.value)} 
                                onKeyUp={(e) => { if (e.key === "Enter") { Search() } }} 
                                className="
                                    pl-9
                                    bg-white/50 dark:bg-white/5
                                    border-white/20 dark:border-white/10
                                    focus-visible:ring-[#2563eb]/40 dark:focus-visible:ring-[#d8b4fe]/40
                                    backdrop-blur-sm
                                    placeholder:text-slate-500
                                "
                            />
                        </div>

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button className="
                                    bg-[#2563eb]/80 hover:bg-[#2563eb] 
                                    dark:bg-[#d8b4fe]/80 dark:hover:bg-[#d8b4fe]
                                    text-white dark:text-slate-900
                                    backdrop-blur-md shadow-lg
                                    border border-white/20
                                    transition-all duration-300
                                ">
                                    <Plus className="mr-2 h-4 w-4" /> New Organization
                                </Button>
                            </PopoverTrigger>
                            
                            <PopoverContent className="
                                w-80 p-4 flex flex-col gap-3
                                bg-white/70 dark:bg-black/70
                                backdrop-blur-[20px]
                                border border-white/20 dark:border-white/10
                                shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                            ">
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">Create Organization</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Enter a name for your new workspace.
                                    </p>
                                </div>
                                <Input 
                                    placeholder="Organization Name" 
                                    value={newOrganization} 
                                    onChange={(e) => setNewOrganization(e.target.value)} 
                                    className="bg-white/50 dark:bg-white/5 border-white/20"
                                />
                                <Button 
                                    disabled={newOrganization === "" || createOrg.isPending} 
                                    onClick={CreateOrganization}
                                    className="bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#d8b4fe] dark:hover:bg-[#c084fc] text-white dark:text-black"
                                >
                                    {createOrg.isPending ? (<><Spinner className="mr-2" /> Creating...</>) : "Create"}
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Organization Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {organizationList.length > 0 ? (
                            organizationList.map((item) => {
                                return (
                                    <OrganizationCard 
                                        key={item.id} 
                                        {...item}
                                    />
                                )
                            })
                        ) : (
                            <div className="col-span-full">
                                <Empty className="
                                    bg-white/30 dark:bg-white/5 
                                    backdrop-blur-[10px] 
                                    border border-white/20 dark:border-white/10 
                                    rounded-3xl py-12
                                ">
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon" className="bg-white/50 dark:bg-white/10 p-4 rounded-full">
                                            <Building2 className="h-10 w-10 text-[#9333ea] dark:text-[#a855f7]" />
                                        </EmptyMedia>
                                        <EmptyTitle className="text-slate-800 dark:text-slate-100 mt-4">No Organization Found</EmptyTitle>
                                        <EmptyDescription className="text-slate-600 dark:text-slate-400">
                                            There is currently no organization created by you. Get started by creating one.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                    <EmptyContent>
                                        <Button 
                                            onClick={() => setOpen(true)}
                                            variant="outline"
                                            className="border-[#9333ea]/50 text-[#9333ea] hover:bg-[#9333ea]/10 dark:border-[#a855f7]/50 dark:text-[#a855f7] dark:hover:bg-[#a855f7]/10 bg-transparent"
                                        >
                                            Create Organization
                                        </Button>
                                    </EmptyContent>
                                </Empty>
                            </div>
                        )}
                    </div>
                </section>
            </DropBack>
        </>
    )
}

function OrganizationCard({ name, slug, id, logo, createdAt, currentSeats }: OrgList) {
    const date = new Date(createdAt);
    const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <Link href={`/home/Organization/${id}/${slug}`} className="block h-full">
            <Card className="
                h-full
                group relative overflow-hidden
                bg-white/40 dark:bg-black/20 
                backdrop-blur-[12px] 
                border-0 ring-1 ring-white/40 dark:ring-white/10
                shadow-[0_4px_30px_rgba(0,0,0,0.05)]
                hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)]
                hover:-translate-y-1
                transition-all duration-300 ease-out
            ">
                {/* Decorative Gradient Blob on Hover */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2563eb]/20 dark:bg-[#d8b4fe]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <CardContent className="p-6 flex flex-col h-full z-10 relative">
                    <div className="flex items-start justify-between mb-4">
                        <div className="
                            h-12 w-12 rounded-xl flex items-center justify-center
                            bg-gradient-to-br from-[#2563eb]/80 to-[#9333ea]/80 
                            dark:from-[#d8b4fe]/80 dark:to-[#a855f7]/80
                            text-white shadow-lg
                        ">
                            {logo ? (
                                <span className="font-bold text-lg">{logo.substring(0,2)}</span>
                            ) : (
                                <Building2 className="h-6 w-6 text-white dark:text-black" />
                            )}
                        </div>
                        <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/50 dark:bg-white/10 border border-white/20 text-slate-600 dark:text-slate-300">
                            {currentSeats} Seats
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1 truncate">
                        {name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 truncate font-mono bg-white/30 dark:bg-black/20 w-fit px-2 py-0.5 rounded">
                        @{slug}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1 group-hover:text-[#2563eb] dark:group-hover:text-[#d8b4fe] transition-colors">
                            Manage <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}