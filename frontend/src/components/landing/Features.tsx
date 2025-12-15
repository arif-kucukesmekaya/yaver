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
import Image from "next/image";
import { cn } from '@/lib/utils';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

export function Features() {
    return (
        <section id="features" className="py-24 md:py-32 relative overflow-hidden">
            {/* Background Gradient for Depth - Smoother Blend */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none" />
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
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-transparent relative overflow-hidden flex items-center justify-center">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-50" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Main Content Container - Perfectly Centered */}
            <div className="relative z-10 flex items-center justify-between w-full max-w-[85%] px-2">

                {/* Left: Source Hub */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                        {/* Minimalist Yaver Logo V2 - Exact Image */}
                        <div className="relative w-full h-full p-2">
                            <Image
                                src="/yaver-logo.png"
                                alt="Yaver AI Logo"
                                fill
                                className="object-contain rounded-2xl drop-shadow-[0_0_15px_rgba(129,140,248,0.6)]"
                            />
                        </div>
                    </div>
                    <span className="text-xs text-indigo-300 font-medium">Yaver AI</span>
                </div>

                {/* Laser Overlay */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="laser-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.1" />
                                <stop offset="50%" stopColor="#818CF8" stopOpacity="1" />
                                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.1" />
                            </linearGradient>
                            <filter id="glow-strong" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feFlood floodColor="#818CF8" floodOpacity="0.5" result="glowColor" />
                                <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow" />
                                <feMerge>
                                    <feMergeNode in="softGlow" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Top */}
                        <motion.path
                            d="M 18 50 C 40 50, 60 20, 85 20"
                            stroke="url(#laser-gradient)" strokeWidth="1" fill="none" filter="url(#glow-strong)"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                        {/* Middle */}
                        <motion.path
                            d="M 18 50 L 85 50"
                            stroke="url(#laser-gradient)" strokeWidth="1" fill="none" filter="url(#glow-strong)"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }}
                            transition={{ duration: 2, delay: 0.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                        {/* Bottom */}
                        <motion.path
                            d="M 18 50 C 40 50, 60 80, 85 80"
                            stroke="url(#laser-gradient)" strokeWidth="1" fill="none" filter="url(#glow-strong)"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }}
                            transition={{ duration: 2, delay: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                    </svg>
                </div>

                {/* Right: Target Stack */}
                <div className="flex flex-col gap-3 z-20 w-32 shrink-0">
                    {/* Trendyol */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className="bg-[#0F0F11]/80 backdrop-blur-sm border border-white/5 p-2 rounded-lg flex items-center justify-between group hover:border-orange-500/30 transition-colors shadow-lg"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                        <span className="text-[10px] font-medium text-gray-400 group-hover:text-white transition-colors">Trendyol</span>
                        <div className="h-4 w-0.5 bg-orange-500/20 rounded-full" />
                    </motion.div>

                    {/* Hepsiburada */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                        className="bg-[#0F0F11]/80 backdrop-blur-sm border border-white/5 p-2 rounded-lg flex items-center justify-between group hover:border-orange-400/30 transition-colors shadow-lg"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c]" />
                        <span className="text-[10px] font-medium text-gray-400 group-hover:text-white transition-colors">Hepsiburada</span>
                        <div className="h-4 w-0.5 bg-orange-400/20 rounded-full" />
                    </motion.div>

                    {/* Amazon */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                        className="bg-[#0F0F11]/80 backdrop-blur-sm border border-white/5 p-2 rounded-lg flex items-center justify-between group hover:border-yellow-500/30 transition-colors shadow-lg"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]" />
                        <span className="text-[10px] font-medium text-gray-400 group-hover:text-white transition-colors">Amazon</span>
                        <div className="h-4 w-0.5 bg-yellow-500/20 rounded-full" />
                    </motion.div>
                </div>

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
