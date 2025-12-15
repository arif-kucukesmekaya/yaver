'use client';

import { motion } from 'framer-motion';
import {
    Sparkles,
    Search,
    Globe,
    BarChart3,
    Zap,
    FileText,
    Tags,
    Database,
    Share2,
    TrendingUp,
    Store,
    LayoutTemplate
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

export function Features() {
    return (
        <section id="features" className="py-24 md:py-32 relative overflow-hidden bg-black">
            {/* Background Gradient for Depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950/20 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6 tracking-tight"
                    >
                        Pazaryeri Entegrasyonunun<br />
                        <span className="text-indigo-400">Geleceğini Keşfedin.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
                    >
                        Tek bir platformdan tüm dünyaya satış yapın.
                        Yapay zeka asistanınız stoğunuzu, içeriklerinizi ve satışlarınızı yönetsin.
                    </motion.p>
                </div>

                {/* Acernity Bento Grid - Adjusted for 5 items (2-row, 3-column grid) */}
                <BentoGrid className="max-w-6xl mx-auto md:grid-cols-3">
                    {items.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={cn(
                                "bg-black/40 border-white/5 hover:border-white/10 transition-colors backdrop-blur-md",
                                // Item 0 (Marketplaces) spans 2 cols
                                i === 0 ? "md:col-span-2" : "",
                                // Item 1 (Global) spans 1 col
                                // Row 2: Item 2, 3, 4 each span 1 col
                            )}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}

// ===========================================
// SKELETON DEFINITIONS
// ===========================================

function SkeletonMarketplaces() {
    // Visualizing 1 Product -> 3 Marketplaces
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-900/20 to-black border border-white/5 relative overflow-hidden flex items-center justify-center p-6 gap-4">
            {/* Central Hub */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-xl shadow-xl flex items-center justify-center border border-indigo-500/30 relative z-10">
                    <Store className="w-6 h-6 text-black" />
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 border-2 border-indigo-500 rounded-xl animate-ping opacity-20" />
                </div>
                <div className="h-8 w-0.5 bg-gradient-to-b from-white/20 to-transparent mt-2 md:hidden" />
            </div>

            {/* Connecting Lines (Desktop) */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Marketplaces */}
            <div className="flex gap-4 md:gap-12 absolute md:relative w-full justify-between px-4 md:px-0 opacity-20 md:opacity-100 scale-75 md:scale-100">
                {/* Trendyol */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2 bg-black/40 p-3 rounded-lg border border-orange-500/30 backdrop-blur-sm"
                >
                    <span className="text-orange-500 font-bold text-xs">Trendyol</span>
                    <div className="w-8 h-1 bg-orange-500/20 rounded-full" />
                    <div className="w-6 h-1 bg-orange-500/20 rounded-full" />
                </motion.div>

                {/* Hepsiburada */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2 bg-black/40 p-3 rounded-lg border border-orange-400/30 backdrop-blur-sm"
                >
                    <span className="text-orange-400 font-bold text-xs">Hepsiburada</span>
                    <div className="w-8 h-1 bg-orange-400/20 rounded-full" />
                    <div className="w-6 h-1 bg-orange-400/20 rounded-full" />
                </motion.div>

                {/* Amazon */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2 bg-black/40 p-3 rounded-lg border border-yellow-500/30 backdrop-blur-sm"
                >
                    <span className="text-yellow-500 font-bold text-xs">Amazon</span>
                    <div className="w-8 h-1 bg-yellow-500/20 rounded-full" />
                    <div className="w-6 h-1 bg-yellow-500/20 rounded-full" />
                </motion.div>
            </div>
        </div>
    );
}

function SkeletonGlobal() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-900/20 to-black border border-white/5 relative overflow-hidden flex items-center justify-center group">
            {/* Orbiting Elements */}
            <div className="absolute w-32 h-32 rounded-full border border-blue-500/10 group-hover:border-blue-500/30 transition-colors" />

            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-full flex items-center justify-center"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full blur-[1px] translate-x-12 -translate-y-6" />
            </motion.div>

            <Globe className="w-12 h-12 text-blue-500/40 relative z-10 group-hover:text-blue-400 transition-colors" />

            <div className="absolute bottom-3 left-3 flex gap-1 z-10">
                <div className="px-1.5 py-0.5 bg-blue-500/20 rounded text-[9px] text-blue-300 border border-blue-500/30">EN</div>
                <div className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] text-white/50 border border-white/10">TR</div>
            </div>
        </div>
    );
}

function SkeletonGemini() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-fuchsia-900/20 to-black border border-white/5 relative overflow-hidden flex items-center justify-center">
            <div className="relative w-24 h-24 rounded-lg bg-black/50 border border-white/10 overflow-hidden group">
                {/* Image Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                    <Sparkles className="w-8 h-8 opacity-50" />
                </div>

                {/* Scanner Line */}
                <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)] z-10"
                />

                {/* Enhanced State Overlay */}
                <motion.div
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-fuchsia-500/20"
                />
            </div>

            <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-fuchsia-300 uppercase tracking-widest">Gemini</span>
            </div>
        </div>
    );
}

function SkeletonSEO() {
    const variants = {
        initial: { y: 0 },
        animate: {
            y: [-5, 5, -5],
            transition: {
                duration: 4,
                ease: "easeInOut" as const,
                repeat: Infinity,
            },
        },
    };

    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-900/20 to-black border border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-4">
            <div className="flex flex-col gap-2">
                <motion.div variants={variants} initial="initial" animate="animate" className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 w-fit mx-auto">
                    <Search className="w-3 h-3" />
                    <span>SEO Smasher</span>
                </motion.div>

                {/* Fake Text Lines */}
                <div className="space-y-1.5 w-32 mx-auto opacity-50">
                    <div className="h-1.5 bg-emerald-500/20 rounded-full w-full" />
                    <div className="h-1.5 bg-emerald-500/20 rounded-full w-3/4" />
                    <div className="h-1.5 bg-emerald-500/20 rounded-full w-5/6" />
                </div>
            </div>
        </div>
    );
}

function SkeletonSpeed() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-amber-900/20 to-black border border-white/5 relative overflow-hidden flex items-center justify-center">
            {/* Speed Gauge / Timer */}
            <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                    <motion.circle
                        cx="50" cy="50" r="40"
                        stroke="#f59e0b"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray="251.2"
                        strokeDashoffset="251.2"
                        animate={{ strokeDashoffset: 50 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-amber-500" />
                </div>
            </div>
            <div className="absolute top-2 left-2 text-[10px] text-amber-500/50 font-mono">0.4s</div>
        </div>
    );
}


// ===========================================
// ITEMS DATA
// ===========================================

const items = [
    {
        title: "Tek Tıkla 3 Dev Pazaryeri",
        description: "Trendyol, Hepsiburada ve Amazon kurallarına %100 uyumlu, özelleştirilmiş içerik üretimi ve entegrasyonu.",
        header: <SkeletonMarketplaces />,
        icon: <LayoutTemplate className="h-4 w-4 text-indigo-400" />,
    },
    {
        title: "Global Satış Vizyonu",
        description: "Amazon için otomatik İngilizce çeviri ve bullet-point formatında açıklama.",
        header: <SkeletonGlobal />,
        icon: <Globe className="h-4 w-4 text-blue-400" />,
    },
    {
        title: "Gemini Görsel Sihirbazı",
        description: "Kötü ışıklı, amatör ürün fotoğraflarını stüdyo kalitesine dönüştürün.",
        header: <SkeletonGemini />,
        icon: <Sparkles className="h-4 w-4 text-fuchsia-400" />,
    },
    {
        title: "Satış Odaklı SEO",
        description: "Arama algoritmalarına uygun, organik trafiği artıran başlık ve açıklamalar.",
        header: <SkeletonSEO />,
        icon: <Tags className="h-4 w-4 text-emerald-400" />,
    },
    {
        title: "Hız & Kolaylık",
        description: "Manuel iş yükünü bitirin. Ürünü yükleyin, gerisini bize bırakın.",
        header: <SkeletonSpeed />,
        icon: <Zap className="h-4 w-4 text-amber-400" />,
    },
];
