'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StatCard, StatCardSkeleton } from '@/components/dashboard/StatCard';
import { useProducts } from '@/hooks/useProducts';
import { useCredits, useCreditHistory } from '@/hooks/useCredits';
import { useAuth } from '@/hooks/useAuth';
import { useMarketplaces } from '@/hooks/useMarketplaces';
import { useQueue } from '@/hooks/useQueue';
import { useErrors } from '@/hooks/useErrors';
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
    Plus,
    Zap,
    CreditCard,
    Settings,
    ArrowUpRight,
    Eye,
    Copy,
    MoreHorizontal,
    ShoppingBag,
    RefreshCw,
    AlertTriangle,
    Store,
} from 'lucide-react';
import type { Product, CreditTransaction, ProductStatus } from '@/types';

const statusConfig: Record<ProductStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
    draft: { label: 'Taslak', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
    processing: { label: 'İşleniyor', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Loader2 },
    completed: { label: 'Tamamlandı', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
    failed: { label: 'Başarısız', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle },
};

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
}

export default function DashboardPage() {
    const { user } = useAuth();
    const { products, isLoading: productsLoading, pagination } = useProducts({ limit: 4 });
    const { balance, isLoading: creditsLoading } = useCredits();
    const { transactions, isLoading: historyLoading } = useCreditHistory(4);
    const { marketplaces, isLoading: marketplacesLoading } = useMarketplaces();
    const { stats: queueStats, isLoading: queueLoading } = useQueue();
    const { stats: errorStats, errors, isLoading: errorsLoading } = useErrors({ unresolvedOnly: true, limit: 3 });

    const isLoading = productsLoading || creditsLoading;
    const totalProducts = pagination.total;
    const completedProducts = products.filter(p => p.productStatus === 'completed').length;

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <Image
                            src="/yaver-logo.png"
                            alt="Yaver"
                            width={48}
                            height={48}
                            className="rounded-xl"
                        />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-sm mb-0.5">{getGreeting()}</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            {user?.firstName || 'Kullanıcı'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/dashboard/products">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-xl transition-colors border border-zinc-700"
                        >
                            <Package className="w-4 h-4" />
                            Ürünleri Gör
                        </motion.button>
                    </Link>
                    <Link href="/dashboard/products/new">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Yeni Ürün
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                            accentColor="blue"
                            change={{ value: 12, label: 'bu hafta' }}
                        />
                        <StatCard
                            title="Aktif Listeler"
                            value={completedProducts}
                            icon={TrendingUp}
                            accentColor="emerald"
                            change={{ value: 8, label: 'bu hafta' }}
                        />
                        <StatCard
                            title="Kredi Bakiyesi"
                            value={balance.available}
                            icon={Coins}
                            accentColor="amber"
                        />
                        <StatCard
                            title="AI Üretim"
                            value={completedProducts}
                            icon={Sparkles}
                            accentColor="violet"
                            change={{ value: 24, label: 'bu ay' }}
                        />
                    </>
                )}
            </div>

            {/* Connected Marketplaces */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-violet-500/10 rounded-xl">
                            <Store className="w-4 h-4 text-violet-400" />
                        </div>
                        <h2 className="font-semibold text-white">Bağlı Pazaryerleri</h2>
                    </div>
                    <span className="text-xs text-zinc-500">{marketplaces.length} pazaryeri</span>
                </div>

                {marketplacesLoading ? (
                    <div className="flex gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-16 h-16 rounded-xl bg-zinc-800 animate-pulse" />
                        ))}
                    </div>
                ) : marketplaces.length === 0 ? (
                    <p className="text-zinc-500 text-sm">Henüz pazaryeri bağlı değil</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {marketplaces.map((mp) => {
                            // Check for local logo mapping first
                            const logoSrc =
                                (mp.name.toLowerCase().includes('amazon') && '/logo/amazon.png') ||
                                (mp.name.toLowerCase().includes('hepsiburada') && '/logo/hepsiburada.png') ||
                                (mp.name.toLowerCase().includes('trendyol') && '/logo/trendyol.png') ||
                                mp.logoUrl;

                            return (
                                <motion.div
                                    key={mp.id}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex flex-col items-center gap-2 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-colors cursor-pointer"
                                >
                                    {logoSrc ? (
                                        <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={logoSrc}
                                                alt={mp.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5 text-zinc-400" />
                                        </div>
                                    )}
                                    <span className="text-xs text-zinc-300 font-medium">{mp.name}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Products (2/3) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden"
                >
                    <div className="p-5 border-b border-zinc-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <Package className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-white">Son Ürünler</h2>
                                <p className="text-xs text-zinc-500">{pagination.total} toplam</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/products"
                            className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-800"
                        >
                            Tümü
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {productsLoading ? (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-40 bg-zinc-800/50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <EmptyState
                            icon={Package}
                            title="Henüz ürün yok"
                            description="AI ile optimize edilmiş içerik üretmeye başlayın"
                            action={{ label: 'İlk ürünü ekle', href: '/dashboard/products/new' }}
                        />
                    ) : (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.slice(0, 4).map((product, i) => (
                                <ProductCard key={product.id} product={product} index={i} />
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Right Sidebar (1/3) */}
                <div className="space-y-6">
                    {/* Queue Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5"
                    >
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <RefreshCw className="w-4 h-4 text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-white text-sm">İşleme Durumu</h3>
                        </div>

                        {queueLoading ? (
                            <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-8 bg-zinc-800 rounded-lg animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <QueueStat label="Bekleyen" value={queueStats.pending} color="amber" />
                                <QueueStat label="İşleniyor" value={queueStats.processing} color="blue" />
                                <QueueStat label="Tamamlanan" value={queueStats.completed} color="emerald" />
                                {queueStats.failed > 0 && (
                                    <QueueStat label="Başarısız" value={queueStats.failed} color="red" />
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Error Alerts */}
                    {(errorsLoading || errorStats.unresolved > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 bg-red-500/10 rounded-xl">
                                        <AlertTriangle className="w-4 h-4 text-red-400" />
                                    </div>
                                    <h3 className="font-semibold text-white text-sm">Hatalar</h3>
                                </div>
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                                    {errorStats.unresolved}
                                </span>
                            </div>

                            {errorsLoading ? (
                                <div className="space-y-2">
                                    <div className="h-12 bg-zinc-800/50 rounded-lg animate-pulse" />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {errors.slice(0, 3).map((err) => (
                                        <div key={err.id} className="p-2.5 bg-zinc-900/50 rounded-lg">
                                            <p className="text-xs text-red-400 font-medium truncate">
                                                {err.errorType}
                                            </p>
                                            <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                                                {err.product?.brandName || 'Ürün'} - {err.marketplace?.name || 'Genel'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4"
                    >
                        <h3 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-400" />
                            Hızlı İşlemler
                        </h3>
                        <div className="space-y-2">
                            <QuickActionCompact title="Yeni Ürün" href="/dashboard/products/new" icon={Plus} color="blue" />
                            <QuickActionCompact title="Kredi Al" href="/dashboard/credits" icon={CreditCard} color="amber" />
                            <QuickActionCompact title="Ayarlar" href="/dashboard/settings" icon={Settings} color="zinc" />
                        </div>
                    </motion.div>

                    {/* Recent Transactions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden"
                    >
                        <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                    <Coins className="w-4 h-4 text-amber-400" />
                                </div>
                                <h2 className="font-medium text-white text-sm">Son İşlemler</h2>
                            </div>
                            <Link href="/dashboard/credits" className="text-xs text-zinc-500 hover:text-white transition-colors">
                                Tümü
                            </Link>
                        </div>

                        <div className="divide-y divide-zinc-800/50">
                            {historyLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-800 animate-pulse" />
                                            <div className="flex-1">
                                                <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse mb-1.5" />
                                                <div className="h-2.5 w-24 bg-zinc-800/50 rounded animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : transactions.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-xs text-zinc-500">Henüz işlem yok</p>
                                </div>
                            ) : (
                                transactions.slice(0, 4).map((tx, i) => (
                                    <TransactionRowCompact key={tx.id} transaction={tx} index={i} />
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function QueueStat({ label, value, color }: { label: string; value: number; color: 'amber' | 'blue' | 'emerald' | 'red' }) {
    const colors = {
        amber: 'bg-amber-500/10 text-amber-400',
        blue: 'bg-blue-500/10 text-blue-400',
        emerald: 'bg-emerald-500/10 text-emerald-400',
        red: 'bg-red-500/10 text-red-400',
    };

    return (
        <div className="flex items-center justify-between p-2.5 bg-zinc-800/30 rounded-lg">
            <span className="text-xs text-zinc-400">{label}</span>
            <span className={cn('px-2 py-0.5 rounded-md text-xs font-bold', colors[color])}>
                {value}
            </span>
        </div>
    );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
    const status = statusConfig[product.productStatus];
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -2 }}
            className="group"
        >
            <Link
                href={`/dashboard/products/${product.id}`}
                className={cn(
                    "block bg-zinc-800/30 rounded-xl overflow-hidden transition-all",
                    "border border-zinc-800/80 hover:border-zinc-700",
                    "hover:shadow-lg hover:shadow-black/20"
                )}
            >
                <div className="relative aspect-[16/9] bg-zinc-800 overflow-hidden">
                    {product.sourceImages?.[0]?.imageUrl ? (
                        <img
                            src={product.sourceImages[0].imageUrl}
                            alt={product.brandName || 'Product'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-zinc-700" />
                        </div>
                    )}

                    <div className={cn(
                        'absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium backdrop-blur-md border',
                        status.bg, status.color, status.border
                    )}>
                        <StatusIcon className={cn('w-2.5 h-2.5', product.productStatus === 'processing' && 'animate-spin')} />
                        {status.label}
                    </div>
                </div>

                <div className="p-3">
                    <h3 className="font-medium text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                        {product.brandName || 'İsimsiz Ürün'}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                        {product.listings && product.listings.length > 0 ? (
                            <div className="flex items-center gap-1 text-violet-400">
                                <Sparkles className="w-3 h-3" />
                                <span className="text-[10px] font-medium">{product.listings.length} liste</span>
                            </div>
                        ) : (
                            <span className="text-[10px] text-zinc-600">Liste yok</span>
                        )}
                        <span className="text-[10px] text-zinc-600">
                            {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function TransactionRowCompact({ transaction, index }: { transaction: CreditTransaction; index: number }) {
    const isPositive = transaction.amount > 0;
    const typeLabels: Record<string, string> = {
        purchase: 'Satın Alma',
        monthly_refill: 'Aylık',
        usage: 'Kullanım',
        bonus: 'Bonus',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/30 transition-colors"
        >
            <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                isPositive ? 'bg-emerald-500/10' : 'bg-zinc-800'
            )}>
                <Coins className={cn('w-3.5 h-3.5', isPositive ? 'text-emerald-400' : 'text-zinc-500')} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                    {typeLabels[transaction.transactionType] || transaction.transactionType}
                </p>
            </div>
            <span className={cn(
                'text-sm font-bold tabular-nums',
                isPositive ? 'text-emerald-400' : 'text-red-400'
            )}>
                {isPositive ? '+' : ''}{transaction.amount}
            </span>
        </motion.div>
    );
}

function QuickActionCompact({
    title,
    href,
    icon: Icon,
    color,
}: {
    title: string;
    href: string;
    icon: React.ElementType;
    color: 'blue' | 'amber' | 'zinc';
}) {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20',
        amber: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20',
        zinc: 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700',
    };

    return (
        <Link href={href}>
            <div className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800/50 transition-colors">
                <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                    colorClasses[color]
                )}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{title}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </Link>
    );
}

function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: React.ElementType;
    title: string;
    description?: string;
    action?: { label: string; href: string };
}) {
    return (
        <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                <Icon className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-white font-medium mb-1">{title}</h3>
            {description && <p className="text-zinc-500 text-sm mb-5">{description}</p>}
            {action && (
                <Link href={action.href}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {action.label}
                    </motion.button>
                </Link>
            )}
        </div>
    );
}
