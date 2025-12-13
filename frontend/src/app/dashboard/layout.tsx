'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-white/50 text-sm">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <Sidebar onLogout={logout} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Header */}
                <DashboardHeader
                    user={user}
                    creditBalance={creditBalance}
                    onLogout={logout}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6 max-w-7xl mx-auto">
                        {children}
                    </div>
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
