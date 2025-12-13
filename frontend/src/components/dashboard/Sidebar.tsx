'use client';

import { useState } from 'react';
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
    const pathname = usePathname();

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-screen sticky top-0 bg-black/40 border-r border-white/[0.08] flex flex-col"
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/[0.08]">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
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

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Quick Action */}
            <div className="p-4">
                <Link
                    href="/dashboard/products/new"
                    className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                        'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
                        'hover:from-indigo-600 hover:to-purple-600',
                        'shadow-lg shadow-indigo-500/25',
                        isCollapsed && 'justify-center px-3'
                    )}
                >
                    <Plus className="w-5 h-5" />
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
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
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                                        isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white',
                                        isCollapsed && 'justify-center px-3'
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <AnimatePresence mode="wait">
                                        {!isCollapsed && (
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
                                    {isActive && !isCollapsed && (
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
                    onClick={onLogout}
                    className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                        'text-white/40 hover:bg-red-500/10 hover:text-red-400',
                        isCollapsed && 'justify-center px-3'
                    )}
                >
                    <LogOut className="w-5 h-5" />
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
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
        </motion.aside>
    );
}
