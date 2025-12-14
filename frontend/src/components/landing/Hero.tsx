'use client';

import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Spotlight } from '@/components/ui/spotlight';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

const marketplaces = [
    { name: 'Trendyol', color: '#F27A1A' },
    { name: 'Hepsiburada', color: '#FF6000' },
    { name: 'Amazon', color: '#FF9900' },
];

export function Hero() {
    return (
        // Adjusted height for Container Scroll which takes up a lot of space
        <section className="relative min-h-screen flex flex-col items-center justify-start pt-20 overflow-hidden">

            {/* 1. SPOTLIGHT EFFECT */}
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />

            <div className="relative z-10 w-full">
                {/* 2. CONTAINER SCROLL with Hero Content inside Header slot */}
                <ContainerScroll
                    titleComponent={
                        <div className="flex flex-col items-center">
                            {/* Headline */}
                            <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-[0.9] text-balance">
                                <SplitText text="E-ticaret İçin" delay={0.1} />
                                <br />
                                <span className="relative inline-block mt-2">
                                    <span
                                        className="relative z-10 bg-gradient-to-r from-white via-indigo-200 to-white bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-flow"
                                        style={{ animation: 'gradient-flow 3s linear infinite' }}
                                    >
                                        Yapay Zeka
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-30 -z-10 animate-pulse-slow" />
                                </span>
                                <SplitText text="Otopilotu" delay={0.4} className="text-white/40 block mt-2 font-light" />
                            </h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
                            >
                                Ürünlerinizi saniyeler içinde analiz edin, SEO uyumlu içerikler üretin ve
                                tüm pazaryerlerinde satışlarınızı 10x artırın.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                            >
                                <Link href="/register" className="group relative z-20">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                    <button className="relative flex items-center gap-2 px-8 py-4 bg-black rounded-full leading-none text-white font-medium border border-white/10 backdrop-blur-xl transition-transform active:scale-95">
                                        <Sparkles className="w-5 h-5 text-indigo-400" />
                                        <span>Başla</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>

                                <Link href="#how-it-works" className="group">
                                    <button className="flex items-center gap-2 px-8 py-4 rounded-full text-white/70 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5 transition-all">
                                        <span>Nasıl Çalışır?</span>
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    }
                >
                    {/* DASHBOARD IMAGE / VISUALIZATION IN TABLET MODE */}
                    <div className="w-full h-full relative bg-[#080808]">
                        {/* We can re-use the HeroDashboard component here, or a static image. 
                             HeroDashboard is interactive (tilt), which might fight with Scroll Tilt.
                             Let's use the static dashboard logic but without the tilt wrapper, just the UI.
                          */}
                        <StaticDashboardUI />
                    </div>
                </ContainerScroll>
            </div>


            {/* Marketplace Ticker - Infinite Marquee */}
            {/* MOVED OUTSIDE CONTAINER SCROLL to be at bottom of screen or below main fold */}
            <div className="relative mt-10 md:mt-0 pb-10 w-full overflow-hidden z-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-medium text-white/20 mb-6 uppercase tracking-widest">Partner Pazaryerleri</p>
                    <div className="relative w-full flex overflow-hidden mask-gradient-x">
                        <div className="flex animate-scroll-loop min-w-full items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 px-6">
                            {/* Set 1 */}
                            {marketplaces.map(mp => (
                                <span key={mp.name} className="text-xl font-bold text-white tracking-tight whitespace-nowrap">{mp.name}</span>
                            ))}
                            <span className="text-xl font-bold text-white tracking-tight whitespace-nowrap">Etsy</span>
                            <span className="text-xl font-bold text-white tracking-tight whitespace-nowrap">Shopify</span>

                            {/* Set 2 (Duplicate for loop) */}
                            {marketplaces.map(mp => (
                                <span key={mp.name + '-dup'} className="text-xl font-bold text-white tracking-tight whitespace-nowrap">{mp.name}</span>
                            ))}
                            <span className="text-xl font-bold text-white tracking-tight whitespace-nowrap">Etsy</span>
                            <span className="text-xl font-bold text-white tracking-tight whitespace-nowrap">Shopify</span>

                            {/* Set 3 (Duplicate for extra safety on wide screens) */}
                            {marketplaces.map(mp => (
                                <span key={mp.name + '-dup2'} className="text-xl font-bold text-white tracking-tight whitespace-nowrap">{mp.name}</span>
                            ))}
                            <span className="text-xl font-bold text-white tracking-tight whitespace-nowrap">Etsy</span>
                            <span className="text-xl font-bold text-white tracking-tight whitespace-nowrap">Shopify</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Re-using the Dashboard UI logic but stripping the Tilt wrapper since ContainerScroll handles the 3D effect
function StaticDashboardUI() {
    return (
        <div className="w-full h-full p-6 relative group overflow-hidden bg-[#080808]">
            {/* Glow Effect behind dashboard */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl -z-10 opacity-50" />

            {/* Window Controls */}
            <div className="h-8 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <div className="ml-auto w-32 h-1.5 rounded-full bg-white/5" />
            </div>

            {/* Dashboard Layout */}
            <div className="grid grid-cols-12 gap-6 h-[calc(100%-3rem)]">
                {/* Sidebar */}
                <div className="col-span-2 space-y-3">
                    <div className="w-full h-8 bg-indigo-500/10 rounded-lg border border-indigo-500/10" />
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-full h-8 bg-white/5 rounded-lg border border-white/5" />
                    ))}
                </div>

                {/* Content */}
                <div className="col-span-10 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-white/[0.03] rounded-xl border border-white/5 p-4 relative overflow-hidden group/card hover:bg-white/[0.06] transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                <div className="w-8 h-8 rounded-full bg-white/10 mb-3" />
                                <div className="w-16 h-2 bg-white/20 rounded mb-2" />
                                <div className="w-24 h-4 bg-white/40 rounded" />
                            </div>
                        ))}
                    </div>

                    {/* Main Chart/Table */}
                    <div className="h-full bg-white/[0.03] rounded-xl border border-white/5 p-6 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <div className="w-32 h-4 bg-white/20 rounded" />
                            <div className="w-24 h-8 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center text-xs text-white font-medium">
                                AI Generate
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-12 w-full bg-white/5 rounded-lg flex items-center px-4 gap-4">
                                    <div className="w-8 h-8 rounded bg-white/10" />
                                    <div className="w-48 h-2 bg-white/20 rounded" />
                                    <div className="ml-auto w-16 h-2 bg-green-500/40 rounded" />
                                </div>
                            ))}
                        </div>

                        {/* Scanning Effect Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none"
                            animate={{ top: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>
            </div>

            {/* Floating Badge (SEO Score) */}
            <div className="absolute top-12 right-12 p-3 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-green-400" />
                </div>
                <div>
                    <div className="text-[10px] text-white/50">SEO Score</div>
                    <div className="text-sm font-bold text-white">99.2</div>
                </div>
            </div>
        </div>
    );
}

function HeroDashboard() {
    // Advanced 3D Tilt Effect based on mouse position
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -5]); // Initial tilt for perspective
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                transform: "rotateX(20deg)" // Default isometric-ish view
            }}
            className="w-full aspect-[16/9] relative group cursor-none will-change-transform"
        >
            {/* Screen Reflection/Glass */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent z-50 pointer-events-none mix-blend-overlay" />

            {/* Glow Effect behind dashboard */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Main Window */}
            <div className="absolute inset-0 bg-[#080808] rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">
                {/* Window Controls */}
                <div className="h-8 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                    <div className="ml-auto w-32 h-1.5 rounded-full bg-white/5" />
                </div>

                {/* Dashboard Layout */}
                <div className="p-6 grid grid-cols-12 gap-6 h-[calc(100%-2rem)]">
                    {/* Sidebar */}
                    <div className="col-span-2 space-y-3">
                        <div className="w-full h-8 bg-indigo-500/10 rounded-lg border border-indigo-500/10" />
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-full h-8 bg-white/5 rounded-lg border border-white/5" />
                        ))}
                    </div>

                    {/* Content */}
                    <div className="col-span-10 space-y-6">
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-white/[0.03] rounded-xl border border-white/5 p-4 relative overflow-hidden group/card hover:bg-white/[0.06] transition-colors">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                    <div className="w-8 h-8 rounded-full bg-white/10 mb-3" />
                                    <div className="w-16 h-2 bg-white/20 rounded mb-2" />
                                    <div className="w-24 h-4 bg-white/40 rounded" />
                                </div>
                            ))}
                        </div>

                        {/* Main Chart/Table */}
                        <div className="h-full bg-white/[0.03] rounded-xl border border-white/5 p-6 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <div className="w-32 h-4 bg-white/20 rounded" />
                                <div className="w-24 h-8 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center text-xs text-white font-medium">
                                    AI Generate
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-12 w-full bg-white/5 rounded-lg flex items-center px-4 gap-4">
                                        <div className="w-8 h-8 rounded bg-white/10" />
                                        <div className="w-48 h-2 bg-white/20 rounded" />
                                        <div className="ml-auto w-16 h-2 bg-green-500/40 rounded" />
                                    </div>
                                ))}
                            </div>

                            {/* Scanning Effect Overlay */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none"
                                animate={{ top: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Elements (Parallax) - Enhanced Glassmorphism */}
            <motion.div
                style={{ z: 50, x: useTransform(x, [-100, 100], [-20, 20]), y: useTransform(y, [-100, 100], [-20, 20]) }}
                className="absolute -right-12 top-12 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-3 ring-1 ring-white/10"
            >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <Sparkles className="w-5 h-5 text-green-400" />
                </div>
                <div>
                    <div className="text-xs text-white/50 font-medium">SEO Puanı</div>
                    <div className="text-lg font-bold text-white tracking-tight">%98.5</div>
                </div>
            </motion.div>

            <motion.div
                style={{ z: 80, x: useTransform(x, [-100, 100], [30, -30]), y: useTransform(y, [-100, 100], [30, -30]) }}
                className="absolute -left-12 bottom-24 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-3 ring-1 ring-white/10"
            >
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <div className="text-xs text-white/50 font-medium">Üretim Hızı</div>
                    <div className="text-lg font-bold text-white tracking-tight">1.2sn</div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Add global styles for animations in a style tag or tailwind config 
// reusing standard tailwind executeable classes where possible

function SplitText({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) {
    const characters = text.split("");
    return (
        <span className={cn("inline-block", className)}>
            {characters.map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                        duration: 0.4,
                        delay: delay + i * 0.03,
                        ease: "easeOut"
                    }}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}

// Inline styles for the specific liquid gradient
const styles = `
@keyframes gradient-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

