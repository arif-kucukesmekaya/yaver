'use client';

import { useState, useRef, useEffect } from 'react';
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
    Sparkles,
} from 'lucide-react';
import type { User as UserType, UserCredits } from '@/types';

interface DashboardHeaderProps {
    user: UserType | null;
    creditBalance?: number | UserCredits;
    onLogout?: () => void;
}

export function DashboardHeader({ user, creditBalance = 0, onLogout }: DashboardHeaderProps) {
    const displayBalance = typeof creditBalance === 'number' ? creditBalance : (creditBalance?.available || 0);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const initials = user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U';
    const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Kullanıcı';

    return (
        <header className="sticky top-0 z-30 h-16 bg-[#0c0c0f]/80 backdrop-blur-xl border-b border-zinc-800/50">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
                <div className="w-12 lg:hidden" />

                {/* Search */}
                <div className="flex-1 max-w-lg hidden md:block">
                    <div className="relative group">
                        <Search className={cn(
                            "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                            isSearchFocused ? "text-blue-400" : "text-zinc-500"
                        )} />
                        <input
                            ref={searchRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            placeholder="Ürün veya işlem ara..."
                            className={cn(
                                "w-full pl-10 pr-20 py-2.5 rounded-xl text-sm transition-all",
                                "bg-zinc-900/50 text-white placeholder:text-zinc-600",
                                "border",
                                isSearchFocused
                                    ? "border-blue-500/50 ring-2 ring-blue-500/10"
                                    : "border-zinc-800 hover:border-zinc-700"
                            )}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-zinc-800/80 rounded-md">
                            <kbd className="text-[10px] text-zinc-400 font-medium">⌘</kbd>
                            <kbd className="text-[10px] text-zinc-400 font-medium">K</kbd>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Credits */}
                    <Link href="/dashboard/credits">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/30 transition-colors"
                        >
                            <div className="p-1 bg-amber-500/20 rounded-lg">
                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <span className="text-sm font-semibold text-amber-400">{displayBalance}</span>
                        </motion.div>
                    </Link>

                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all">
                        <Bell className="w-[18px] h-[18px]" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#0c0c0f]" />
                    </button>

                    {/* Profile */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-zinc-800/50 transition-colors"
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-blue-500/20">
                                {initials}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-white leading-tight">{displayName}</p>
                                <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    {user?.subscription?.plan || 'Free'} Plan
                                </p>
                            </div>
                            <ChevronDown className={cn(
                                "w-4 h-4 text-zinc-500 transition-transform hidden md:block",
                                isProfileOpen && "rotate-180"
                            )} />
                        </motion.button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/20 z-50 overflow-hidden"
                                    >
                                        {/* User Info */}
                                        <div className="p-4 bg-gradient-to-br from-blue-500/5 to-transparent border-b border-zinc-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{displayName}</p>
                                                    <p className="text-xs text-zinc-500 truncate max-w-[140px]">{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu */}
                                        <div className="py-2">
                                            <Link
                                                href="/dashboard/settings"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                Profil
                                            </Link>
                                            <Link
                                                href="/dashboard/settings"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Ayarlar
                                            </Link>
                                        </div>

                                        <div className="border-t border-zinc-800 py-2">
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
