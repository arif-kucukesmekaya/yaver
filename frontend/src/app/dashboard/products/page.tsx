'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import {
    Package,
    Plus,
    Search,
    Grid3X3,
    List,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2,
    Sparkles,
    ArrowUpRight,
} from 'lucide-react';
import type { Product, ProductStatus } from '@/types';

const statusConfig: Record<ProductStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    draft: { label: 'Taslak', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock },
    processing: { label: 'İşleniyor', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Loader2 },
    completed: { label: 'Tamamlandı', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
    failed: { label: 'Başarısız', color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertCircle },
};

const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'completed', label: 'Tamamlandı' },
    { id: 'processing', label: 'İşleniyor' },
    { id: 'draft', label: 'Taslak' },
];

export default function ProductsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { products, isLoading, pagination, nextPage, prevPage } = useProducts({ limit: 12 });

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.rawUserPrompt?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || product.productStatus === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl">
                        <Package className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Ürünler</h1>
                        <p className="text-sm text-zinc-500">{pagination.total} ürün</p>
                    </div>
                </div>

                <Link href="/dashboard/products/new">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Ürün
                    </motion.button>
                </Link>
            </div>

            {/* Toolbar */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className={cn(
                            "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                            isSearchFocused ? "text-blue-400" : "text-zinc-500"
                        )} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            placeholder="Ürün ara..."
                            className={cn(
                                "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all",
                                "bg-zinc-800/50 text-white placeholder:text-zinc-500",
                                "border",
                                isSearchFocused
                                    ? "border-blue-500/50 ring-2 ring-blue-500/10"
                                    : "border-zinc-700/50 hover:border-zinc-600"
                            )}
                        />
                    </div>

                    {/* Filters & View */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-zinc-800/50 rounded-xl p-1">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                                        activeFilter === filter.id
                                            ? 'bg-zinc-700 text-white'
                                            : 'text-zinc-400 hover:text-white'
                                    )}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center bg-zinc-800/50 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    'p-2 rounded-lg transition-all',
                                    viewMode === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'
                                )}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    'p-2 rounded-lg transition-all',
                                    viewMode === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'
                                )}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                                : 'space-y-3'
                        )}
                    >
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'bg-zinc-900/50 border border-zinc-800/80 rounded-2xl animate-pulse',
                                    viewMode === 'grid' ? 'h-72' : 'h-20'
                                )}
                            />
                        ))}
                    </motion.div>
                ) : filteredProducts.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                            <Package className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {searchQuery ? 'Ürün bulunamadı' : 'Henüz ürün yok'}
                        </h3>
                        <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
                            {searchQuery ? 'Farklı bir arama terimi deneyin' : 'AI ile optimize içerik üretmeye başlayın'}
                        </p>
                        {!searchQuery && (
                            <Link href="/dashboard/products/new">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    className="inline-flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    İlk ürünü ekle
                                </motion.button>
                            </Link>
                        )}
                    </motion.div>
                ) : viewMode === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {filteredProducts.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                    >
                        {filteredProducts.map((product, i) => (
                            <ProductRow key={product.id} product={product} index={i} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4">
                    <button
                        onClick={prevPage}
                        disabled={!pagination.hasPrev}
                        className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-zinc-500">
                        Sayfa {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                        onClick={nextPage}
                        disabled={!pagination.hasNext}
                        className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
    const status = statusConfig[product.productStatus];
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group"
        >
            <Link
                href={`/dashboard/products/${product.id}`}
                className="block bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all"
            >
                {/* Image */}
                <div className="aspect-video bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                    {(product.enhancedImages?.[0]?.imageUrl || product.sourceImages?.[0]?.imageUrl) ? (
                        <img
                            src={product.enhancedImages?.[0]?.imageUrl || product.sourceImages?.[0]?.imageUrl}
                            alt={product.brandName || 'Product'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <Package className="w-10 h-10 text-zinc-700" />
                    )}

                    {/* Status */}
                    <div className={cn(
                        'absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm',
                        status.bg, status.color
                    )}>
                        <StatusIcon className={cn('w-3 h-3', product.productStatus === 'processing' && 'animate-spin')} />
                        {status.label}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <span className="text-white text-sm font-medium flex items-center gap-1">
                            Detayları Gör <ArrowUpRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 truncate group-hover:text-blue-400 transition-colors">
                        {product.brandName || 'İsimsiz Ürün'}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 h-10">
                        {product.rawUserPrompt || 'Açıklama yok'}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/50">
                        {product.listings && product.listings.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-violet-400">
                                <Sparkles className="w-3 h-3" />
                                {product.listings.length} pazaryeri
                            </div>
                        )}
                        <span className="text-xs text-zinc-600 ml-auto">
                            {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function ProductRow({ product, index }: { product: Product; index: number }) {
    const status = statusConfig[product.productStatus];
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
        >
            <Link
                href={`/dashboard/products/${product.id}`}
                className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition-all group"
            >
                <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {(product.enhancedImages?.[0]?.imageUrl || product.sourceImages?.[0]?.imageUrl) ? (
                        <img
                            src={product.enhancedImages?.[0]?.imageUrl || product.sourceImages?.[0]?.imageUrl}
                            alt={product.brandName || 'Product'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Package className="w-6 h-6 text-zinc-600" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                        {product.brandName || 'İsimsiz Ürün'}
                    </h3>
                    <p className="text-sm text-zinc-500 truncate">
                        {product.rawUserPrompt || 'Açıklama yok'}
                    </p>
                </div>

                {product.listings && product.listings.length > 0 && (
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-xs text-violet-400 font-medium">{product.listings.length}</span>
                    </div>
                )}

                <div className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                    status.bg, status.color
                )}>
                    <StatusIcon className={cn('w-3.5 h-3.5', product.productStatus === 'processing' && 'animate-spin')} />
                    <span className="hidden sm:inline">{status.label}</span>
                </div>

                <span className="hidden lg:block text-xs text-zinc-600 w-24 text-right">
                    {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                </span>

                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors" />
            </Link>
        </motion.div>
    );
}
