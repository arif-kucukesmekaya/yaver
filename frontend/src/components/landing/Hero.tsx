'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

const marketplaces = [
    { name: 'Trendyol', color: '#F27A1A' },
    { name: 'Hepsiburada', color: '#FF6000' },
    { name: 'Amazon', color: '#FF9900' },
];

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Optimized CSS Background - Much lighter than WebGL */}
            <div className="absolute inset-0">
                {/* Animated gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/25 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[150px]" />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
                >
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm text-white/80">AI Destekli İçerik Üretimi</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
                >
                    E-ticaret İçeriklerinizi
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Otomatik Oluşturun
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Tüm pazaryerleriniz için SEO uyumlu başlık ve açıklamalar tek tıkla hazır.
                    Zamandan tasarruf edin, satışlarınızı artırın.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    {/* Primary CTA with animated glow */}
                    <Link href="/register" className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-all duration-500" />
                        <div className="relative flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full transition-transform duration-300 group-hover:scale-[1.02]">
                            <Sparkles className="w-5 h-5" />
                            Ücretsiz Dene
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <Link
                        href="#how-it-works"
                        className="flex items-center gap-2 px-8 py-4 text-white/80 hover:text-white border border-white/20 rounded-full transition-all duration-300 hover:bg-white/5 hover:border-white/30"
                    >
                        Nasıl Çalışır?
                    </Link>
                </motion.div>

                {/* Marketplace Logos */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col items-center gap-4"
                >
                    <p className="text-sm text-white/40 uppercase tracking-wider">
                        Desteklenen Pazaryerleri
                    </p>
                    <div className="flex items-center gap-8">
                        {marketplaces.map((mp, index) => (
                            <motion.div
                                key={mp.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                                className="group relative"
                            >
                                <div
                                    className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                                    style={{ backgroundColor: mp.color }}
                                />
                                <div className="relative px-6 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
                                    <span className="text-white font-medium">{mp.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
                >
                    {[
                        { icon: Zap, value: '10x', label: 'Daha Hızlı' },
                        { icon: Shield, value: '%98', label: 'Başarı Oranı' },
                        { icon: Sparkles, value: '5K+', label: 'İçerik Üretildi' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                            className="text-center"
                        >
                            <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-3" />
                            <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-white/50">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </section>
    );
}
