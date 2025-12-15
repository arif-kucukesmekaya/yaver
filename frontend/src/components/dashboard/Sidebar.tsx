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
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Ürünler', href: '/dashboard/products', icon: Package },
    { label: 'Krediler', href: '/dashboard/credits', icon: CreditCard },
    { label: 'Ayarlar', href: '/dashboard/settings', icon: Settings },
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
        <div className="flex flex-col h-full bg-[#0c0c0f]">
            {/* Logo */}
            <div className="h-16 px-5 flex items-center justify-between">
                <AnimatePresence mode="wait">
                    {(!isCollapsed || isMobile) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Image
                                src="/yaver-logo.png"
                                alt="Yaver Logo"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span className="text-lg font-semibold text-white">yaver</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isMobile ? (
                    <button onClick={() => setIsMobileOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 text-zinc-500 hover:text-white transition-colors hidden lg:flex"
                    >
                        <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
                    </button>
                )}
            </div>

            {/* Create Button */}
            <div className="px-3 mb-2">
                <Link href="/dashboard/products/new" onClick={() => isMobile && setIsMobileOpen(false)}>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm",
                            "bg-blue-500 text-white hover:bg-blue-600 transition-colors",
                            "shadow-lg shadow-blue-500/20",
                            isCollapsed && !isMobile && "justify-center px-3"
                        )}
                    >
                        <Plus className="w-4 h-4" />
                        {(!isCollapsed || isMobile) && <span>Yeni Ürün</span>}
                    </motion.div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
                <p className={cn(
                    "text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-3 px-3",
                    isCollapsed && !isMobile && "hidden"
                )}>
                    Menü
                </p>
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href));

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => isMobile && setIsMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm relative group",
                                        isActive
                                            ? "bg-zinc-800/80 text-white"
                                            : "text-zinc-400 hover:text-white hover:bg-zinc-800/40",
                                        isCollapsed && !isMobile && "justify-center"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full"
                                        />
                                    )}
                                    <item.icon className={cn(
                                        "w-[18px] h-[18px] transition-colors",
                                        isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"
                                    )} />
                                    {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-zinc-800/50">
                <button
                    onClick={() => {
                        if (isMobile) setIsMobileOpen(false);
                        onLogout?.();
                    }}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
                        "text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all",
                        isCollapsed && !isMobile && "justify-center"
                    )}
                >
                    <LogOut className="w-[18px] h-[18px]" />
                    {(!isCollapsed || isMobile) && <span>Çıkış Yap</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-zinc-900/90 backdrop-blur border border-zinc-800 text-white lg:hidden"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 z-50 h-screen w-[260px] border-r border-zinc-800 lg:hidden"
                    >
                        <SidebarContent isMobile />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 72 : 260 }}
                transition={{ duration: 0.2 }}
                className="h-screen sticky top-0 border-r border-zinc-800/50 hidden lg:block"
            >
                <SidebarContent />
            </motion.aside>
        </>
    );
}
