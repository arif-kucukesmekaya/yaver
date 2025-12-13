'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProduct } from '@/hooks/useProducts';
import { productsApi, aiApi } from '@/lib/api';
import { useCredits } from '@/hooks/useCredits';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    Package,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2,
    Sparkles,
    Copy,
    Check,
    Trash2,
    RefreshCcw,
} from 'lucide-react';
import type { ProductStatus, ListingStatus, MarketplaceListing } from '@/types';

const productStatusConfig: Record<ProductStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
    draft: { label: 'Taslak', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/20', icon: Clock },
    processing: { label: 'İşleniyor', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/20', icon: Loader2 },
    completed: { label: 'Tamamlandı', color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/20', icon: CheckCircle },
    failed: { label: 'Başarısız', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/20', icon: AlertCircle },
};

const listingStatusConfig: Record<ListingStatus, { label: string; color: string }> = {
    draft: { label: 'Taslak', color: 'text-yellow-400' },
    published: { label: 'Yayında', color: 'text-green-400' },
    error: { label: 'Hata', color: 'text-red-400' },
};

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id ? parseInt(params.id as string) : null;
    const { product, isLoading, error, refetch } = useProduct(productId);
    const { refetch: refetchCredits } = useCredits();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Ürün bulunamadı</h2>
                <p className="text-white/50 mb-6">{error || 'Bu ürüne erişiminiz yok veya silinmiş.'}</p>
                <Link href="/dashboard/products" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Ürünlere dön
                </Link>
            </div>
        );
    }

    const status = productStatusConfig[product.productStatus];
    const StatusIcon = status.icon;

    const handleDelete = async () => {
        if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
        setIsDeleting(true);
        try {
            await productsApi.delete(product.id);
            router.push('/dashboard/products');
        } catch {
            alert('Silme işlemi başarısız oldu');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRegenerate = async () => {
        if (!product.marketplaceSelections?.length) {
            alert('Pazaryeri seçilmemiş');
            return;
        }
        const marketplaceIds = product.marketplaceSelections.map(s => s.marketplaceId);
        setIsRegenerating(true);
        try {
            await aiApi.generateContent(product.id, marketplaceIds);
            refetchCredits();
            refetch();
        } catch {
            alert('Yeniden üretim başarısız oldu');
        } finally {
            setIsRegenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard/products" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4" />
                        Ürünlere dön
                    </Link>
                    <h1 className="text-2xl font-bold text-white">{product.brandName || 'İsimsiz Ürün'}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className={cn('flex items-center gap-2 px-4 py-2 rounded-xl border', status.bgColor, status.color)}>
                        <StatusIcon className={cn('w-4 h-4', product.productStatus === 'processing' && 'animate-spin')} />
                        {status.label}
                    </div>

                    <button onClick={handleRegenerate} disabled={isRegenerating} className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-colors">
                        {isRegenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                        Yeniden Üret
                    </button>

                    <button onClick={handleDelete} disabled={isDeleting} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-medium text-white/60 mb-4">Görseller</h3>
                        {product.sourceImages && product.sourceImages.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {product.sourceImages.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5">
                                        <img src={img.imageUrl} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="aspect-square rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                                <Package className="w-16 h-16 text-white/10" />
                            </div>
                        )}
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-medium text-white/60 mb-4">Detaylar</h3>
                        <div className="space-y-4">
                            <div><p className="text-xs text-white/40 mb-1">Marka</p><p className="text-white">{product.brandName || '-'}</p></div>
                            <div><p className="text-xs text-white/40 mb-1">Kategori</p><p className="text-white">{product.category?.name || '-'}</p></div>
                            <div><p className="text-xs text-white/40 mb-1">Açıklama</p><p className="text-white text-sm">{product.rawUserPrompt || '-'}</p></div>
                            <div><p className="text-xs text-white/40 mb-1">Oluşturulma</p><p className="text-white text-sm">{new Date(product.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Pazaryeri İçerikleri</h3>
                            <div className="flex items-center gap-2 text-sm text-white/40"><Sparkles className="w-4 h-4" />AI tarafından üretildi</div>
                        </div>

                        {product.listings && product.listings.length > 0 ? (
                            <div className="space-y-4">
                                {product.listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Sparkles className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                <h4 className="text-lg font-medium text-white mb-2">Henüz içerik üretilmemiş</h4>
                                <p className="text-sm text-white/50 mb-6">Pazaryerleri için AI içerik üretmek için butona tıklayın</p>
                                <button onClick={handleRegenerate} disabled={isRegenerating} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/25">
                                    {isRegenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                    İçerik Üret
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ListingCard({ listing }: { listing: MarketplaceListing }) {
    const [copiedField, setCopiedField] = useState<'title' | 'description' | null>(null);

    const handleCopy = async (text: string, field: 'title' | 'description') => {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const statusConfig = listingStatusConfig[listing.listingStatus];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white/5 border border-white/[0.08] rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                        <Package className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <p className="font-medium text-white">{listing.marketplace?.name}</p>
                        <span className={cn('text-xs', statusConfig.color)}>{statusConfig.label}</span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-white/40">Başlık</p>
                    <button onClick={() => listing.generatedTitle && handleCopy(listing.generatedTitle, 'title')} className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                        {copiedField === 'title' ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Kopyalandı</span></> : <><Copy className="w-3 h-3" />Kopyala</>}
                    </button>
                </div>
                <p className="text-white text-sm p-3 bg-white/5 rounded-lg">{listing.generatedTitle || 'Üretilmemiş'}</p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-white/40">Açıklama</p>
                    <button onClick={() => listing.generatedDescription && handleCopy(listing.generatedDescription, 'description')} className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                        {copiedField === 'description' ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Kopyalandı</span></> : <><Copy className="w-3 h-3" />Kopyala</>}
                    </button>
                </div>
                <p className="text-white text-sm p-3 bg-white/5 rounded-lg whitespace-pre-wrap max-h-40 overflow-y-auto">{listing.generatedDescription || 'Üretilmemiş'}</p>
            </div>
        </motion.div>
    );
}
