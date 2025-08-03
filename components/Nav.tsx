import { Session } from '@/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import CustomSVG from './Icon/logo'
import Link from 'next/link'


export function Nav({ session, SignOut }: { session: Session | null, SignOut: () => void }) {
    const router = useRouter()

    return (
        <nav className="sticky top-0 z-50 w-full h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-full">
                <div className="flex items-center justify-between h-full">
                    
                    {/* Logo Section */}
                    <Link href="/" className="group flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                            <div className="relative p-2 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 group-hover:border-blue-400 dark:group-hover:border-purple-500 transition-all duration-300">
                                <CustomSVG
                                    size={36}
                                    className="w-9 h-9"
                                    gradientFrom="#3B82F6"
                                    gradientTo="#8B5CF6"
                                    gradientDirection="diagonal"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Hex
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1">
                                Investment Platform
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link href="/home">
                            <Button 
                                variant="ghost" 
                                className="text-lg font-semibold px-6 py-3 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                            >
                                Dashboard
                            </Button>
                        </Link>
                        
                        <Link href="/properties">
                            <Button 
                                variant="ghost" 
                                className="text-lg font-semibold px-6 py-3 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
                            >
                                Properties
                            </Button>
                        </Link>

                        <Link href="/investments">
                            <Button 
                                variant="ghost" 
                                className="text-lg font-semibold px-6 py-3 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
                            >
                                Investments
                            </Button>
                        </Link>

                        <Link href="/analytics">
                            <Button 
                                variant="ghost" 
                                className="text-lg font-semibold px-6 py-3 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300"
                            >
                                Analytics
                            </Button>
                        </Link>
                    </div>

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <UserCard
                                id={session.user.id}
                                name={session.user.name}
                                Logout={SignOut}
                                img={session.user.image ? session.user.image : undefined}
                                go={() => router.push("/")}
                                sub={() => router.push("/home/subscription")}
                            />
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link href="/signup">
                                    <Button 
                                        variant="ghost" 
                                        className="text-lg font-semibold px-6 py-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                                <Button 
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
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
                <div className="group flex items-center space-x-3 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-300">
                    <div className="relative">
                        <Avatar className="h-12 w-12 rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-400 dark:group-hover:border-purple-500 transition-all duration-300 shadow-lg">
                            <AvatarImage src={img} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
                                {name.substring(0, 1).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Investor
                        </p>
                    </div>
                </div>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
                align="end" 
                className="w-64 mt-2 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-2xl"
            >
                <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 rounded-full">
                            <AvatarImage src={img} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                                {name.substring(0, 1).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Active Investor</p>
                        </div>
                    </div>
                </div>

                <div className="py-2">
                    <DropdownMenuItem className="p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all duration-200">
                        <Link href="/home/profile" className="flex items-center w-full">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                                <span className="text-blue-600 dark:text-blue-400 text-sm">👤</span>
                            </div>
                            <span className="font-medium">Profile</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all duration-200">
                        <Link href="/home/Settings" className="flex items-center w-full">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-3">
                                <span className="text-purple-600 dark:text-purple-400 text-sm">⚙️</span>
                            </div>
                            <span className="font-medium">Settings</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                        onClick={sub}
                        className="p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-all duration-200"
                    >
                        <div className="flex items-center w-full">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mr-3">
                                <span className="text-emerald-600 dark:text-emerald-400 text-sm">💳</span>
                            </div>
                            <span className="font-medium">Subscription</span>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer transition-all duration-200">
                        <div className="flex items-center w-full">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mr-3">
                                <span className="text-orange-600 dark:text-orange-400 text-sm">👥</span>
                            </div>
                            <span className="font-medium">Team</span>
                        </div>
                    </DropdownMenuItem>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <DropdownMenuItem 
                        onClick={() => {
                            Logout();
                            go();
                        }}
                        className="p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all duration-200 text-red-600 dark:text-red-400"
                    >
                        <div className="flex items-center w-full">
                            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center mr-3">
                                <span className="text-red-600 dark:text-red-400 text-sm">🚪</span>
                            </div>
                            <span className="font-medium">Logout</span>
                        </div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}