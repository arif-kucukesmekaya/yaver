'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
    LayoutDashboard,
    Package,
    CreditCard,
    Settings,
    ChevronLeft,
    Plus,
    LogOut,
    Menu,
    X,
    Sparkles,
    Zap,
    Crown,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, emoji: '📊' },
    { label: 'Ürünler', href: '/dashboard/products', icon: Package, emoji: '📦' },
    { label: 'Krediler', href: '/dashboard/credits', icon: CreditCard, emoji: '💳' },
    { label: 'Ayarlar', href: '/dashboard/settings', icon: Settings, emoji: '⚙️' },
];

interface SidebarProps {
    onLogout?: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="flex flex-col h-full bg-gradient-to-b from-[#0c0c0f] to-[#0a0a0d] relative overflow-hidden">
            {/* Ambient glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-violet-500/5 to-transparent pointer-events-none" />

            {/* Logo Section */}
            <div className="relative z-10 h-16 px-4 flex items-center justify-between border-b border-white/[0.03]">
                <AnimatePresence mode="wait">
                    {(!isCollapsed || isMobile) && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-3"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl blur-lg opacity-50" />
                                <Image
                                    src="/yaver-logo.png"
                                    alt="Yaver Logo"
                                    width={36}
                                    height={36}
                                    className="relative rounded-xl shadow-lg"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-bold text-white tracking-tight">yaver</span>
                                <span className="text-[10px] text-zinc-500 font-medium -mt-0.5">AI Pilot</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isMobile ? (
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all hidden lg:flex"
                    >
                        <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
                    </motion.button>
                )}
            </div>

            {/* Create Button - Hero Action */}
            <div className="relative z-10 px-3 pt-4 pb-2">
                <Link href="/dashboard/products/new" onClick={() => isMobile && setIsMobileOpen(false)}>
                    <motion.div
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                            "relative flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm overflow-hidden",
                            "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
                            "shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
                            "transition-all duration-300",
                            isCollapsed && !isMobile && "justify-center px-3"
                        )}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />

                        <div className="relative flex items-center justify-center w-5 h-5">
                            <Plus className="w-4 h-4" />
                        </div>
                        {(!isCollapsed || isMobile) && (
                            <span className="relative font-semibold">Yeni Ürün Ekle</span>
                        )}
                    </motion.div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex-1 px-3 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {(!isCollapsed || isMobile) && (
                    <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3 px-3">
                        Ana Menü
                    </p>
                )}
                <ul className="space-y-1">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href));

                        return (
                            <motion.li
                                key={item.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => isMobile && setIsMobileOpen(false)}
                                    className={cn(
                                        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm",
                                        isActive
                                            ? "bg-white/[0.08] text-white"
                                            : "text-zinc-400 hover:text-white hover:bg-white/[0.04]",
                                        isCollapsed && !isMobile && "justify-center"
                                    )}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-full shadow-lg shadow-blue-500/50"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Icon with glow effect for active state */}
                                    <div className="relative">
                                        {isActive && (
                                            <div className="absolute inset-0 bg-blue-500 rounded-lg blur-md opacity-30" />
                                        )}
                                        <div className={cn(
                                            "relative p-1.5 rounded-lg transition-all duration-200",
                                            isActive
                                                ? "bg-blue-500/10"
                                                : "bg-transparent group-hover:bg-white/5"
                                        )}>
                                            <item.icon className={cn(
                                                "w-[18px] h-[18px] transition-all duration-200",
                                                isActive
                                                    ? "text-blue-400"
                                                    : "text-zinc-500 group-hover:text-zinc-300"
                                            )} />
                                        </div>
                                    </div>

                                    {(!isCollapsed || isMobile) && (
                                        <span className={cn(
                                            "font-medium transition-all",
                                            isActive && "text-white"
                                        )}>
                                            {item.label}
                                        </span>
                                    )}

                                    {/* Hover arrow indicator */}
                                    {(!isCollapsed || isMobile) && !isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -5 }}
                                            className="ml-auto opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5 rotate-180 text-zinc-600" />
                                        </motion.div>
                                    )}
                                </Link>
                            </motion.li>
                        );
                    })}
                </ul>
            </nav>



            {/* Footer - Logout */}
            <div className="relative z-10 p-3 border-t border-white/[0.03]">
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                        if (isMobile) setIsMobileOpen(false);
                        onLogout?.();
                    }}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                        "text-zinc-500 hover:text-red-400 hover:bg-red-500/5",
                        isCollapsed && !isMobile && "justify-center"
                    )}
                >
                    <div className="p-1.5 rounded-lg bg-transparent group-hover:bg-red-500/10 transition-colors">
                        <LogOut className="w-[18px] h-[18px]" />
                    </div>
                    {(!isCollapsed || isMobile) && <span className="font-medium">Çıkış Yap</span>}
                </motion.button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileOpen(true)}
                className="fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 text-white lg:hidden shadow-lg"
            >
                <Menu className="w-5 h-5" />
            </motion.button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.aside
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 z-50 h-screen w-[280px] shadow-2xl shadow-black/50 lg:hidden"
                    >
                        <SidebarContent isMobile />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="h-screen sticky top-0 border-r border-white/[0.03] hidden lg:block"
            >
                <SidebarContent />
            </motion.aside>
        </>
    );
}
