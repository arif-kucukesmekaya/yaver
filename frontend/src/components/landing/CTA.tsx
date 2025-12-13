'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export function CTA() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm text-white/80">Hemen başlayın</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        İçerik Üretiminde
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Yeni Nesil
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10">
                        Binlerce e-ticaret satıcısı YAVER ile zamandan tasarruf ediyor ve satışlarını artırıyor.
                        Siz de ücretsiz deneyin.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-all duration-500" />
                            <div className="relative flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full transition-transform duration-300 group-hover:scale-[1.02]">
                                Ücretsiz Başla
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            href="#pricing"
                            className="flex items-center gap-2 px-8 py-4 text-white/70 hover:text-white transition-colors"
                        >
                            Fiyatları İncele
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <p className="text-white/40 text-sm mt-10">
                        ✓ Kredi kartı gerektirmez &nbsp; ✓ 10 ücretsiz kredi &nbsp; ✓ Hemen kullanmaya başlayın
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
