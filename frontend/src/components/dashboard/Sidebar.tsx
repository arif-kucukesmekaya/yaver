'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    CreditCard,
    Settings,
    ChevronLeft,
    ChevronRight,
    Plus,
    LogOut,
    Sparkles,
    Menu,
    X,
} from 'lucide-react';

const navItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        label: 'Ürünler',
        href: '/dashboard/products',
        icon: Package,
    },
    {
        label: 'Krediler',
        href: '/dashboard/credits',
        icon: CreditCard,
    },
    {
        label: 'Ayarlar',
        href: '/dashboard/settings',
        icon: Settings,
    },
];

interface SidebarProps {
    onLogout?: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/[0.08]">
                <AnimatePresence mode="wait">
                    {(!isCollapsed || isMobile) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Link
                                href="/dashboard"
                                className="text-2xl font-bold text-white"
                                style={{ fontFamily: 'var(--font-space), system-ui, sans-serif' }}
                            >
                                yaver
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isMobile ? (
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors hidden lg:flex"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>

            {/* Quick Action */}
            <div className="p-4">
                <Link
                    href="/dashboard/products/new"
                    onClick={() => isMobile && setIsMobileOpen(false)}
                    className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                        'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
                        'hover:from-indigo-600 hover:to-purple-600',
                        'shadow-lg shadow-indigo-500/25',
                        isCollapsed && !isMobile && 'justify-center px-3'
                    )}
                >
                    <Plus className="w-5 h-5" />
                    <AnimatePresence mode="wait">
                        {(!isCollapsed || isMobile) && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="whitespace-nowrap overflow-hidden"
                            >
                                Yeni Ürün
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3">
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
                                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                                        isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white',
                                        isCollapsed && !isMobile && 'justify-center px-3'
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <AnimatePresence mode="wait">
                                        {(!isCollapsed || isMobile) && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="whitespace-nowrap overflow-hidden"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {isActive && (!isCollapsed || isMobile) && (
                                        <Sparkles className="w-4 h-4 ml-auto text-indigo-400" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/[0.08]">
                <button
                    onClick={() => {
                        if (isMobile) setIsMobileOpen(false);
                        onLogout?.();
                    }}
                    className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                        'text-white/40 hover:bg-red-500/10 hover:text-red-400',
                        isCollapsed && !isMobile && 'justify-center px-3'
                    )}
                >
                    <LogOut className="w-5 h-5" />
                    <AnimatePresence mode="wait">
                        {(!isCollapsed || isMobile) && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="whitespace-nowrap overflow-hidden"
                            >
                                Çıkış Yap
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="fixed top-4 left-4 z-40 p-3 rounded-xl bg-black/80 border border-white/[0.08] text-white lg:hidden"
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
                        className="fixed left-0 top-0 z-50 h-screen w-[280px] bg-black border-r border-white/[0.08] flex flex-col lg:hidden"
                    >
                        <SidebarContent isMobile />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="h-screen sticky top-0 bg-black/40 border-r border-white/[0.08] flex-col hidden lg:flex"
            >
                <SidebarContent />
            </motion.aside>
        </>
    );
}
