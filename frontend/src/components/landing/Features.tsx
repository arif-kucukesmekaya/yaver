'use client';

import { motion } from 'framer-motion';
import {
    Sparkles,
    Search,
    Globe,
    BarChart3,
    Zap,
    Box
} from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

export function Features() {
    return (
        <section id="features" className="py-24 md:py-32 relative overflow-hidden">
            {/* Background Gradient for Depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-indigo-500/5 to-black/0 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-4"
                    >
                        Sadece Bir Araç Değil,<br />
                        <span className="text-indigo-400">Tam Donanımlı Bir Asistan.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-white/50 max-w-2xl mx-auto"
                    >
                        Yapay zeka ile e-ticaret süreçlerinizi uçtan uca otomatikleştirin.
                        Manuel iş yükünden kurtulun.
                    </motion.p>
                </div>

                {/* Aceternity Bento Grid */}
                <BentoGrid className="max-w-6xl mx-auto">
                    {items.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={cn(
                                "bg-black/40 border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm",
                                i === 0 || i === 3 ? "md:col-span-2" : ""
                            )}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}

const items = [
    {
        title: "GPT-4 Turbo Entegrasyonu",
        description: "Piyasadaki en gelişmiş dil modellerini kullanarak, rakiplerinizden ayırt edilemeyecek kadar doğal ve satış odaklı ürün açıklamaları oluşturun.",
        header: <SkeletonOne />,
        icon: <Sparkles className="h-4 w-4 text-indigo-400" />,
    },
    {
        title: "SEO Dominasyonu",
        description: "Google ve pazaryeri algoritmaları için optimize edilmiş anahtar kelimeler.",
        header: <SkeletonTwo />,
        icon: <Search className="h-4 w-4 text-emerald-400" />,
    },
    {
        title: "Global Satış",
        description: "Tek tıkla 30+ dile çeviri ve yerelleştirme desteği.",
        header: <SkeletonThree />,
        icon: <Globe className="h-4 w-4 text-blue-400" />,
    },
    {
        title: "Performans Analitiği",
        description: "Hangi içeriğin daha çok sattığını analiz edin ve stratejinizi geliştirin.",
        header: <SkeletonFour />,
        icon: <BarChart3 className="h-4 w-4 text-violet-400" />,
    },
    {
        title: "Toplu İşlem",
        description: "Binlerce ürünü Excel/XML ile yükleyin, dakikalar içinde işleyin.",
        header: <SkeletonFive />,
        icon: <Zap className="h-4 w-4 text-amber-400" />,
    },
];

// Skeleton Components for Visuals inside Bento Cards

function SkeletonOne() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-900/20 to-black border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
                <div className="inline-block px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono animate-pulse">
                    Generating Description...
                </div>
            </div>
        </div>
    );
}

function SkeletonTwo() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-900/20 to-black border border-white/5 relative overflow-hidden">
            <div className="p-4 space-y-2">
                <div className="w-3/4 h-2 bg-emerald-500/20 rounded-full animate-pulse delay-75" />
                <div className="w-1/2 h-2 bg-emerald-500/20 rounded-full animate-pulse delay-150" />
                <div className="w-full h-2 bg-emerald-500/20 rounded-full animate-pulse delay-300" />
            </div>
        </div>
    );
}

function SkeletonThree() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-900/20 to-black border border-white/5 relative overflow-hidden flex items-center justify-center">
            <Globe className="w-12 h-12 text-blue-500/20 absolute" />
            <div className="relative z-10 grid grid-cols-2 gap-2">
                <span className="text-[10px] bg-blue-500/10 px-2 py-1 rounded text-blue-300 border border-blue-500/20">EN</span>
                <span className="text-[10px] bg-blue-500/10 px-2 py-1 rounded text-blue-300 border border-blue-500/20">TR</span>
                <span className="text-[10px] bg-blue-500/10 px-2 py-1 rounded text-blue-300 border border-blue-500/20">DE</span>
                <span className="text-[10px] bg-blue-500/10 px-2 py-1 rounded text-blue-300 border border-blue-500/20">FR</span>
            </div>
        </div>
    );
}

function SkeletonFour() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-violet-900/20 to-black border border-white/5 relative overflow-hidden flex items-end justify-center p-4 gap-1">
            {[40, 70, 50, 90, 60, 80].map((h, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 10 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="w-full bg-violet-500/40 rounded-t-sm hover:bg-violet-400 transition-colors"
                />
            ))}
        </div>
    );
}

function SkeletonFive() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-amber-900/20 to-black border border-white/5 relative overflow-hidden flex items-center justify-center">
            <div className="flex gap-2">
                <Box className="w-6 h-6 text-amber-500/40" />
                <Box className="w-6 h-6 text-amber-500/60" />
                <Box className="w-6 h-6 text-amber-500/80" />
                <Box className="w-6 h-6 text-amber-500" />
            </div>
        </div>
    );
}
