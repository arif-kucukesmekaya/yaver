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
    const containerRef = React.useRef<HTMLDivElement>(null);
    const sourceRef = React.useRef<HTMLDivElement>(null);
    const target1Ref = React.useRef<HTMLDivElement>(null);
    const target2Ref = React.useRef<HTMLDivElement>(null);
    const target3Ref = React.useRef<HTMLDivElement>(null);
    const [paths, setPaths] = useState<{ top: string; middle: string; bottom: string }>({
        top: '',
        middle: '',
        bottom: ''
    });

    useEffect(() => {
        const calculatePaths = () => {
            if (!containerRef.current || !sourceRef.current || !target1Ref.current || !target2Ref.current || !target3Ref.current) {
                return;
            }

            const container = containerRef.current.getBoundingClientRect();
            const source = sourceRef.current.getBoundingClientRect();
            const t1 = target1Ref.current.getBoundingClientRect();
            const t2 = target2Ref.current.getBoundingClientRect();
            const t3 = target3Ref.current.getBoundingClientRect();

            // Source point (right edge center of logo box)
            const sourceX = source.right - container.left;
            const sourceY = source.top + source.height / 2 - container.top;

            // Target points (left edge center of each marketplace box)
            const t1X = t1.left - container.left;
            const t1Y = t1.top + t1.height / 2 - container.top;

            const t2X = t2.left - container.left;
            const t2Y = t2.top + t2.height / 2 - container.top;

            const t3X = t3.left - container.left;
            const t3Y = t3.top + t3.height / 2 - container.top;

            // Control points for smooth bezier curves
            const midX = (sourceX + t1X) / 2;

            setPaths({
                top: `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${t1Y}, ${t1X} ${t1Y}`,
                middle: `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${t2Y}, ${t2X} ${t2Y}`,
                bottom: `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${t3Y}, ${t3X} ${t3Y}`
            });
        };

        // Calculate on mount
        calculatePaths();

        // Recalculate on resize
        const resizeObserver = new ResizeObserver(() => {
            calculatePaths();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        window.addEventListener('resize', calculatePaths);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', calculatePaths);
        };
    }, []);

    return (
        <div ref={containerRef} className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-transparent relative overflow-visible">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-50" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Main Content Container */}
            <div className="relative z-10 flex items-center justify-between w-full px-4 py-4">

                {/* Left: Source Hub */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div
                        ref={sourceRef}
                        className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)]"
                    >
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

                {/* Right: Target Stack */}
                <div className="flex flex-col gap-3 z-20 w-32 shrink-0">
                    {/* Trendyol */}
                    <motion.div
                        ref={target1Ref}
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className="bg-[#0F0F11]/80 backdrop-blur-sm border border-white/5 p-2 rounded-lg flex items-center justify-between group hover:border-orange-500/30 transition-colors shadow-lg"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                        <span className="text-[10px] font-medium text-gray-400 group-hover:text-white transition-colors">Trendyol</span>
                        <div className="h-4 w-0.5 bg-orange-500/20 rounded-full" />
                    </motion.div>

                    {/* Hepsiburada */}
                    <motion.div
                        ref={target2Ref}
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                        className="bg-[#0F0F11]/80 backdrop-blur-sm border border-white/5 p-2 rounded-lg flex items-center justify-between group hover:border-orange-400/30 transition-colors shadow-lg"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c]" />
                        <span className="text-[10px] font-medium text-gray-400 group-hover:text-white transition-colors">Hepsiburada</span>
                        <div className="h-4 w-0.5 bg-orange-400/20 rounded-full" />
                    </motion.div>

                    {/* Amazon */}
                    <motion.div
                        ref={target3Ref}
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                        className="bg-[#0F0F11]/80 backdrop-blur-sm border border-white/5 p-2 rounded-lg flex items-center justify-between group hover:border-yellow-500/30 transition-colors shadow-lg"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]" />
                        <span className="text-[10px] font-medium text-gray-400 group-hover:text-white transition-colors">Amazon</span>
                        <div className="h-4 w-0.5 bg-yellow-500/20 rounded-full" />
                    </motion.div>
                </div>
            </div>

            {/* Laser SVG Overlay - Positioned absolutely over container */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5] overflow-visible">
                <defs>
                    <linearGradient id="laser-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#818CF8" stopOpacity="1" />
                        <stop offset="100%" stopColor="#F97316" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="laser-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#818CF8" stopOpacity="1" />
                        <stop offset="100%" stopColor="#FB923C" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="laser-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#818CF8" stopOpacity="1" />
                        <stop offset="100%" stopColor="#EAB308" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="laser-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {paths.top && (
                    <>
                        {/* Glow layer */}
                        <motion.path
                            d={paths.top}
                            stroke="url(#laser-gradient-1)"
                            strokeWidth="4"
                            fill="none"
                            opacity="0.3"
                            filter="url(#laser-glow)"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                        {/* Core beam */}
                        <motion.path
                            d={paths.top}
                            stroke="url(#laser-gradient-1)"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                    </>
                )}

                {paths.middle && (
                    <>
                        <motion.path
                            d={paths.middle}
                            stroke="url(#laser-gradient-2)"
                            strokeWidth="4"
                            fill="none"
                            opacity="0.3"
                            filter="url(#laser-glow)"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                        <motion.path
                            d={paths.middle}
                            stroke="url(#laser-gradient-2)"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                    </>
                )}

                {paths.bottom && (
                    <>
                        <motion.path
                            d={paths.bottom}
                            stroke="url(#laser-gradient-3)"
                            strokeWidth="4"
                            fill="none"
                            opacity="0.3"
                            filter="url(#laser-glow)"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                        <motion.path
                            d={paths.bottom}
                            stroke="url(#laser-gradient-3)"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                    </>
                )}
            </svg>
        </div>
    );
}

function SkeletonGlobal() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-cyan-950/30 border border-white/5 relative overflow-hidden flex items-center justify-center group">
            {/* Animated mesh gradient background */}
            <div className="absolute inset-0 opacity-30">
                <motion.div
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.3) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 70%, rgba(59,130,246,0.3) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.3) 0%, transparent 50%)'
                        ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0"
                />
            </div>

            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} />
            </div>

            {/* Outer orbit ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-36 h-36 rounded-full border border-blue-500/20 border-dashed"
            />

            {/* Middle orbit ring */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-28 h-28 rounded-full border border-cyan-400/15"
            />

            {/* Inner glow ring */}
            <div className="absolute w-20 h-20 rounded-full border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.3),inset_0_0_20px_rgba(59,130,246,0.1)]" />

            {/* Orbiting satellites */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute w-36 h-36"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                </div>
            </motion.div>

            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute w-28 h-28"
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </div>
            </motion.div>

            {/* Connection pulse lines */}
            <svg className="absolute w-full h-full pointer-events-none overflow-visible">
                <defs>
                    <linearGradient id="globe-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                        <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <motion.line
                    x1="20%" y1="30%" x2="80%" y2="70%"
                    stroke="url(#globe-line-gradient)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.line
                    x1="75%" y1="25%" x2="25%" y2="75%"
                    stroke="url(#globe-line-gradient)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
                    transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </svg>

            {/* Central Globe Icon */}
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
            >
                <Globe className="w-12 h-12 text-blue-400/60 group-hover:text-blue-300 transition-colors drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            </motion.div>

            {/* Floating location pins */}
            <motion.div
                animate={{ y: [-2, 2, -2], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 right-8 w-4 h-4"
            >
                <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                <div className="absolute top-1 left-0.5 w-1 h-2 bg-gradient-to-b from-cyan-400 to-transparent rounded-full" />
            </motion.div>

            <motion.div
                animate={{ y: [2, -2, 2], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-6 left-6 w-4 h-4"
            >
                <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_#3b82f6]" />
                <div className="absolute top-1 left-0.5 w-1 h-2 bg-gradient-to-b from-blue-400 to-transparent rounded-full" />
            </motion.div>

            {/* Language Cards */}
            <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
                <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-2 py-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/20 backdrop-blur-md rounded-md text-[10px] text-blue-200 border border-blue-400/40 font-medium shadow-lg cursor-pointer"
                >
                    🇺🇸 EN
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-2 py-1 bg-white/5 backdrop-blur-md rounded-md text-[10px] text-white/60 border border-white/10 font-medium shadow-lg cursor-pointer hover:border-white/30 transition-colors"
                >
                    🇹🇷 TR
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-2 py-1 bg-white/5 backdrop-blur-md rounded-md text-[10px] text-white/60 border border-white/10 font-medium shadow-lg cursor-pointer hover:border-white/30 transition-colors"
                >
                    🇩🇪 DE
                </motion.div>
            </div>

            {/* Stats badge */}
            <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md rounded-full text-[9px] text-emerald-300 border border-emerald-400/30 flex items-center gap-1"
            >
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>195+ Ülke</span>
            </motion.div>
        </div>
    );
}

function SkeletonGemini() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-fuchsia-950/40 via-purple-900/30 to-violet-950/40 border border-white/5 relative overflow-hidden flex items-center justify-center group">
            {/* Animated aurora background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-fuchsia-500/20 via-transparent to-transparent rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-violet-500/20 via-transparent to-transparent rounded-full blur-3xl"
                />
            </div>

            {/* Neural network nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <defs>
                    <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D946EF" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
                    </linearGradient>
                </defs>
                {/* Connection lines */}
                <motion.line x1="15%" y1="30%" x2="40%" y2="50%" stroke="url(#neural-gradient)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                <motion.line x1="15%" y1="70%" x2="40%" y2="50%" stroke="url(#neural-gradient)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }}
                    transition={{ duration: 3, delay: 0.2, repeat: Infinity, ease: "easeInOut" }} />
                <motion.line x1="60%" y1="50%" x2="85%" y2="30%" stroke="url(#neural-gradient)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }}
                    transition={{ duration: 3, delay: 0.4, repeat: Infinity, ease: "easeInOut" }} />
                <motion.line x1="60%" y1="50%" x2="85%" y2="70%" stroke="url(#neural-gradient)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }}
                    transition={{ duration: 3, delay: 0.6, repeat: Infinity, ease: "easeInOut" }} />
            </svg>

            {/* Main content - Before/After transformation */}
            <div className="flex items-center gap-3 z-10">
                {/* Before image */}
                <motion.div
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-16 h-16 rounded-lg bg-black/60 border border-white/10 overflow-hidden"
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-md opacity-50" />
                    </div>
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_6px)]" />
                    <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-red-500/30 rounded text-[7px] text-red-300 border border-red-500/30">
                        LOW
                    </div>
                </motion.div>

                {/* Processing arrow */}
                <div className="flex flex-col items-center gap-1">
                    <motion.div
                        animate={{ x: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="flex items-center gap-0.5"
                    >
                        <div className="w-4 h-0.5 bg-gradient-to-r from-fuchsia-500/50 to-fuchsia-500 rounded-full" />
                        <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-fuchsia-500" />
                    </motion.div>
                    <Sparkles className="w-4 h-4 text-fuchsia-400/60" />
                </div>

                {/* After image */}
                <motion.div
                    animate={{ scale: [1, 1.02, 1], boxShadow: ['0 0 0 rgba(217,70,239,0)', '0 0 20px rgba(217,70,239,0.3)', '0 0 0 rgba(217,70,239,0)'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-16 h-16 rounded-lg bg-black/60 border border-fuchsia-500/30 overflow-hidden group-hover:border-fuchsia-400/50 transition-colors"
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500/30 to-violet-600/30 rounded-md" />
                    </div>

                    {/* Scan line effect */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent shadow-[0_0_15px_rgba(217,70,239,0.8)]"
                    />

                    <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-emerald-500/30 rounded text-[7px] text-emerald-300 border border-emerald-500/30">
                        HD
                    </div>
                </motion.div>
            </div>

            {/* Floating particles */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -20, 0],
                        x: [0, Math.sin(i) * 10, 0],
                        opacity: [0, 0.8, 0]
                    }}
                    transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                    }}
                    className="absolute w-1 h-1 bg-fuchsia-400 rounded-full"
                    style={{ left: `${20 + i * 15}%`, bottom: '20%' }}
                />
            ))}

            {/* AI Badge */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 backdrop-blur-md rounded-full border border-fuchsia-400/30"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3"
                >
                    <Sparkles className="w-full h-full text-fuchsia-400" />
                </motion.div>
                <span className="text-[9px] text-fuchsia-300 font-medium tracking-wide">Gemini AI</span>
            </motion.div>

            {/* Processing indicator */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ scaleY: [1, 1.5, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            className="w-0.5 h-2 bg-fuchsia-400/60 rounded-full"
                        />
                    ))}
                </div>
                <span className="text-[8px] text-white/40 uppercase tracking-wider">Processing</span>
            </div>
        </div>
    );
}

function SkeletonSEO() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-950/40 via-teal-900/20 to-green-950/30 border border-white/5 relative overflow-hidden group">
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-20">
                <motion.div
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%']
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.3) 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />
            </div>

            {/* Floating data streams */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <linearGradient id="seo-stream" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
                        <stop offset="50%" stopColor="#10B981" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <motion.rect
                    x="15%" y="0" width="1" height="30%"
                    fill="url(#seo-stream)"
                    animate={{ y: ['0%', '70%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.rect
                    x="85%" y="0" width="1" height="30%"
                    fill="url(#seo-stream)"
                    animate={{ y: ['70%', '0%', '70%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
            </svg>

            {/* Main content area */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full p-4 gap-3">

                {/* Search bar simulation */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[140px] bg-black/40 backdrop-blur-md rounded-lg border border-emerald-500/20 p-2 flex items-center gap-2"
                >
                    <Search className="w-3 h-3 text-emerald-400/60" />
                    <motion.div
                        animate={{ width: ['20%', '70%', '20%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="h-1.5 bg-gradient-to-r from-emerald-500/50 to-emerald-400/30 rounded-full"
                    />
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-0.5 h-3 bg-emerald-400"
                    />
                </motion.div>

                {/* Keyword tags */}
                <div className="flex flex-wrap justify-center gap-1.5">
                    {[
                        { text: 'ürün açıklama', score: 98 },
                        { text: 'SEO', score: 95 },
                        { text: 'anahtar kelime', score: 92 }
                    ].map((tag, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.15 }}
                            whileHover={{ scale: 1.05, y: -1 }}
                            className="px-2 py-0.5 bg-emerald-500/10 backdrop-blur-sm rounded-md border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer hover:border-emerald-400/50 transition-colors"
                        >
                            <span className="text-[8px] text-emerald-300">{tag.text}</span>
                            <span className="text-[7px] text-emerald-500 font-bold">{tag.score}%</span>
                        </motion.div>
                    ))}
                </div>

                {/* Mini ranking chart */}
                <div className="flex items-end gap-1 h-8">
                    {[40, 60, 45, 75, 85, 95].map((height, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                            className={cn(
                                "w-2 rounded-t-sm",
                                i === 5 ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-emerald-500/30"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Ranking badge */}
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-md rounded-full border border-emerald-400/30"
            >
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] text-emerald-300 font-bold">#1</span>
            </motion.div>

            {/* Floating score indicator */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-2 left-2 flex flex-col items-start"
            >
                <span className="text-[8px] text-white/40 uppercase tracking-wider">SEO Score</span>
                <div className="flex items-center gap-1">
                    <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-lg font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    >
                        98
                    </motion.span>
                    <span className="text-[10px] text-emerald-500">/100</span>
                </div>
            </motion.div>

            {/* Particle effect */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 1,
                        ease: "easeOut"
                    }}
                    className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                    style={{ left: `${30 + i * 20}%`, bottom: '30%' }}
                />
            ))}
        </div>
    );
}

function SkeletonSpeed() {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-amber-950/40 via-orange-900/20 to-yellow-950/30 border border-white/5 relative overflow-hidden group">
            {/* Animated radial background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%]"
                    style={{
                        background: 'conic-gradient(from 0deg, transparent 0deg, rgba(245,158,11,0.1) 30deg, transparent 60deg)'
                    }}
                />
            </div>

            {/* Speed lines streaking effect */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <defs>
                    <linearGradient id="speed-line" x1="0%" y1="50%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                        <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[20, 40, 60, 80].map((y, i) => (
                    <motion.line
                        key={i}
                        x1="0%" y1={`${y}%`} x2="30%" y2={`${y}%`}
                        stroke="url(#speed-line)"
                        strokeWidth="1"
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: '100%', opacity: [0, 0.8, 0] }}
                        transition={{
                            duration: 1.5 + i * 0.3,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </svg>

            {/* Main content - centered */}
            <div className="relative z-10 flex items-center justify-center w-full gap-4">

                {/* Left side - Action buttons simulation */}
                <div className="flex flex-col gap-2">
                    <motion.div
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 backdrop-blur-sm rounded-lg border border-amber-500/20"
                    >
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_6px_#f59e0b]" />
                        <span className="text-[8px] text-amber-300 font-medium">Upload</span>
                    </motion.div>
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                        className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/5 rounded-lg border border-amber-500/10"
                    >
                        <div className="w-1.5 h-1.5 bg-amber-400/30 rounded-full" />
                        <span className="text-[8px] text-amber-300/50 font-medium">Process</span>
                    </motion.div>
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                        className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/5 rounded-lg border border-amber-500/10"
                    >
                        <div className="w-1.5 h-1.5 bg-amber-400/30 rounded-full" />
                        <span className="text-[8px] text-amber-300/50 font-medium">Publish</span>
                    </motion.div>
                </div>

                {/* Center - Speedometer */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Outer ring */}
                    <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="none" />
                        <motion.circle
                            cx="50" cy="50" r="45"
                            stroke="url(#speed-gradient-outer)"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="283"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: [283, 70, 283] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="speed-gradient-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FCD34D" />
                                <stop offset="100%" stopColor="#F59E0B" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Inner ring */}
                    <svg className="absolute w-[75%] h-[75%] -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="4" fill="none" />
                        <motion.circle
                            cx="50" cy="50" r="40"
                            stroke="#F59E0B"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray="251"
                            initial={{ strokeDashoffset: 251 }}
                            animate={{ strokeDashoffset: [251, 50, 251] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Center content */}
                    <div className="relative flex flex-col items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Zap className="w-6 h-6 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                        </motion.div>
                        <motion.span
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-[10px] font-bold text-amber-300 mt-0.5"
                        >
                            0.4s
                        </motion.span>
                    </div>

                    {/* Orbiting dot */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-full"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b,0_0_20px_#f59e0b50]" />
                    </motion.div>
                </div>
            </div>

            {/* Top right stats */}
            <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-2 right-2 flex flex-col items-end gap-0.5"
            >
                <span className="text-[8px] text-white/40 uppercase">Hız</span>
                <div className="flex items-center gap-1">
                    <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-sm font-bold text-amber-400"
                    >
                        10x
                    </motion.span>
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                </div>
            </motion.div>

            {/* Bottom left - Manual work comparison */}
            <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-2 left-2 flex items-center gap-2"
            >
                <div className="flex flex-col">
                    <span className="text-[7px] text-white/30 line-through">Manuel: 2 saat</span>
                    <span className="text-[8px] text-amber-300 font-medium">Yaver: 0.4 saniye</span>
                </div>
            </motion.div>

            {/* Energy particles */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -10, 0],
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut"
                    }}
                    className="absolute w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_4px_#f59e0b]"
                    style={{
                        left: `${45 + Math.random() * 10}%`,
                        top: `${45 + Math.random() * 10}%`
                    }}
                />
            ))}
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
        title: "Gemini NanoBanana Görsel Sihirbazı",
        description: "Kötü ışıklı, amatör ürün fotoğraflarını stüdyo kalitesine dönüştürün.",
        header: <SkeletonGemini />,
        icon: <Sparkles className="h-4 w-4 text-fuchsia-400" />,
    },
    {
        title: "Satış Odaklı SEO",
        description: "GPT gücüyle arama algoritmalarına uygun, organik trafiği artıran başlık ve açıklamalar.",
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
