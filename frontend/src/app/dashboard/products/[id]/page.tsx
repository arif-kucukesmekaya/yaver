'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct } from '@/hooks/useProducts';
import { productsApi } from '@/lib/api';
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
    X,
    Download,
    ZoomIn,
} from 'lucide-react';
import type { ProductStatus, ListingStatus, MarketplaceListing, AIEnhancedImage } from '@/types';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Notifications';

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
    const { toast, success, error: toastError, hideToast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [selectedImage, setSelectedImage] = useState<AIEnhancedImage | null>(null);

    // Auto-poll when processing
    useEffect(() => {
        if (product?.productStatus === 'processing') {
            const interval = setInterval(() => {
                refetch();
            }, 3000); // Poll every 3 seconds
            return () => clearInterval(interval);
        }
    }, [product?.productStatus, refetch]);

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
            success('Ürün silindi', 'Ürün başarıyla silindi, yönlendiriliyorsunuz...');
            setTimeout(() => router.push('/dashboard/products'), 1500);
        } catch {
            toastError('Hata', 'Silme işlemi başarısız oldu');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRegenerate = async () => {
        if (!product.marketplaceSelections?.length) {
            toastError('Hata', 'Pazaryeri seçilmemiş');
            return;
        }
        setIsRegenerating(true);
        try {
            await productsApi.generateAI(product.id);
            refetchCredits();
            await refetch();
            success('Başarılı', 'İçerik üretimi başlatıldı. Sayfa otomatik güncellenecek...');
        } catch {
            toastError('Hata', 'Yeniden üretim başarısız oldu');
        } finally {
            setIsRegenerating(false);
        }
    };

    const imageTypeLabels: Record<string, string> = {
        lifestyle: 'Yaşam Tarzı',
        infographic: 'İnfografik',
        detail: 'Detay',
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

                    <button onClick={handleRegenerate} disabled={isRegenerating || product.productStatus === 'processing'} className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-colors">
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
                    {/* AI Generated Images Only */}
                    <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            AI Görselleri
                        </h3>

                        {product.productStatus === 'processing' ? (
                            <div className="py-8 text-center">
                                <div className="relative w-16 h-16 mx-auto mb-4">
                                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-400" />
                                </div>
                                <p className="text-white/60 text-sm">AI görseller üretiliyor...</p>
                                <p className="text-white/30 text-xs mt-1">Lütfen bekleyin</p>
                            </div>
                        ) : product.enhancedImages && product.enhancedImages.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {product.enhancedImages.map((img, i) => (
                                    <div
                                        key={i}
                                        className="group relative cursor-pointer"
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <div className="aspect-square rounded-xl overflow-hidden bg-white/5 ring-2 ring-transparent hover:ring-indigo-500/50 transition-all">
                                            <img src={img.imageUrl} alt={img.imageType} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <ZoomIn className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-xs uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">
                                                {imageTypeLabels[img.imageType] || img.imageType}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 border border-dashed border-white/10 rounded-xl text-center">
                                <Package className="w-8 h-8 text-white/10 mx-auto mb-2" />
                                <p className="text-sm text-white/30">Henüz AI görsel üretilmedi</p>
                                <p className="text-xs text-white/20 mt-1">"Yeniden Üret" butonuna tıklayın</p>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
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
                        </div>

                        {product.productStatus === 'processing' ? (
                            <div className="py-12 text-center">
                                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                                <p className="text-white/60">İçerikler üretiliyor...</p>
                            </div>
                        ) : product.listings && product.listings.length > 0 ? (
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

            {/* Image Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl max-h-[90vh] w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <img
                                src={selectedImage.imageUrl}
                                alt={selectedImage.imageType}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                            />

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                                <span className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                                    {imageTypeLabels[selectedImage.imageType] || selectedImage.imageType}
                                </span>
                                <a
                                    href={selectedImage.imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                >
                                    <Download className="w-5 h-5" />
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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

function ListingCard({ listing }: { listing: MarketplaceListing }) {
    const [copiedField, setCopiedField] = useState<'title' | 'description' | null>(null);

    const handleCopy = async (text: string, field: 'title' | 'description') => {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const statusConfig = listingStatusConfig[listing.listingStatus];

    const getMarketplaceLogo = (name: string | undefined) => {
        if (!name) return null;
        const logos: Record<string, string> = {
            'trendyol': '/logo/trendyol.png',
            'hepsiburada': '/logo/hepsiburada.png',
            'amazon': '/logo/amazon.png',
        };
        return logos[name.toLowerCase()] || null;
    };

    const logo = getMarketplaceLogo(listing.marketplace?.name);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white/5 border border-white/[0.08] rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {logo ? (
                        <img src={logo} alt={listing.marketplace?.name} className="w-10 h-10 object-cover rounded-lg" />
                    ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                            <Package className="w-5 h-5 text-indigo-400" />
                        </div>
                    )}
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
