'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCredits, useCreditHistory } from '@/hooks/useCredits';
import { cn } from '@/lib/utils';
import {
    Coins,
    TrendingUp,
    CreditCard,
    Clock,
    Sparkles,
    Loader2,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Star,
    Crown,
    Gift,
} from 'lucide-react';
import type { TransactionType } from '@/types';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Notifications';

// Removed unused imports and logic
import Link from 'next/link';

const transactionTypeConfig: Record<TransactionType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    purchase: { label: 'Satın Alma', icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    monthly_refill: { label: 'Aylık Yükleme', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    usage: { label: 'Kullanım', icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    bonus: { label: 'Bonus', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

export default function CreditsPage() {
    const { balance, isLoading: balanceLoading } = useCredits();
    const { transactions, isLoading: historyLoading } = useCreditHistory(20);
    const { toast, hideToast } = useToast();

    // handlePurchase ve isPurchasing kaldırıldı

    const usedThisMonth = transactions
        .filter(t => t.amount < 0 && new Date(t.createdAt).getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 rounded-xl">
                    <Coins className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Krediler</h1>
                    <p className="text-sm text-zinc-500">AI içerik üretimi için kredi yönetimi</p>
                </div>
            </div>

            {/* Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent border border-amber-500/10 rounded-2xl p-6"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-zinc-500 text-sm mb-2">Mevcut Bakiye</p>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-500/10 rounded-xl">
                                <Coins className="w-6 h-6 text-amber-400" />
                            </div>
                            <span className="text-5xl font-bold text-white">
                                {balanceLoading ? '...' : balance.available}
                            </span>
                            <span className="text-xl text-zinc-500">kredi</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/80">
                            <p className="text-xs text-zinc-500 mb-1">Bu ay kullanılan</p>
                            <p className="text-xl font-bold text-white">{usedThisMonth}</p>
                        </div>
                        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/80">
                            <p className="text-xs text-zinc-500 mb-1">Toplam üretim</p>
                            <p className="text-xl font-bold text-white">{transactions.filter(t => t.transactionType === 'usage').length}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Purchase Redirect Banner */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl">
                        <CreditCard className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Daha fazla krediye mi ihtiyacınız var?</h2>
                        <p className="text-zinc-400 max-w-lg">
                            Yenilenen ödeme sayfamızdan ekstra kredi paketlerini inceleyebilir veya abonelik planınızı yükselterek avantajlı fiyatlardan yararlanabilirsiniz.
                        </p>
                    </div>
                </div>
                <Link
                    href="/dashboard/payment"
                    className="whitespace-nowrap px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02]"
                >
                    Paketleri İncele &rarr;
                </Link>
            </div>

            {/* History */}
            <div>
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    İşlem Geçmişi
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden">
                    {historyLoading ? (
                        <div className="divide-y divide-zinc-800/50">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 px-5 py-4">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 animate-pulse" />
                                    <div className="flex-1">
                                        <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse mb-2" />
                                        <div className="h-3 w-32 bg-zinc-800/50 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                                <Clock className="w-7 h-7 text-zinc-600" />
                            </div>
                            <p className="text-zinc-500">Henüz işlem yok</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-800/50">
                            {transactions.map((tx, i) => {
                                const config = transactionTypeConfig[tx.transactionType];
                                const isPositive = tx.amount > 0;
                                const Icon = config?.icon || Coins;
                                return (
                                    <motion.div
                                        key={tx.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/30 transition-colors"
                                    >
                                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config?.bg || 'bg-zinc-800')}>
                                            <Icon className={cn('w-5 h-5', config?.color || 'text-zinc-400')} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white">{config?.label || tx.transactionType}</p>
                                            <p className="text-sm text-zinc-500 truncate">{tx.description || 'İşlem'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn(
                                                'font-bold flex items-center gap-1 tabular-nums',
                                                isPositive ? 'text-emerald-400' : 'text-red-400'
                                            )}>
                                                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                {isPositive ? '+' : ''}{tx.amount}
                                            </p>
                                            <p className="text-xs text-zinc-600">{new Date(tx.createdAt).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Toast
                type={toast.type}
                title={toast.title}
                message={toast.message}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    );
}
