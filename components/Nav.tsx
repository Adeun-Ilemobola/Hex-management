import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient, Session } from '@/lib/auth-client'
import { 
    Bell, User, Settings, CreditCard, Users, 
    LogOut, Home, Building2, BarChart3, LucideIcon 
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CustomSVG from './Icon/logo'
import { Spinner } from './ui/spinner'

// --- Reusable Styles ---
// Centralized glassmorphism style to keep the code clean
const GLASS_BUTTON_CLASSES = "flex items-center text-base font-semibold px-6 py-3 rounded-xl bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.02] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40";

// --- Sub-Components ---

interface NavLinkProps {
    href: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

const NavLink = ({ href, icon: Icon, children }: NavLinkProps) => (
    <Link href={href} className={GLASS_BUTTON_CLASSES}>
        <Icon className="w-4 h-4 mr-2" />
        {children}
    </Link>
);

// --- Main Component ---

export function Nav({ }: { session: Session | null, SignOut: () => void }) {

    const router = useRouter()
    
    const { data: session, isPending } = authClient.useSession();
    const SignOut = authClient.signOut
    

    return (
        <nav className="sticky top-0 z-50 w-full h-20 bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] shadow-xl border-b border-white/15 dark:border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-full">
                <div className="flex items-center justify-between h-full">
                    
                    {/* Logo Section */}
                    <Link href="/" className="group flex items-center space-x-3 hover:scale-105 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40 rounded-xl">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative p-2 rounded-xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] border border-white/15 dark:border-white/5 group-hover:border-fuchsia-500/30 transition-all duration-300 shadow-lg">
                                <CustomSVG
                                    size={36}
                                    className="w-9 h-9"
                                    gradientFrom="#ec4899"
                                    gradientTo="#06b6d4"
                                    gradientDirection="diagonal"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 bg-clip-text text-transparent">
                                Hex
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold -mt-1">
                                Investment Platform
                            </span>
                        </div>
                    </Link>

                  
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLink href="/home" icon={Home}>Dashboard</NavLink>
                        <NavLink href="/home/Organization" icon={Building2}>Organization</NavLink>
                        <NavLink href="/analytics" icon={BarChart3}>Analytics</NavLink>
                    </div>

                    {/* User Section */}
                    {isPending ?(<>
                     <div className="flex items-center space-x-3 justify-center">  
                        <Spinner className="size-12" />
                     </div>

                    
                    </>) :(<>
                     <div className="flex items-center space-x-3">
                        {session ? (
                            <>
                                {/* Notification Button */}
                                <Button  
                                    variant={'ghost'}
                                    onClick={() => router.push("/home/message")}
                                    className="relative p-3 h-auto rounded-xl bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.02] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="sr-only">Notifications</span>
                                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full shadow-lg border border-white dark:border-slate-900"></div>
                                </Button>
                                
                                <UserCard
                                    user={{
                                        id: session.user.id,
                                        name: session.user.name || "",
                                        image: session.user.image || "",
                                        email: session.user.email || "",
                                    }}
                                    onLogout={() => SignOut()}
                                    onNavigate={(path) => router.push(path)}
                                />
                            </>
                        ) : (
                            <Link href="/login">
                                <Button 
                                    className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 text-white shadow-lg hover:brightness-110 active:brightness-95 px-8 py-6 font-bold text-base hover:scale-[1.02] transition-all duration-300 rounded-xl"
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                    
                    
                    </>)}



                   
                </div>
            </div>
        </nav>
    )
}

// --- User Card Component ---

interface UserCardProps {
    user: {
        id: string;
        name: string;
        image?: string | null;
        email?: string;
    };
    onLogout: () => void;
    onNavigate: (path: string) => void;
}

export function UserCard({ user, onLogout, onNavigate }: UserCardProps) {
    const handleLogout = () => {
        onLogout();
        onNavigate("/");
    };

    const firstInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="group flex items-center space-x-3 p-2 pr-4 rounded-xl bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.02] cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40 select-none">
                    <div className="relative">
                        <Avatar className="h-10 w-10 rounded-xl border-2 border-white/20 dark:border-white/10 group-hover:border-fuchsia-500/40 transition-all duration-300 shadow-lg">
                            <AvatarImage src={user.image || undefined} alt={user.name} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-500 text-white font-bold text-sm rounded-xl">
                                {firstInitial}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                    </div>
                    <div className="hidden lg:block text-left">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[100px]">
                            {user.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Investor
                        </p>
                    </div>
                </div>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
                align="end" 
                className="w-64 mt-2 p-3 bg-white/70 dark:bg-slate-900/75 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl"
            >
                {/* User info header */}
                <div className="p-3 mb-2 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-sky-500/10 rounded-xl border border-white/10 dark:border-white/5">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 rounded-xl shadow-md">
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-500 text-white font-bold rounded-xl text-xs">
                                {firstInitial}
                            </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email || "Active Investor"}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <UserDropdownItem href="/home/profile" icon={User} label="Profile" />
                    <UserDropdownItem href="/home/Settings" icon={Settings} label="Settings" />
                    
                    {/* Subscription trigger specifically requested */}
                    <div onClick={() => onNavigate("/home/subscription")}> 
                        <UserDropdownItem icon={CreditCard} label="Subscription" />
                    </div>

                    <UserDropdownItem href="/home/team" icon={Users} label="Team" />
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200/50 dark:border-white/5">
                    <DropdownMenuItem 
                        onClick={handleLogout}
                        className="p-3 rounded-xl bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-red-500/10 hover:border-red-500/20 hover:scale-[1.01] cursor-pointer transition-all duration-200 text-red-600 dark:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                    >
                        <div className="flex items-center w-full">
                            <div className="w-8 h-8 rounded-lg bg-red-500/20 backdrop-blur-[2px] flex items-center justify-center mr-3">
                                <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="font-medium">Logout</span>
                        </div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// Helper component for Dropdown Items to keep code clean
const UserDropdownItem = ({ href, icon: Icon, label }: { href?: string, icon: LucideIcon, label: string }) => {
    const Content = (
        <div className="flex items-center w-full">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-sky-500/10 backdrop-blur-[2px] flex items-center justify-center mr-3">
                <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
        </div>
    );

    const className = "p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/40 dark:hover:bg-slate-800/80 hover:scale-[1.01] cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40";

    return (
        <DropdownMenuItem className={className} asChild>
            {href ? <Link href={href}>{Content}</Link> : <div>{Content}</div>}
        </DropdownMenuItem>
    );
};