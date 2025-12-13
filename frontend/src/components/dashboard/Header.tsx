'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Search,
    Bell,
    ChevronDown,
    User,
    Settings,
    LogOut,
    Coins,
} from 'lucide-react';
import type { User as UserType } from '@/types';

interface DashboardHeaderProps {
    user: UserType | null;
    creditBalance?: number;
    onLogout?: () => void;
}

export function DashboardHeader({ user, creditBalance = 0, onLogout }: DashboardHeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="sticky top-0 z-30 h-16 bg-black/40 backdrop-blur-xl border-b border-white/[0.08]">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
                {/* Spacer for mobile hamburger */}
                <div className="w-12 lg:hidden" />

                {/* Search - hidden on mobile */}
                <div className="flex-1 max-w-xl hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ürün, işlem ara..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all"
                        />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Credits */}
                    <Link
                        href="/dashboard/credits"
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl text-amber-400 hover:from-amber-500/20 hover:to-orange-500/20 transition-all"
                    >
                        <Coins className="w-4 h-4" />
                        <span className="text-sm font-medium">{creditBalance}</span>
                    </Link>

                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                        {/* Badge */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-white">
                                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Kullanıcı'}
                                </p>
                                <p className="text-xs text-white/40">{user?.email}</p>
                            </div>
                            <ChevronDown className={cn(
                                'w-4 h-4 text-white/40 transition-transform',
                                isProfileOpen && 'rotate-180'
                            )} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileOpen(false)}
                                    />

                                    {/* Dropdown */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-56 py-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-white/10">
                                            <p className="text-sm font-medium text-white truncate">
                                                {user?.email}
                                            </p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/dashboard/settings"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                Profil
                                            </Link>
                                            <Link
                                                href="/dashboard/settings"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Ayarlar
                                            </Link>
                                        </div>

                                        <div className="pt-1 border-t border-white/10">
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    onLogout?.();
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Çıkış Yap
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
