'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight, Rocket } from 'lucide-react';
import { useRef } from 'react';

export function CTA() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const starScale = useTransform(scrollYProgress, [0, 1], [0.5, 1.5]);
    const starOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

    return (
        <section ref={containerRef} className="py-40 relative overflow-hidden flex items-center justify-center min-h-[80vh]">
            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white mb-8"
                >
                    <Rocket className="w-5 h-5 text-indigo-400" />
                    <span className="font-medium">Satışlarınızı Ateşleyin</span>
                </motion.div>

                <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                    E-ticaretin Geleceği <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Sizi Bekliyor
                    </span>
                </h2>

                <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12">
                    Binlerce satıcı arasına katılın. Kart bilgisi gerekmeden 10 AI kredisini ücretsiz kullanın.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/register" className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-white to-pink-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500 animate-tilt"></div>
                        <div className="relative flex items-center gap-3 px-8 py-5 bg-white text-black rounded-full font-bold text-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            <Sparkles className="w-5 h-5 fill-indigo-500 stroke-indigo-500" />
                            Hemen Başla
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
