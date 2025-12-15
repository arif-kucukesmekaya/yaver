'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import {
    Check,
    Sparkles,
    Zap,
    Crown,
    CreditCard,
    Coins,
    Loader2,
    ShieldCheck,
    Star
} from 'lucide-react';
import { Toast } from '@/components/ui/Notifications';

const plans = [
    {
        id: 'Free',
        name: 'Free',
        price: 0,
        credits: 10,
        description: 'Denemek isteyenler için ideal',
        icon: Sparkles,
        features: [
            '10 AI Kredisi/Ay',
            'Sınırlı Pazaryeri Entegrasyonu',
            'Temel Destek',
        ]
    },
    {
        id: 'Starter',
        name: 'Starter',
        price: 399,
        credits: 150,
        description: 'Büyümeye başlayanlar için',
        icon: Zap,
        features: [
            '150 AI Kredisi/Ay',
            'Tüm Pazaryerleri',
            'Standart SEO Optimizasyonu',
            'E-posta Desteği',
        ]
    },
    {
        id: 'Pro',
        name: 'Pro',
        price: 999,
        credits: 500,
        description: 'Aktif profesyoneller için',
        icon: Star,
        popular: true,
        features: [
            '500 AI Kredisi/Ay',
            'Tüm Pazaryerleri',
            'Gelişmiş SEO ve Analitik',
            'Öncelikli Destek',
            'Toplu İşlemler'
        ]
    },
    {
        id: 'Enterprise',
        name: 'Enterprise',
        price: null,
        credits: 'Sınırsız',
        description: 'Büyük operasyonlar için',
        icon: Crown,
        features: [
            'Sınırsız Kredi Seçenekleri',
            'Özel API Erişimi',
            'Özel Entegrasyonlar',
            '7/24 Premium Destek',
            'Hesap Yöneticisi'
        ]
    }
];

const creditPacks = [
    { amount: 50, price: 150, label: 'Mini Paket', save: null },
    { amount: 200, price: 500, label: 'Eko Paket', save: '%15 Tasarruf', popular: true },
    { amount: 500, price: 1000, label: 'Mega Paket', save: '%33 Tasarruf' },
];

import { subscriptionApi } from '@/lib/api';

export default function PaymentPage() {
    const { user, refreshUser } = useAuth();
    const { balance, purchaseCredits } = useCredits();
    const { toast, success, error, hideToast } = useToast();

    const [selectedPack, setSelectedPack] = useState<number | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [gradingPlanId, setGradingPlanId] = useState<string | null>(null);

    const handlePurchaseCredits = async (amount: number) => {
        setIsPurchasing(true);
        setSelectedPack(amount);
        try {
            await purchaseCredits(amount); // This uses backend API
            success('Başarılı', `${amount} kredi hesabınıza eklendi.`);
        } catch (err) {
            error('Hata', 'Kredi satın alma işlemi başarısız oldu.');
        } finally {
            setIsPurchasing(false);
            setSelectedPack(null);
        }
    };

    const handleUpgradePlan = async (planId: string) => {
        setIsUpgrading(true);
        setGradingPlanId(planId);
        try {
            if (planId === 'Enterprise') {
                // Enterprise contact request logic (mock for now or different endpoint)
                await new Promise(resolve => setTimeout(resolve, 1000));
                success('Talebiniz Alındı', 'Satış ekibimiz sizinle iletişime geçecek.');
            } else {
                // Real backend upgrade
                const response = await subscriptionApi.upgrade(planId);

                if (response.success) {
                    await refreshUser(); // Update user profile (plan name, etc)
                    window.dispatchEvent(new Event('credits-updated')); // Update credit balance components
                    success('Başarılı', `${planId} planına geçiş yapıldı.`);
                }
            }
        } catch (err) {
            error('Hata', err instanceof Error ? err.message : 'Plan değişikliği başarısız oldu.');
        } finally {
            setIsUpgrading(false);
            setGradingPlanId(null);
        }
    };

    const currentPlanName = user?.subscription?.plan || 'Free';

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Ödeme ve Abonelik</h1>
                <p className="text-zinc-400">Planınızı yönetin veya ekstra kredi satın alın.</p>
            </div>

            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
                    <div>
                        <p className="text-zinc-500 text-sm mb-1">Mevcut Plan</p>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            {currentPlanName}
                            {currentPlanName !== 'Free' && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                    Aktif
                                </span>
                            )}
                        </h2>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Star className="w-6 h-6 text-blue-400" />
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
                    <div>
                        <p className="text-zinc-500 text-sm mb-1">Toplam Kredi Bakiyesi</p>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            {balance.available}
                            <span className="text-sm font-normal text-zinc-400">Kredi</span>
                        </h2>
                        <div className="flex items-center gap-3 mt-1 text-xs">
                            <span className="text-zinc-500">
                                <span className="text-zinc-300">{balance.subscription}</span> Plan
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            <span className="text-zinc-500">
                                <span className="text-zinc-300">{balance.extra}</span> Ekstra
                            </span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Coins className="w-6 h-6 text-amber-400" />
                    </div>
                </div>
            </div>

            {/* Credit Packs */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-400" />
                    Ekstra Kredi Paketleri
                    <span className="text-xs font-normal text-zinc-500 ml-2">(Birikimli, silinmez)</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {creditPacks.map((pack) => (
                        <motion.div
                            key={pack.amount}
                            whileHover={{ y: -5 }}
                            className={cn(
                                "relative p-6 rounded-2xl border bg-zinc-900/30 flex flex-col items-center text-center transition-all",
                                pack.popular
                                    ? "border-amber-500/50 shadow-lg shadow-amber-500/10 bg-amber-500/5"
                                    : "border-zinc-800 hover:border-zinc-700"
                            )}
                        >
                            {pack.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-bold uppercase rounded-full shadow-lg">
                                    En Popüler
                                </div>
                            )}

                            <div className="mb-4 p-3 rounded-full bg-zinc-800/50">
                                <Coins className={cn("w-6 h-6", pack.popular ? "text-amber-400" : "text-zinc-400")} />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1">{pack.label}</h3>
                            <p className="text-3xl font-bold text-white mb-2">
                                ₺{pack.price}
                            </p>
                            <p className="text-zinc-400 font-medium mb-6">
                                {pack.amount} Kredi
                                {pack.save && <span className="block text-xs text-emerald-400 mt-1">{pack.save}</span>}
                            </p>

                            <button
                                onClick={() => handlePurchaseCredits(pack.amount)}
                                disabled={isPurchasing}
                                className={cn(
                                    "w-full py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                                    pack.popular
                                        ? "bg-amber-500 hover:bg-amber-600 text-black"
                                        : "bg-zinc-800 hover:bg-zinc-700 text-white"
                                )}
                            >
                                {isPurchasing && selectedPack === pack.amount ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CreditCard className="w-4 h-4" />
                                )}
                                Satın Al
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Subscription Plans */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                    Abonelik Planları
                    <span className="text-xs font-normal text-zinc-500 ml-2">(Aylık yenilenir)</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    {plans.map((plan) => {
                        const isCurrent = currentPlanName === plan.id;
                        const isPopular = plan.popular;
                        const PlanIcon = plan.icon;

                        return (
                            <div
                                key={plan.id}
                                className={cn(
                                    "p-5 rounded-2xl border transition-all h-full flex flex-col",
                                    isPopular && !isCurrent ? "border-blue-500/50 bg-blue-500/5" : "border-zinc-800 bg-zinc-900/30",
                                    isCurrent ? "border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/20" : "hover:border-zinc-700"
                                )}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn(
                                        "p-2 rounded-lg",
                                        isCurrent ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                                    )}>
                                        <PlanIcon className="w-5 h-5" />
                                    </div>
                                    {isPopular && !isCurrent && (
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">Önerilen</span>
                                    )}
                                    {isCurrent && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                                            <ShieldCheck className="w-3 h-3" /> Mevcut
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                <p className="text-xs text-zinc-500 mb-4 h-10">{plan.description}</p>

                                <div className="mb-6">
                                    {plan.price !== null ? (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-white">₺{plan.price}</span>
                                            <span className="text-xs text-zinc-500">/ay</span>
                                        </div>
                                    ) : (
                                        <div className="text-2xl font-bold text-white">Özel</div>
                                    )}
                                    <div className="text-sm font-medium text-blue-400 mt-1">
                                        {plan.credits}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                                            <Check className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleUpgradePlan(plan.id)}
                                    disabled={isCurrent || isUpgrading}
                                    className={cn(
                                        "w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                                        isCurrent
                                            ? "bg-emerald-500/10 text-emerald-400 cursor-default"
                                            : isPopular
                                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                                : "bg-zinc-800 hover:bg-zinc-700 text-white"
                                    )}
                                >
                                    {isUpgrading && gradingPlanId === plan.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : isCurrent ? (
                                        "Kullanılıyor"
                                    ) : plan.price === null ? (
                                        "İletişime Geç"
                                    ) : (
                                        "Seç"
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Toast type={toast.type} title={toast.title} message={toast.message} isVisible={toast.isVisible} onClose={hideToast} />
        </div>
    );
}
