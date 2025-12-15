'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { productsApi, marketplacesApi, categoriesApi, aiApi } from '@/lib/api';
import { useCredits } from '@/hooks/useCredits';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Package,
    Image as ImageIcon,
    Store,
    Sparkles,
    Upload,
    X,
    Loader2,
    AlertCircle,
    Coins,
} from 'lucide-react';
import type { Marketplace, Category, UserCredits } from '@/types';

const steps = [
    { id: 1, title: 'Ürün Bilgileri', icon: Package },
    { id: 2, title: 'Görseller', icon: ImageIcon },
    { id: 3, title: 'Pazaryerleri', icon: Store },
    { id: 4, title: 'Önizleme & Üret', icon: Sparkles },
];

interface FormData {
    brandName: string;
    rawUserPrompt: string;
    categoryId: number | undefined;
}

export default function NewProductPage() {
    const router = useRouter();
    const { balance: creditBalance, refetch: refetchCredits } = useCredits();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<FormData>({
        brandName: '',
        rawUserPrompt: '',
        categoryId: undefined,
    });

    const [images, setImages] = useState<File[]>([]);
    const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
    const [selectedMarketplaces, setSelectedMarketplaces] = useState<number[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mpRes, catRes] = await Promise.all([
                    marketplacesApi.list(),
                    categoriesApi.list(),
                ]);
                if (mpRes.success && mpRes.data) setMarketplaces(mpRes.data as Marketplace[]);
                if (catRes.success && catRes.data) setCategories(catRes.data as Category[]);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            }
        };
        fetchData();
    }, []);

    const creditCost = selectedMarketplaces.reduce((total, mpId) => {
        const mp = marketplaces.find(m => m.id === mpId);
        return total + (mp?.configs?.[0]?.config?.credit_cost ?? 1);
    }, 0);

    const availableCredits = typeof creditBalance === 'number' ? creditBalance : (creditBalance?.available || 0);

    const canProceed = () => {
        switch (currentStep) {
            case 1: return formData.rawUserPrompt.length >= 10;
            case 2: return true;
            case 3: return selectedMarketplaces.length > 0;
            case 4: return availableCredits >= creditCost;
            default: return false;
        }
    };

    const [generatingMessage, setGeneratingMessage] = useState('');

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError('');
        setGeneratingMessage('Ürün oluşturuluyor...');

        try {
            const productRes = await productsApi.create({
                brandName: formData.brandName || undefined,
                categoryId: formData.categoryId,
                rawUserPrompt: formData.rawUserPrompt,
                marketplaceIds: selectedMarketplaces,
            });

            if (!productRes.success || !productRes.data) throw new Error('Ürün oluşturulamadı');

            const product = productRes.data as { id: number };

            setGeneratingMessage('AI içerik üretiliyor... (Metin + Görseller)');
            await productsApi.generateAI(product.id);

            refetchCredits();
            setGeneratingMessage('Tamamlandı! Yönlendiriliyorsunuz...');

            // Short delay before redirect so user sees completion message
            setTimeout(() => {
                router.push(`/dashboard/products/${product.id}`);
            }, 500);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bir hata oluştu');
            setGeneratingMessage('');
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard/products" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Ürünlere dön
                </Link>
                <h1 className="text-2xl font-bold text-white">Yeni Ürün Ekle</h1>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                                    currentStep > step.id ? 'bg-green-500 text-white' :
                                        currentStep === step.id ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/40'
                                )}>
                                    {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                </div>
                                <span className={cn('text-xs mt-2 hidden sm:block', currentStep >= step.id ? 'text-white' : 'text-white/40')}>
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={cn('h-0.5 w-16 sm:w-24 mx-2', currentStep > step.id ? 'bg-green-500' : 'bg-white/10')} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 mb-6">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && <StepOne key="step-1" formData={formData} setFormData={setFormData} categories={categories} />}
                    {currentStep === 2 && <StepTwo key="step-2" images={images} onUpload={handleImageUpload} onRemove={(i) => setImages(prev => prev.filter((_, idx) => idx !== i))} />}
                    {currentStep === 3 && <StepThree key="step-3" marketplaces={marketplaces} selected={selectedMarketplaces} onToggle={(id) => setSelectedMarketplaces(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])} />}
                    {currentStep === 4 && <StepFour key="step-4" formData={formData} images={images} marketplaces={marketplaces.filter(m => selectedMarketplaces.includes(m.id))} creditCost={creditCost} creditBalance={creditBalance} />}
                </AnimatePresence>
            </div>

            <div className="flex items-center justify-between">
                <button onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)} disabled={currentStep === 1} className="flex items-center gap-2 px-4 py-2.5 text-white/60 hover:text-white disabled:opacity-30 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Geri
                </button>
                {currentStep < 4 ? (
                    <button onClick={() => canProceed() && setCurrentStep(currentStep + 1)} disabled={!canProceed()} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl disabled:opacity-50 transition-colors">
                        Devam
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/25">
                        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Üretiliyor...</> : <><Sparkles className="w-4 h-4" />İçerik Üret ({creditCost} kredi)</>}
                    </button>
                )}
            </div>

            {/* Full-screen loading overlay when generating */}
            <AnimatePresence>
                {isSubmitting && generatingMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
                    >
                        <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                                <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{generatingMessage}</h3>
                            <p className="text-white/50 text-sm">Bu işlem birkaç saniye sürebilir</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StepOne({ formData, setFormData, categories }: { formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>>; categories: Category[] }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-white mb-1">Ürün Bilgileri</h2>
                <p className="text-sm text-white/50">Ürününüz hakkında detaylı bilgi verin</p>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-white/60 mb-2">Marka (Opsiyonel)</label>
                    <input type="text" value={formData.brandName} onChange={(e) => setFormData({ ...formData, brandName: e.target.value })} placeholder="Örn: Samsung, Apple..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all" />
                </div>
                <div>
                    <label className="block text-sm text-white/60 mb-2">Kategori (Opsiyonel)</label>
                    <select value={formData.categoryId || ''} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 transition-all">
                        <option value="">Kategori seçin</option>
                        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-white/60 mb-2">Ürün Açıklaması <span className="text-red-400">*</span></label>
                    <textarea value={formData.rawUserPrompt} onChange={(e) => setFormData({ ...formData, rawUserPrompt: e.target.value })} placeholder="Ürününüzü detaylı olarak açıklayın..." rows={6} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all resize-none" />
                    <p className="text-xs text-white/40 mt-2">Minimum 10 karakter ({formData.rawUserPrompt.length}/10)</p>
                </div>
            </div>
        </motion.div>
    );
}

function StepTwo({ images, onUpload, onRemove }: { images: File[]; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; onRemove: (index: number) => void }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-white mb-1">Ürün Görselleri</h2>
                <p className="text-sm text-white/50">Ürününüzün fotoğraflarını yükleyin (opsiyonel)</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((file, index) => (
                    <div key={index} className="relative aspect-square bg-white/5 rounded-xl overflow-hidden group">
                        <img src={URL.createObjectURL(file)} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                        <button onClick={() => onRemove(index)} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <label className="aspect-square bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/[0.08] transition-all">
                    <Upload className="w-8 h-8 text-white/30 mb-2" />
                    <span className="text-sm text-white/40">Yükle</span>
                    <input type="file" accept="image/*" multiple onChange={onUpload} className="hidden" />
                </label>
            </div>
        </motion.div>
    );
}

function StepThree({ marketplaces, selected, onToggle }: { marketplaces: Marketplace[]; selected: number[]; onToggle: (id: number) => void }) {
    const getMarketplaceLogo = (name: string) => {
        const logos: Record<string, string> = {
            'trendyol': '/logo/trendyol.png',
            'hepsiburada': '/logo/hepsiburada.png',
            'amazon': '/logo/amazon.png',
        };
        return logos[name.toLowerCase()] || null;
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-white mb-1">Pazaryerlerini Seç</h2>
                <p className="text-sm text-white/50">İçerik üretmek istediğiniz pazaryerlerini seçin</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {marketplaces.map((mp) => {
                    const isSelected = selected.includes(mp.id);
                    const cost = mp.configs?.[0]?.config?.credit_cost ?? 1;
                    const logo = getMarketplaceLogo(mp.name);
                    return (
                        <button key={mp.id} onClick={() => onToggle(mp.id)} className={cn('p-4 rounded-xl border-2 text-left transition-all', isSelected ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20')}>
                            <div className="flex items-center gap-3 mb-3">
                                {logo ? (
                                    <img src={logo} alt={mp.name} className="w-10 h-10 object-cover rounded-lg" />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Store className="w-5 h-5 text-white/40" />
                                    </div>
                                )}
                                <span className="font-medium text-white flex-1">{mp.name}</span>
                                <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all', isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-white/30')}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-white/40">
                                <Coins className="w-3 h-3" />{cost} kredi
                            </div>
                        </button>
                    );
                })}
            </div>
            {marketplaces.length === 0 && <div className="text-center py-8 text-white/40"><Store className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>Pazaryeri bulunamadı</p></div>}
        </motion.div>
    );
}

function StepFour({ formData, images, marketplaces, creditCost, creditBalance }: { formData: FormData; images: File[]; marketplaces: Marketplace[]; creditCost: number; creditBalance: number | UserCredits }) {
    const availableCredits = typeof creditBalance === 'number' ? creditBalance : (creditBalance?.available || 0);
    const hasEnoughCredits = availableCredits >= creditCost;
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-white mb-1">Önizleme</h2>
                <p className="text-sm text-white/50">Bilgileri kontrol edin ve içerik üretin</p>
            </div>
            <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl"><p className="text-xs text-white/40 mb-1">Marka</p><p className="text-white">{formData.brandName || '-'}</p></div>
                <div className="p-4 bg-white/5 rounded-xl"><p className="text-xs text-white/40 mb-1">Açıklama</p><p className="text-white text-sm">{formData.rawUserPrompt}</p></div>
                <div className="p-4 bg-white/5 rounded-xl"><p className="text-xs text-white/40 mb-1">Görseller</p><p className="text-white">{images.length} adet</p></div>
                <div className="p-4 bg-white/5 rounded-xl"><p className="text-xs text-white/40 mb-2">Pazaryerleri</p><div className="flex flex-wrap gap-2">{marketplaces.map((mp) => <span key={mp.id} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm rounded-lg">{mp.name}</span>)}</div></div>
            </div>
            <div className={cn('p-4 rounded-xl border', hasEnoughCredits ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20')}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Coins className={cn('w-5 h-5', hasEnoughCredits ? 'text-green-400' : 'text-red-400')} />
                        <div><p className="text-sm font-medium text-white">Toplam Maliyet</p><p className="text-xs text-white/50">Bakiye: {availableCredits} kredi</p></div>
                    </div>
                    <span className={cn('text-2xl font-bold', hasEnoughCredits ? 'text-green-400' : 'text-red-400')}>{creditCost}</span>
                </div>
                {!hasEnoughCredits && <p className="mt-3 text-sm text-red-400">Yetersiz kredi. Lütfen kredi satın alın.</p>}
            </div>
        </motion.div>
    );
}
