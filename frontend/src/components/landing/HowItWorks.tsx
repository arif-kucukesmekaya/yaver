
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
                            <div className="relative w-full max-w-2xl rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-4 h-[300px] overflow-hidden shadow-2xl group hover:border-white/20 transition-all duration-500 mx-auto md:mx-0">
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
            {/* Left: Yaver AI (Main Hub) */}
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

            {/* Connection Lines (Animated) */}
            <div className="flex-1 relative h-24 mx-4">
                {/* Top Line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Path to Top */}
                    <path d="M 0 50 C 50 50, 50 15, 100 15" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                    <motion.path
                        d="M 0 50 C 50 50, 50 15, 100 15"
                        stroke="#818cf8" strokeWidth="2" fill="none"
                        initial={{ pathLength: 0, opacity: 0.5 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />

                    {/* Path to Middle */}
                    <path d="M 0 50 L 100 50" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                    <motion.path
                        d="M 0 50 L 100 50"
                        stroke="#818cf8" strokeWidth="2" fill="none"
                        initial={{ pathLength: 0, opacity: 0.5 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />

                    {/* Path to Bottom */}
                    <path d="M 0 50 C 50 50, 50 85, 100 85" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                    <motion.path
                        d="M 0 50 C 50 50, 50 85, 100 85"
                        stroke="#818cf8" strokeWidth="2" fill="none"
                        initial={{ pathLength: 0, opacity: 0.5 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                </svg>
            </div>

            {/* Right: Marketplaces (Stacked) */}
            <div className="flex flex-col gap-3 z-10">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg w-32 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-xs text-white/70">Trendyol</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg w-32 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-xs text-white/70">Hepsiburada</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg w-32 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-xs text-white/70">Amazon</span>
                </div>
            </div>
        </div>
    );
}

function MockUploadUI({ accent }: { accent: string }) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-6 gap-4">
            {/* Image Drop Zone */}
            <div className="w-full flex-1 rounded-xl border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 flex flex-col items-center justify-center gap-2 group hover:border-indigo-500/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-xs text-indigo-200/70">Ürün görselini sürükleyin</p>
            </div>

            {/* Text Input Simulation */}
            <div className="w-full space-y-3">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-start gap-3">
                    <FileInput className="w-4 h-4 text-white/30 mt-0.5" />
                    <div className="flex-1 space-y-2">
                        <div className="h-2 w-1/3 bg-white/10 rounded-full" />
                        <div className="h-2 w-full bg-white/5 rounded-full" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="px-3 py-1 bg-indigo-500 rounded text-[10px] text-white font-medium">Yükle</div>
                </div>
            </div>
        </div>
    );
}


function MockGenerationUI({ accent }: { accent: string }) {
    return (
        <div className="relative w-full h-full flex flex-col p-4 gap-4">

            {/* Header / Processing Status */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-amber-100 font-medium">Yaver AI Oluşturuyor...</span>
                </div>
            </div>

            <div className="flex gap-4 h-full">
                {/* Left: Image Output */}
                <div className="w-1/3 flex flex-col gap-2">
                    <div className="flex-1 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-lg relative overflow-hidden group">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Store className="w-8 h-8 text-amber-500/50" />
                        </div>
                        {/* Shimmer Scan */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-[8px] text-amber-400 border border-amber-500/30">HQ</div>
                    </div>
                    <div className="text-[10px] text-center text-white/40">Görsel</div>
                </div>

                {/* Right: Text Outputs */}
                <div className="flex-1 flex flex-col gap-3">
                    {/* Title Gen */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="text-[10px] text-amber-400/80 uppercase">Başlık</span>
                        </div>
                        <div className="h-2 w-3/4 bg-white/10 rounded-full animate-pulse" />
                        <div className="h-2 w-1/2 bg-white/10 rounded-full animate-pulse delay-75" />
                    </div>

                    {/* Desc Gen */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2 relative overflow-hidden flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="text-[10px] text-amber-400/80 uppercase">Açıklama</span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="h-2 w-full bg-white/5 rounded-full" />
                            <div className="h-2 w-full bg-white/5 rounded-full" />
                            <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MockGlobalUI({ accent }: { accent: string }) {
    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* Map Grid */}
            <div className="absolute inset-x-0 bottom-0 h-full bg-[linear-gradient(to_bottom,transparent,rgba(16,185,129,0.1))] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6">
                <div className="relative group cursor-pointer hover:scale-110 transition-transform duration-500">
                    <div className="absolute -inset-8 bg-emerald-500/30 blur-2xl rounded-full animate-pulse" />
                    <Rocket className="w-20 h-20 text-emerald-400 relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
                </div>

                <div className="text-center space-y-1">
                    <h3 className="text-2xl font-bold text-white tracking-widest">PUBLISHED</h3>
                    <p className="text-emerald-400 text-sm">Global Sales Active</p>
                </div>

                <div className="flex gap-2 mt-2">
                    {['Trendyol', 'Amazon', 'Hepsiburada'].map((region, i) => (
                        <motion.div
                            key={region}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 font-bold flex items-center gap-1"
                        >
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            {region}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

