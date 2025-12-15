'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, isLoading, isAuthenticated, logout } = useAuth();
    const { balance: creditBalance } = useCredits();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Image
                            src="/yaver-logo.png"
                            alt="Yaver Logo"
                            width={56}
                            height={56}
                            className="rounded-2xl"
                        />
                    </motion.div>
                    <div className="text-center">
                        <p className="text-white font-semibold text-lg">yaver</p>
                        <p className="text-zinc-500 text-sm mt-1">Yükleniyor...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] flex">
            <Sidebar onLogout={logout} />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <DashboardHeader
                    user={user}
                    creditBalance={creditBalance}
                    onLogout={logout}
                />

                <main className="flex-1 overflow-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 pt-16 lg:pt-6 lg:p-6 max-w-7xl mx-auto"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </AuthProvider>
    );
}
