'use client';

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap, Share2, Box, Layers, Globe, Store, Sparkles } from "lucide-react";
import { TracingBeam } from "@/components/ui/tracing-beam";

// ===============================================
// HOW IT WORKS - CONTENT
// ===============================================

const steps = [
    {
        id: "integrations",
        title: "Entegrasyon",
        desc: "Tek satır kodla tüm pazaryerlerine bağlanın.",
        icon: Share2,
        accent: "text-blue-400",
        shadow: "shadow-blue-500/20",
        MockComponent: MockIntegrationUI
    },
    {
        id: "orchestration",
        title: "Orkestrasyon",
        desc: "Stok ve fiyat politikalarını tek merkezden yönetin.",
        icon: Layers,
        accent: "text-purple-400",
        shadow: "shadow-purple-500/20",
        MockComponent: MockOrchestrationUI
    },
    {
        id: "generation",
        title: "AI Üretimi",
        desc: "Her ürün için SEO uyumlu açıklamalar oluşturun.",
        icon: Box,
        accent: "text-amber-400",
        shadow: "shadow-amber-500/20",
        MockComponent: MockGenerationUI
    },
    {
        id: "global",
        title: "Global Satış",
        desc: "Sınırları kaldırın, dünyaya açılın.",
        icon: Globe,
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
                        <div key={`content-${index}`} className="mb-24 relative flex flex-col items-center text-center md:items-start md:text-left">

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
        <div className="w-full h-full flex flex-col gap-3">
            {/* Fake Code Editor */}
            <div className="flex-1 bg-black/50 rounded-xl border border-white/10 p-4 font-mono text-[10px] text-white/40 leading-relaxed overflow-hidden">
                <div className="flex gap-1.5 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
                <p><span className="text-purple-400">const</span> <span className="text-blue-400">products</span> = <span className="text-purple-400">await</span> xml.<span className="text-yellow-400">parse</span>(feed);</p>
                <p><span className="text-purple-400">const</span> <span className="text-blue-400">analysis</span> = <span className="text-purple-400">await</span> ai.<span className="text-yellow-400">scan</span>(products);</p>
                <p className="mt-2"><span className="text-gray-500">// Auto-detected 1,240 items</span></p>
                <p><span className="text-green-400">return</span> analysis.optimized;</p>
            </div>

            {/* Status Bar */}
            <div className="h-10 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-medium">Sync Active</span>
                </div>
                <div className="text-[10px] text-white/30">Latency: 24ms</div>
            </div>
        </div>
    );
}

function MockOrchestrationUI({ accent }: { accent: string }) {
    return (
        <div className="w-full grid grid-cols-2 gap-3">
            {['Trendyol', 'Amazon', 'Hepsiburada', 'Etsy'].map((mp, i) => (
                <div key={mp} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between group hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                        <Store className={cn("w-4 h-4", accent)} />
                        <div className={cn("w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-green-400 transition-colors")} />
                    </div>
                    <div>
                        <div className="text-xs text-white mb-0.5">{mp}</div>
                        <div className="text-[10px] text-white/40">Connected</div>
                    </div>
                </div>
            ))}

            {/* Connecting Lines Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full border border-white/10 bg-black/80 backdrop-blur flex items-center justify-center shadow-xl">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                </div>
            </div>
        </div>
    );
}

function MockGenerationUI({ accent }: { accent: string }) {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Brain/AI Visualization */}
            <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/10 via-transparent to-transparent" />

            <div className="relative z-10 w-full space-y-3">
                <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-fuchsia-400" />
                    <div className="text-xs font-medium text-white/80">Yaver AI Processing</div>
                </div>

                <div className="space-y-2">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="h-8 bg-white/5 rounded-lg border border-white/5 flex items-center px-3 gap-3 overflow-hidden">
                            <div className="w-1 h-4 bg-fuchsia-500/50 rounded-full" />
                            <div className={cn("flex-1 h-1.5 rounded-full bg-white/10 relative overflow-hidden")}>
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-fuchsia-500"
                                    initial={{ width: '0%' }}
                                    whileInView={{ width: '100%' }}
                                    transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity, repeatDelay: 2 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MockGlobalUI({ accent }: { accent: string }) {
    return (
        <div className="w-full h-full relative">
            {/* Map Grid */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-1 opacity-20">
                {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border border-white/20 rounded-sm" />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
                <div className="relative">
                    <div className="absolute -inset-4 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                    <Globe className="w-16 h-16 text-emerald-400 relative z-10" strokeWidth={1} />
                </div>

                <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400">TR</span>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400">US</span>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400">EU</span>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            </div>
        </div>
    );
}
