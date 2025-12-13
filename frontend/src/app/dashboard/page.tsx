'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { StatCard, StatCardSkeleton } from '@/components/dashboard/StatCard';
import { useProducts } from '@/hooks/useProducts';
import { useCredits, useCreditHistory } from '@/hooks/useCredits';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
    Package,
    TrendingUp,
    Coins,
    Sparkles,
    ArrowRight,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import type { Product, CreditTransaction, ProductStatus } from '@/types';

const statusConfig: Record<ProductStatus, { label: string; color: string; icon: React.ElementType }> = {
    draft: { label: 'Taslak', color: 'text-yellow-400 bg-yellow-500/10', icon: Clock },
    processing: { label: 'İşleniyor', color: 'text-blue-400 bg-blue-500/10', icon: Loader2 },
    completed: { label: 'Tamamlandı', color: 'text-green-400 bg-green-500/10', icon: CheckCircle },
    failed: { label: 'Başarısız', color: 'text-red-400 bg-red-500/10', icon: AlertCircle },
};

export default function DashboardPage() {
    const { user } = useAuth();
    const { products, isLoading: productsLoading, pagination } = useProducts({ limit: 5 });
    const { balance, isLoading: creditsLoading } = useCredits();
    const { transactions, isLoading: historyLoading } = useCreditHistory(5);

    const isLoading = productsLoading || creditsLoading;

    // Calculate stats
    const totalProducts = pagination.total;
    const completedProducts = products.filter(p => p.productStatus === 'completed').length;

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                    Hoş geldin, {user?.firstName || 'Kullanıcı'}! 👋
                </h1>
                <p className="text-white/50">
                    İşte bugünkü özet
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    <>
                        <StatCard
                            title="Toplam Ürün"
                            value={totalProducts}
                            icon={Package}
                            iconColor="text-blue-400"
                            iconBg="bg-blue-500/10"
                        />
                        <StatCard
                            title="Aktif Listeler"
                            value={completedProducts}
                            icon={TrendingUp}
                            iconColor="text-green-400"
                            iconBg="bg-green-500/10"
                        />
                        <StatCard
                            title="Kredi Bakiyesi"
                            value={balance}
                            icon={Coins}
                            iconColor="text-amber-400"
                            iconBg="bg-amber-500/10"
                        />
                        <StatCard
                            title="AI Üretim"
                            value={completedProducts}
                            change={{ value: 12, label: 'bu hafta' }}
                            icon={Sparkles}
                            iconColor="text-purple-400"
                            iconBg="bg-purple-500/10"
                        />
                    </>
                )}
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Products */}
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Son Ürünler</h2>
                        <Link
                            href="/dashboard/products"
                            className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Tümünü gör
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {productsLoading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
                            <p className="text-white/40 text-sm">Henüz ürün eklenmemiş</p>
                            <Link
                                href="/dashboard/products/new"
                                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                İlk ürünü ekle
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {products.slice(0, 5).map((product, index) => (
                                <ProductRow key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Son İşlemler</h2>
                        <Link
                            href="/dashboard/credits"
                            className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Tümünü gör
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {historyLoading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-8">
                            <Coins className="w-12 h-12 text-white/20 mx-auto mb-3" />
                            <p className="text-white/40 text-sm">Henüz işlem yok</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.slice(0, 5).map((tx, index) => (
                                <TransactionRow key={tx.id} transaction={tx} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickActionCard
                    title="Yeni Ürün Ekle"
                    description="AI ile optimize edilmiş içerik oluştur"
                    href="/dashboard/products/new"
                    icon={Package}
                    gradient="from-blue-500 to-indigo-600"
                />
                <QuickActionCard
                    title="Kredi Satın Al"
                    description="İçerik üretimi için kredi al"
                    href="/dashboard/credits"
                    icon={Coins}
                    gradient="from-amber-500 to-orange-600"
                />
                <QuickActionCard
                    title="Ayarları Düzenle"
                    description="Profil ve hesap ayarları"
                    href="/dashboard/settings"
                    icon={Sparkles}
                    gradient="from-purple-500 to-pink-600"
                />
            </div>
        </div>
    );
}

function ProductRow({ product, index }: { product: Product; index: number }) {
    const status = statusConfig[product.productStatus];
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Link
                href={`/dashboard/products/${product.id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
                {/* Image placeholder */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-indigo-400" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                        {product.brandName || 'İsimsiz Ürün'}
                    </p>
                    <p className="text-xs text-white/40 truncate">
                        {product.rawUserPrompt?.slice(0, 50)}...
                    </p>
                </div>

                <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs', status.color)}>
                    <StatusIcon className={cn('w-3 h-3', product.productStatus === 'processing' && 'animate-spin')} />
                    {status.label}
                </div>
            </Link>
        </motion.div>
    );
}

function TransactionRow({ transaction, index }: { transaction: CreditTransaction; index: number }) {
    const isPositive = transaction.amount > 0;
    const typeLabels: Record<string, string> = {
        purchase: 'Satın Alma',
        monthly_refill: 'Aylık Yükleme',
        usage: 'Kullanım',
        bonus: 'Bonus',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
        >
            <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                isPositive ? 'bg-green-500/10' : 'bg-red-500/10'
            )}>
                <Coins className={cn('w-4 h-4', isPositive ? 'text-green-400' : 'text-red-400')} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                    {typeLabels[transaction.transactionType] || transaction.transactionType}
                </p>
                <p className="text-xs text-white/40 truncate">
                    {transaction.description || 'İşlem'}
                </p>
            </div>

            <span className={cn('text-sm font-medium', isPositive ? 'text-green-400' : 'text-red-400')}>
                {isPositive ? '+' : ''}{transaction.amount}
            </span>
        </motion.div>
    );
}

function QuickActionCard({
    title,
    description,
    href,
    icon: Icon,
    gradient,
}: {
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    gradient: string;
}) {
    return (
        <Link
            href={href}
            className="group relative p-6 bg-white/[0.02] border border-white/[0.08] rounded-2xl hover:border-white/[0.15] transition-all overflow-hidden"
        >
            {/* Gradient bg on hover */}
            <div className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity',
                gradient
            )} />

            <div className="relative">
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4', gradient)}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
                <p className="text-sm text-white/50">{description}</p>
            </div>
        </Link>
    );
}
