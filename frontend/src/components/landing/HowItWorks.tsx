
'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap, Share2, Box, Layers, Globe, Store, Sparkles, UploadCloud, Cpu, Rocket, FileInput, Laptop } from "lucide-react";
import { TracingBeam } from "@/components/ui/tracing-beam";

// ===============================================
// HOW IT WORKS - CONTENT
// ===============================================

const steps = [
    {
        id: "connect",
        title: "1. Entegrasyon",
        desc: "Pazaryerlerini sisteme kolaylıkla bağlayın.",
        icon: Share2,
        accent: "text-blue-400",
        shadow: "shadow-blue-500/20",
        MockComponent: MockIntegrationUI
    },
    {
        id: "upload",
        title: "2. Veri Girişi",
        desc: "Ürün resimlerinizi ve temel bilgileri sisteme girin.",
        icon: UploadCloud, // Or FileInput
        accent: "text-indigo-400",
        shadow: "shadow-indigo-500/20",
        MockComponent: MockUploadUI
    },
    {
        id: "generate",
        title: "3. Yapay Zeka Üretimi",
        desc: "AI sizin için inanılmaz ürün resimleri ve her pazaryeri algoritmasına göre SEO uyumlu açıklama ve title üretsin.",
        icon: Cpu,
        accent: "text-amber-400",
        shadow: "shadow-amber-500/20",
        MockComponent: MockGenerationUI
    },
    {
        id: "publish",
        title: "4. Yayına Al & Büyü",
        desc: "Kolaylıkla yayına alın, AI gücünü kullanarak rakiplerin önüne geçin ve global satış yakalayın.",
        icon: Rocket,
        accent: "text-emerald-400",
        shadow: "shadow-emerald-500/20",
        MockComponent: MockGlobalUI
    },
];

export function HowItWorks() {
    return (
        <section className="relative py-24 w-full" id="how-it-works">
            <div className="text-center mb-16 max-w-3xl mx-auto px-6 relative z-10">


                <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                    Sistem <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-indigo-400 animate-gradient-x">Nasıl Çalışır?</span>
                </h2>
            </div>

            {/* Reduced width to max-w-3xl to bring content closer to center */}
            <TracingBeam className="px-6 max-w-3xl">
                <div className="relative mx-auto pt-4 antialiased">
                    {steps.map((step, index) => (
                        <div key={`content - ${index} `} className="mb-24 relative flex flex-col items-center text-center md:items-start md:text-left">

                            {/* Visual Badge - Now auto-centered on mobile via flex-col items-center, left on desktop */}
                            <h2 className={cn("bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4 flex items-center gap-2 border border-white/10", step.shadow)}>
                                <step.icon className={cn("w-4 h-4", step.accent)} />
                                {step.title}
                            </h2>

                            {/* Increased max-width to match card */}
                            <p className={cn("text-xl mb-8 text-white/70 max-w-2xl")}>
                                {step.desc}
                            </p>

                            {/* Mock UI Container - Floating & Glassy */}
                            <div className="relative w-full max-w-2xl rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-4 h-[380px] overflow-hidden shadow-2xl group hover:border-white/20 transition-all duration-500 mx-auto md:mx-0">
                                <step.MockComponent accent={step.accent} />
                            </div>
                        </div>
                    ))}
                </div>
            </TracingBeam>
        </section>
    );
}

// ==================================
// High-Fidelity Mock UIs
// ==================================

function MockIntegrationUI({ accent }: { accent: string }) {
    return (
        <div className="w-full h-full flex items-center justify-between px-8 relative">
            {/* Left: Yaver AI Hub */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                >
                    <div className="relative w-full h-full p-2">
                        <Image
                            src="/yaver-logo.png"
                            alt="Yaver AI Logo"
                            fill
                            className="object-contain rounded-2xl"
                        />
                    </div>
                </motion.div>
                <span className="text-xs text-indigo-300 font-medium">Yaver AI</span>
            </div>

            {/* Connection Lines */}
            <div className="flex-1 relative h-32 mx-4">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Static background paths */}
                    <path d="M 0 50 C 50 50, 50 20, 100 20" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                    <path d="M 0 50 L 100 50" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                    <path d="M 0 50 C 50 50, 50 80, 100 80" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />

                    {/* Animated paths */}
                    <motion.path
                        d="M 0 50 C 50 50, 50 20, 100 20"
                        stroke="#F97316" strokeWidth="2" fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M 0 50 L 100 50"
                        stroke="#FB923C" strokeWidth="2" fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M 0 50 C 50 50, 50 80, 100 80"
                        stroke="#FBBF24" strokeWidth="2" fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                </svg>
            </div>

            {/* Right: Marketplaces */}
            <div className="flex flex-col gap-2 z-10">
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 px-4 py-2.5 rounded-xl"
                >
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                    <span className="text-sm text-white font-medium">Trendyol</span>
                    <span className="text-[9px] text-emerald-400 ml-auto">✓ Bağlı</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 bg-orange-400/10 border border-orange-400/30 px-4 py-2.5 rounded-xl"
                >
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c]" />
                    <span className="text-sm text-white font-medium">Hepsiburada</span>
                    <span className="text-[9px] text-emerald-400 ml-auto">✓ Bağlı</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 px-4 py-2.5 rounded-xl"
                >
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]" />
                    <span className="text-sm text-white font-medium">Amazon</span>
                    <span className="text-[9px] text-emerald-400 ml-auto">✓ Bağlı</span>
                </motion.div>
            </div>
        </div>
    );
}

function MockUploadUI({ accent }: { accent: string }) {
    return (
        <div className="w-full h-full flex gap-4 p-4 relative">
            {/* Left: Image Upload Area */}
            <div className="flex-1 flex flex-col gap-3">
                {/* Drop Zone with Preview */}
                <motion.div
                    animate={{ borderColor: ['rgba(99,102,241,0.3)', 'rgba(99,102,241,0.5)', 'rgba(99,102,241,0.3)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex-1 rounded-xl border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 flex flex-col items-center justify-center gap-3 relative overflow-hidden"
                >
                    {/* Simulated uploaded image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="w-24 h-24 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center relative overflow-hidden"
                    >
                        <Store className="w-10 h-10 text-indigo-400/50" />
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                    <div className="flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs text-indigo-300">product_image.jpg</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                        />
                    </div>
                    <span className="text-[10px] text-emerald-400">✓ Yüklendi</span>
                </motion.div>
            </div>

            {/* Right: Form Fields */}
            <div className="flex-1 flex flex-col gap-3">
                {/* Product Name Field */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="text-[10px] text-white/40 mb-2">Ürün Adı</div>
                    <div className="flex items-center gap-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '80%' }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-2 bg-indigo-400/30 rounded-full"
                        />
                        <motion.div
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-0.5 h-4 bg-indigo-400"
                        />
                    </div>
                </div>

                {/* Category Field */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="text-[10px] text-white/40 mb-2">Kategori</div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/70">Elektronik</span>
                        <span className="text-white/30">›</span>
                        <span className="text-xs text-white/70">Kulaklık</span>
                    </div>
                </div>

                {/* Target Marketplaces */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex-1">
                    <div className="text-[10px] text-white/40 mb-2">Hedef Pazaryerleri</div>
                    <div className="flex flex-wrap gap-1.5">
                        {['Trendyol', 'Amazon', 'Hepsiburada'].map((mp, i) => (
                            <motion.div
                                key={mp}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + i * 0.15 }}
                                className="px-2 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-md text-[10px] text-indigo-300"
                            >
                                ✓ {mp}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-center text-sm text-white font-medium shadow-lg shadow-indigo-500/30 cursor-pointer"
                >
                    AI ile Oluştur →
                </motion.div>
            </div>
        </div>
    );
}


function MockGenerationUI({ accent }: { accent: string }) {
    return (
        <div className="relative w-full h-full flex flex-col p-4 gap-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                    </motion.div>
                    <span className="text-xs text-amber-200 font-medium">Yaver AI Oluşturuyor</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 rounded-full">
                    <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-amber-400 rounded-full"
                    />
                    <span className="text-[9px] text-amber-300">İşleniyor</span>
                </div>
            </div>

            <div className="flex gap-4 flex-1">
                {/* Left: Image Enhancement */}
                <div className="w-1/3 flex flex-col gap-2">
                    <div className="flex-1 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-xl relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Store className="w-12 h-12 text-amber-400/40" />
                        </div>
                        {/* Scan effect */}
                        <motion.div
                            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                            animate={{ top: ['0%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        {/* HQ Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5 }}
                            className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-emerald-500/20 rounded text-[8px] text-emerald-400 border border-emerald-500/30"
                        >
                            ✓ HQ
                        </motion.div>
                    </div>
                    <div className="text-[10px] text-center text-white/40">AI Görsel</div>
                </div>

                {/* Right: Generated Content */}
                <div className="flex-1 flex flex-col gap-2">
                    {/* Title */}
                    <div className="bg-white/5 border border-amber-500/20 rounded-lg p-3 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[10px] text-amber-400 uppercase">SEO Başlık</span>
                        </div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-xs text-white/80"
                        >
                            Premium Bluetooth Kulaklık 5.0...
                        </motion.p>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-[8px] px-1 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">98 SEO</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white/5 border border-amber-500/20 rounded-lg p-3 flex-1 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[10px] text-amber-400 uppercase">Açıklama</span>
                        </div>
                        <div className="space-y-1.5">
                            {[100, 95, 80, 60].map((width, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: `${width}%`, opacity: 1 }}
                                    transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}
                                    className="h-2 bg-white/10 rounded-full"
                                />
                            ))}
                        </div>
                        <motion.div
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="absolute bottom-3 right-3 w-0.5 h-4 bg-amber-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MockGlobalUI({ accent }: { accent: string }) {
    return (
        <div className="w-full h-full relative overflow-hidden p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Success Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-4"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                    >
                        <Rocket className="w-6 h-6 text-emerald-400" />
                    </motion.div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Yayında!</h3>
                        <p className="text-xs text-emerald-400">3 pazaryerinde aktif</p>
                    </div>
                </motion.div>

                {/* Marketplace Status Cards */}
                <div className="flex gap-2 justify-center mb-4">
                    {[
                        { name: 'Trendyol', status: 'Aktif', color: 'orange' },
                        { name: 'Amazon', status: 'Aktif', color: 'yellow' },
                        { name: 'Hepsiburada', status: 'Aktif', color: 'orange' },
                    ].map((mp, i) => (
                        <motion.div
                            key={mp.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.15 }}
                            className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center"
                        >
                            <div className="text-xs font-medium text-white">{mp.name}</div>
                            <div className="flex items-center justify-center gap-1 mt-1">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-[9px] text-emerald-400">{mp.status}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Row */}
                <div className="flex gap-3 justify-center">
                    {[
                        { label: 'SEO Skoru', value: '98.5', icon: '🎯' },
                        { label: 'Görüntülenme', value: '12.4K', icon: '👁️' },
                        { label: 'Dönüşüm', value: '+24%', icon: '📈' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + i * 0.15 }}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-center"
                        >
                            <span className="text-lg">{stat.icon}</span>
                            <div className="text-sm font-bold text-white">{stat.value}</div>
                            <div className="text-[9px] text-white/50">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Success Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-2 right-2 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center gap-1"
                >
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[9px] text-emerald-300">Canlı</span>
                </motion.div>
            </div>
        </div>
    );
}

