import { Session } from '@/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import CustomSVG from './Icon/logo'
import Link from 'next/link'
import { Bell, User, Settings, CreditCard, Users, LogOut, Home, Building2, BarChart3 } from 'lucide-react'

export function Nav({ session, SignOut }: { session: Session | null, SignOut: () => void }) {
    const router = useRouter()

    return (
        <nav className="sticky top-0 z-50 w-full h-20 bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] shadow-xl border-b border-white/15 dark:border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-full">
                <div className="flex items-center justify-between h-full">
                    
                    {/* Logo Section */}
                    <Link href="/" className="group flex items-center space-x-3 hover:scale-105 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40 rounded-xl">
                        <div className="relative">
                            {/* Aurora glow effect */}
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

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link href="/home">
                            <Button 
                                variant="ghost" 
                                className="text-base font-semibold px-6 py-3 rounded-xl bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.02] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>
                        
                        <Link href="/properties">
                            <Button 
                                variant="ghost" 
                                className="text-base font-semibold px-6 py-3 rounded-xl bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.02] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40"
                            >
                                <Building2 className="w-4 h-4 mr-2" />
                                Properties
                            </Button>
                        </Link>
                        <Link href="/analytics">
                            <Button 
                                variant="ghost" 
                                className="text-base font-semibold px-6 py-3 rounded-xl bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.02] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40"
                            >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Analytics
                            </Button>
                        </Link>
                    </div>

                    {/* User Section */}
                    <div className="flex items-center space-x-3">
                        {session ? (
                            <>
                                <Button  
                                    variant={'ghost'}
                                    onClick={() => router.push("/home/chat")}
                                    className="relative p-3 rounded-xl bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.02] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40"
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="sr-only">Notifications</span>
                                    {/* Notification badge */}
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full shadow-lg"></div>
                                </Button>
                                
                                <UserCard
                                    id={session.user.id}
                                    name={session.user.name}
                                    Logout={SignOut}
                                    img={session.user.image ? session.user.image : undefined}
                                    go={() => router.push("/")}
                                    sub={() => router.push("/home/subscription")}
                                />
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Button 
                                    className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 text-white shadow-lg hover:brightness-110 active:brightness-95 px-8 py-3 font-bold text-base hover:scale-[1.02] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40 rounded-xl"
                                    onClick={() => router.push("/login")}
                                >
                                    Login
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default function UserCard({ go, img, Logout, name, sub }: { name: string, img: string | undefined, id: string, Logout: () => void, go: () => void, sub: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="group flex items-center space-x-3 p-2 rounded-xl bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.02] cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40">
                    <div className="relative">
                        <Avatar className="h-12 w-12 rounded-xl border-2 border-white/20 dark:border-white/10 group-hover:border-fuchsia-500/40 transition-all duration-300 shadow-lg">
                            <AvatarImage src={img} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-500 text-white font-bold text-lg rounded-xl">
                                {name.substring(0, 1).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Investor
                        </p>
                    </div>
                </div>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
                align="end" 
                className="w-64 mt-2 p-3 bg-white/70 dark:bg-slate-900/75 backdrop-blur-[2px] border border-white/15 dark:border-white/5 shadow-xl rounded-xl"
            >
                {/* User info header */}
                <div className="p-3 mb-2 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 rounded-xl border border-white/10 dark:border-white/5">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 rounded-xl shadow-lg">
                            <AvatarImage src={img} />
                            <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-500 text-white font-bold rounded-xl">
                                {name.substring(0, 1).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">{name}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Active Investor</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <DropdownMenuItem className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.01] cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40">
                        <Link href="/home/profile" className="flex items-center w-full">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-[2px] flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-200">Profile</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.01] cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40">
                        <Link href="/home/Settings" className="flex items-center w-full">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-sky-500/20 backdrop-blur-[2px] flex items-center justify-center mr-3">
                                <Settings className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-200">Settings</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                        onClick={sub}
                        className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.01] cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40"
                    >
                        <div className="flex items-center w-full">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-sky-500/20 to-pink-500/20 backdrop-blur-[2px] flex items-center justify-center mr-3">
                                <CreditCard className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-200">Subscription</span>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:scale-[1.01] cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40">
                        <div className="flex items-center w-full">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-[2px] flex items-center justify-center mr-3">
                                <Users className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-200">Team</span>
                        </div>
                    </DropdownMenuItem>
                </div>

                <div className="pt-2 mt-2 border-t border-white/10 dark:border-white/5">
                    <DropdownMenuItem 
                        onClick={() => {
                            Logout();
                            go();
                        }}
                        className="p-3 rounded-xl bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] border border-white/10 dark:border-white/5 hover:bg-red-500/20 hover:border-red-500/30 hover:scale-[1.01] cursor-pointer transition-all duration-200 text-red-600 dark:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
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