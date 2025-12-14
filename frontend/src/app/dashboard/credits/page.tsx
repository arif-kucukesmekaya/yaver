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
} from 'lucide-react';
import type { TransactionType } from '@/types';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Notifications';

const creditPackages = [
    { amount: 10, price: 29, popular: false },
    { amount: 50, price: 99, popular: true, savings: '30%' },
    { amount: 100, price: 179, popular: false, savings: '40%' },
    { amount: 500, price: 699, popular: false, savings: '50%' },
];

const transactionTypeConfig: Record<TransactionType, { label: string; icon: React.ElementType; color: string }> = {
    purchase: { label: 'Satın Alma', icon: CreditCard, color: 'text-green-400' },
    monthly_refill: { label: 'Aylık Yükleme', icon: TrendingUp, color: 'text-blue-400' },
    usage: { label: 'Kullanım', icon: Sparkles, color: 'text-purple-400' },
    bonus: { label: 'Bonus', icon: Coins, color: 'text-amber-400' },
};

export default function CreditsPage() {
    const { balance, isLoading: balanceLoading, purchaseCredits } = useCredits();
    const { transactions, isLoading: historyLoading } = useCreditHistory(20);
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const { toast, success, error, hideToast } = useToast();

    const handlePurchase = async (amount: number) => {
        if (isPurchasing) return;
        setIsPurchasing(true);
        setSelectedPackage(amount);
        try {
            await purchaseCredits(amount);
            success('Başarılı', `${amount} kredi başarıyla eklendi!`);
        } catch {
            error('Hata', 'Satın alma başarısız oldu');
        } finally {
            setIsPurchasing(false);
            setSelectedPackage(null);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Krediler</h1>
                <p className="text-white/50 mt-1">AI içerik üretimi için kredi yönetimi</p>
            </div>

            {/* Balance Card */}
            <div className="relative bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 rounded-2xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-white/60 mb-2">Mevcut Bakiye</p>
                        <div className="flex items-center gap-3">
                            <Coins className="w-10 h-10 text-amber-400" />
                            <span className="text-5xl font-bold text-white">{balanceLoading ? '...' : balance}</span>
                            <span className="text-xl text-white/60">kredi</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/10 rounded-xl">
                            <p className="text-xs text-white/40 mb-1">Bu ay kullanılan</p>
                            <p className="text-xl font-bold text-white">-</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-xl">
                            <p className="text-xs text-white/40 mb-1">Toplam üretim</p>
                            <p className="text-xl font-bold text-white">-</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Credit Packages */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Kredi Satın Al</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {creditPackages.map((pkg) => (
                        <motion.button
                            key={pkg.amount}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePurchase(pkg.amount)}
                            disabled={isPurchasing}
                            className={cn('relative p-6 rounded-2xl border-2 text-left transition-all', pkg.popular ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20')}
                        >
                            {pkg.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full">Popüler</span>}
                            <div className="flex items-center gap-2 mb-3">
                                <Coins className="w-5 h-5 text-amber-400" />
                                <span className="text-2xl font-bold text-white">{pkg.amount}</span>
                                <span className="text-white/40">kredi</span>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">₺{pkg.price}</p>
                            {pkg.savings && <p className="text-sm text-green-400">%{pkg.savings} tasarruf</p>}
                            {selectedPackage === pkg.amount && isPurchasing && (
                                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">İşlem Geçmişi</h2>
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden">
                    {historyLoading ? (
                        <div className="p-8 text-center"><Loader2 className="w-6 h-6 text-white/40 animate-spin mx-auto" /></div>
                    ) : transactions.length === 0 ? (
                        <div className="p-12 text-center"><Clock className="w-12 h-12 text-white/10 mx-auto mb-4" /><p className="text-white/40">Henüz işlem yok</p></div>
                    ) : (
                        <div className="divide-y divide-white/[0.05]">
                            {transactions.map((tx, index) => {
                                const config = transactionTypeConfig[tx.transactionType];
                                const isPositive = tx.amount > 0;
                                const Icon = config?.icon || Coins;
                                return (
                                    <motion.div key={tx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isPositive ? 'bg-green-500/10' : 'bg-red-500/10')}>
                                            <Icon className={cn('w-5 h-5', config?.color || 'text-white/40')} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white">{config?.label || tx.transactionType}</p>
                                            <p className="text-sm text-white/40 truncate">{tx.description || 'İşlem'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn('font-semibold flex items-center gap-1', isPositive ? 'text-green-400' : 'text-red-400')}>
                                                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                {isPositive ? '+' : ''}{tx.amount}
                                            </p>
                                            <p className="text-xs text-white/30">{new Date(tx.createdAt).toLocaleDateString('tr-TR')}</p>
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
