'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import {
    Package,
    Plus,
    Search,
    Filter,
    Grid3X3,
    List,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2,
    MoreHorizontal,
    Sparkles,
} from 'lucide-react';
import type { Product, ProductStatus } from '@/types';

const statusConfig: Record<ProductStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
    draft: { label: 'Taslak', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/20', icon: Clock },
    processing: { label: 'İşleniyor', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/20', icon: Loader2 },
    completed: { label: 'Tamamlandı', color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/20', icon: CheckCircle },
    failed: { label: 'Başarısız', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/20', icon: AlertCircle },
};

export default function ProductsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const { products, isLoading, pagination, nextPage, prevPage } = useProducts({ limit: 12 });

    // Filter products by search
    const filteredProducts = products.filter(product =>
        product.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.rawUserPrompt?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Ürünler</h1>
                    <p className="text-white/50 mt-1">{pagination.total} ürün</p>
                </div>

                <Link
                    href="/dashboard/products/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Ürün
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ürün ara..."
                        className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm">Filtrele</span>
                    </button>

                    <div className="flex items-center bg-white/5 border border-white/[0.08] rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                'p-2 rounded-lg transition-colors',
                                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
                            )}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'p-2 rounded-lg transition-colors',
                                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Products */}
            {isLoading ? (
                <div className={cn(
                    viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'
                )}>
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'bg-white/[0.02] border border-white/[0.08] rounded-2xl animate-pulse',
                                viewMode === 'grid' ? 'h-64' : 'h-20'
                            )}
                        />
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                    <Package className="w-16 h-16 text-white/10 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                        {searchQuery ? 'Ürün bulunamadı' : 'Henüz ürün yok'}
                    </h3>
                    <p className="text-white/40 mb-6">
                        {searchQuery ? 'Farklı bir arama terimi deneyin' : 'İlk ürününüzü ekleyerek başlayın'}
                    </p>
                    {!searchQuery && (
                        <Link
                            href="/dashboard/products/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            İlk ürünü ekle
                        </Link>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product, index) => (
                        <ProductGridCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredProducts.map((product, index) => (
                        <ProductListRow key={product.id} product={product} index={index} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={prevPage}
                        disabled={!pagination.hasPrev}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="px-4 py-2 text-sm text-white/60">
                        Sayfa {pagination.page} / {pagination.totalPages}
                    </span>

                    <button
                        onClick={nextPage}
                        disabled={!pagination.hasNext}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}

function ProductGridCard({ product, index }: { product: Product; index: number }) {
    const status = statusConfig[product.productStatus];
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Link
                href={`/dashboard/products/${product.id}`}
                className="block group bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.15] transition-all h-full"
            >
                <div className="aspect-video bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center relative">
                    {product.sourceImages?.[0]?.imageUrl ? (
                        <img
                            src={product.sourceImages[0].imageUrl}
                            alt={product.brandName || 'Product'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Package className="w-12 h-12 text-white/20" />
                    )}

                    <div className={cn(
                        'absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border',
                        status.bgColor, status.color
                    )}>
                        <StatusIcon className={cn('w-3 h-3', product.productStatus === 'processing' && 'animate-spin')} />
                        {status.label}
                    </div>
                </div>

                <div className="p-4 flex flex-col h-[140px]">
                    <h3 className="font-medium text-white mb-1 truncate">
                        {product.brandName || 'İsimsiz Ürün'}
                    </h3>
                    <p className="text-sm text-white/40 line-clamp-2 flex-1">
                        {product.rawUserPrompt || 'Açıklama yok'}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.05]">
                        <div className="flex items-center gap-2">
                            {product.listings && product.listings.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-white/40">
                                    <Sparkles className="w-3 h-3" />
                                    {product.listings.length} pazaryeri
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-white/30">
                            {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function ProductListRow({ product, index }: { product: Product; index: number }) {
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
                className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl hover:border-white/[0.15] transition-all group"
            >
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {product.sourceImages?.[0]?.imageUrl ? (
                        <img
                            src={product.sourceImages[0].imageUrl}
                            alt={product.brandName || 'Product'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Package className="w-6 h-6 text-white/20" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">
                        {product.brandName || 'İsimsiz Ürün'}
                    </h3>
                    <p className="text-sm text-white/40 truncate">
                        {product.rawUserPrompt || 'Açıklama yok'}
                    </p>
                </div>

                {product.listings && product.listings.length > 0 && (
                    <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-white/5 rounded-lg">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span className="text-xs text-white/60">{product.listings.length}</span>
                    </div>
                )}

                <div className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border',
                    status.bgColor, status.color
                )}>
                    <StatusIcon className={cn('w-3 h-3', product.productStatus === 'processing' && 'animate-spin')} />
                    <span className="hidden sm:inline">{status.label}</span>
                </div>

                <span className="hidden lg:block text-xs text-white/30 w-24 text-right">
                    {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                </span>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                    className="p-2 rounded-lg text-white/30 hover:bg-white/10 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </Link>
        </motion.div>
    );
}
