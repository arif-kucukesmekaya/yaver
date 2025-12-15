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
        <div className="w-full h-full p-4 relative group overflow-hidden bg-[#0A0A0B]">
            {/* Glow Effect behind dashboard */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl -z-10 opacity-50" />

            {/* Window Controls */}
            <div className="h-10 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2 rounded-t-xl">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[0_0_6px_#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_6px_#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[0_0_6px_#27C93F]" />
                <div className="ml-4 flex items-center gap-2 px-3 py-1 bg-white/5 rounded-md">
                    <div className="w-3 h-3 rounded-full bg-indigo-500/50" />
                    <span className="text-[10px] text-white/40">app.yaverai.com</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
                        <div className="w-3 h-3 border border-white/20 rounded-sm" />
                    </div>
                </div>
            </div>

            {/* Dashboard Layout */}
            <div className="grid grid-cols-12 gap-4 h-[calc(100%-3rem)] pt-4">
                {/* Sidebar */}
                <div className="col-span-2 space-y-2 bg-white/[0.02] rounded-xl p-3 border border-white/5">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-white">Yaver AI</span>
                    </div>

                    {/* Nav items */}
                    <div className="w-full h-9 bg-indigo-500/20 rounded-lg border border-indigo-500/30 flex items-center px-3 gap-2">
                        <div className="w-4 h-4 rounded bg-indigo-500/50" />
                        <span className="text-[10px] text-indigo-300">Dashboard</span>
                    </div>
                    {[
                        { icon: '📦', label: 'Ürünler', active: false },
                        { icon: '🏪', label: 'Pazaryerleri', active: false },
                        { icon: '📊', label: 'Raporlar', active: false },
                        { icon: '⚙️', label: 'Ayarlar', active: false },
                    ].map((item, i) => (
                        <div key={i} className="w-full h-9 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg border border-white/5 flex items-center px-3 gap-2 transition-colors cursor-pointer">
                            <span className="text-[10px]">{item.icon}</span>
                            <span className="text-[10px] text-white/50">{item.label}</span>
                        </div>
                    ))}

                    {/* Bottom CTA */}
                    <div className="mt-auto pt-4">
                        <div className="w-full p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20">
                            <div className="text-[9px] text-indigo-300 font-medium">Pro Plan</div>
                            <div className="text-[8px] text-white/40">500 kredi kaldı</div>
                            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="col-span-10 space-y-4 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-white">Hoş geldin, Arif 👋</h2>
                            <p className="text-[10px] text-white/40">Bugün 12 yeni ürün eklendi</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg shadow-indigo-500/30 flex items-center gap-2 cursor-pointer"
                            >
                                <Sparkles className="w-3 h-3 text-white" />
                                <span className="text-[10px] text-white font-medium">AI ile Oluştur</span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: 'Toplam Ürün', value: '1,247', change: '+12%', icon: '📦', color: 'indigo' },
                            { label: 'SEO Skoru', value: '98.5', change: '+3.2', icon: '🎯', color: 'emerald' },
                            { label: 'Aktif Pazar', value: '3', change: '', icon: '🏪', color: 'orange' },
                            { label: 'Bu Hafta', value: '₺45.2K', change: '+28%', icon: '💰', color: 'purple' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className={`h-20 bg-white/[0.03] rounded-xl border border-white/5 p-3 relative overflow-hidden group/card hover:bg-white/[0.06] transition-colors`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                <div className="flex items-start justify-between">
                                    <span className="text-lg">{stat.icon}</span>
                                    {stat.change && (
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${stat.change.startsWith('+')
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {stat.change}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-1">
                                    <div className="text-lg font-bold text-white">{stat.value}</div>
                                    <div className="text-[9px] text-white/40">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-3 gap-4 h-[calc(100%-10rem)]">
                        {/* Product Table */}
                        <div className="col-span-2 bg-white/[0.03] rounded-xl border border-white/5 p-4 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-white">Son Ürünler</span>
                                    <span className="text-[9px] px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">Canlı</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="px-2 py-1 bg-white/5 rounded-md text-[9px] text-white/50">Tümünü Gör</div>
                                </div>
                            </div>

                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[9px] text-white/30 uppercase tracking-wider border-b border-white/5">
                                <div className="col-span-5">Ürün</div>
                                <div className="col-span-3">Pazaryeri</div>
                                <div className="col-span-2">SEO</div>
                                <div className="col-span-2">Durum</div>
                            </div>

                            {/* Table Rows */}
                            <div className="space-y-1 mt-2">
                                {[
                                    { name: 'Premium Bluetooth Kulaklık', marketplace: 'Trendyol', seo: 98, status: 'active' },
                                    { name: 'Akıllı Saat Pro Max', marketplace: 'Amazon', seo: 95, status: 'active' },
                                    { name: 'Kablosuz Şarj Cihazı', marketplace: 'Hepsiburada', seo: 92, status: 'pending' },
                                    { name: 'USB-C Hub 7in1', marketplace: 'Trendyol', seo: 97, status: 'active' },
                                    { name: 'Mekanik Klavye RGB', marketplace: 'Amazon', seo: 89, status: 'active' },
                                ].map((product, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="grid grid-cols-12 gap-2 px-3 py-2.5 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg items-center transition-colors cursor-pointer group/row"
                                    >
                                        <div className="col-span-5 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                                                <span className="text-[10px]">📱</span>
                                            </div>
                                            <span className="text-[10px] text-white/70 group-hover/row:text-white transition-colors truncate">{product.name}</span>
                                        </div>
                                        <div className="col-span-3">
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full ${product.marketplace === 'Trendyol' ? 'bg-orange-500/20 text-orange-300' :
                                                    product.marketplace === 'Amazon' ? 'bg-yellow-500/20 text-yellow-300' :
                                                        'bg-orange-400/20 text-orange-200'
                                                }`}>
                                                {product.marketplace}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-1">
                                                <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${product.seo >= 95 ? 'bg-emerald-500' :
                                                                product.seo >= 90 ? 'bg-yellow-500' : 'bg-orange-500'
                                                            }`}
                                                        style={{ width: `${product.seo}%` }}
                                                    />
                                                </div>
                                                <span className="text-[9px] text-white/50">{product.seo}</span>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`text-[9px] flex items-center gap-1 ${product.status === 'active' ? 'text-emerald-400' : 'text-yellow-400'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'active' ? 'bg-emerald-400' : 'bg-yellow-400'
                                                    } animate-pulse`} />
                                                {product.status === 'active' ? 'Aktif' : 'Beklemede'}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Scanning Effect Overlay */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none"
                                animate={{ top: ['-100%', '200%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* Right Panel - AI Generation */}
                        <div className="col-span-1 space-y-3">
                            {/* AI Panel */}
                            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 p-3 relative overflow-hidden">
                                <div className="flex items-center gap-2 mb-3">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                    </motion.div>
                                    <span className="text-[10px] font-medium text-white">AI Asistan</span>
                                </div>

                                <div className="space-y-2">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <div className="text-[9px] text-white/60 mb-1">Son işlem</div>
                                        <div className="text-[10px] text-white">12 ürün optimize edildi ✓</div>
                                    </div>

                                    <motion.div
                                        className="flex items-center gap-2 p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30"
                                        animate={{ opacity: [0.7, 1, 0.7] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <div className="flex gap-0.5">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ scaleY: [1, 1.5, 1] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                    className="w-0.5 h-3 bg-indigo-400 rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[9px] text-indigo-300">Analiz ediliyor...</span>
                                    </motion.div>
                                </div>

                                {/* Glow effect */}
                                <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl" />
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-3">
                                <div className="text-[10px] text-white/40 mb-2">Bugünkü Performans</div>
                                <div className="space-y-2">
                                    {[
                                        { label: 'İçerik Üretimi', value: '24', unit: 'ürün' },
                                        { label: 'Ortalama SEO', value: '96.2', unit: 'puan' },
                                        { label: 'Tasarruf', value: '4.5', unit: 'saat' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <span className="text-[9px] text-white/50">{item.label}</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xs font-bold text-white">{item.value}</span>
                                                <span className="text-[8px] text-white/30">{item.unit}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Marketplace Status */}
                            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-3">
                                <div className="text-[10px] text-white/40 mb-2">Pazaryeri Durumu</div>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Trendyol', status: 'connected', color: 'orange' },
                                        { name: 'Amazon', status: 'connected', color: 'yellow' },
                                        { name: 'Hepsiburada', status: 'syncing', color: 'orange' },
                                    ].map((mp, i) => (
                                        <div key={i} className="flex items-center justify-between p-1.5 bg-white/[0.02] rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${mp.status === 'connected' ? 'bg-emerald-400' : 'bg-yellow-400 animate-pulse'
                                                    }`} />
                                                <span className="text-[9px] text-white/70">{mp.name}</span>
                                            </div>
                                            <span className={`text-[8px] ${mp.status === 'connected' ? 'text-emerald-400' : 'text-yellow-400'
                                                }`}>
                                                {mp.status === 'connected' ? '✓' : '⟳'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Badge (SEO Score) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute top-16 right-8 p-3 bg-black/80 backdrop-blur-xl rounded-xl border border-emerald-500/30 shadow-xl shadow-emerald-500/10 flex items-center gap-3"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <span className="text-white font-bold text-sm">A+</span>
                </div>
                <div>
                    <div className="text-[9px] text-white/50">SEO Skoru</div>
                    <div className="text-lg font-bold text-emerald-400">98.5</div>
                </div>
            </motion.div>

            {/* Floating Speed Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute bottom-20 left-8 p-3 bg-black/80 backdrop-blur-xl rounded-xl border border-amber-500/30 shadow-xl shadow-amber-500/10 flex items-center gap-3"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                    <div className="text-[9px] text-white/50">Üretim Hızı</div>
                    <div className="text-lg font-bold text-amber-400">0.4s</div>
                </div>
            </motion.div>
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

