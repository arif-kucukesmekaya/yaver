'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

const steps = [
    {
        number: '1',
        title: 'Ürün Bilgisi',
        description: 'Ürün açıklaması, marka ve kategori bilgilerini girin.',
    },
    {
        number: '2',
        title: 'Pazaryeri Seç',
        description: 'Trendyol, Hepsiburada veya Amazon seçin.',
    },
    {
        number: '3',
        title: 'AI Üretir',
        description: 'GPT-4 optimize başlık ve açıklama oluşturur.',
    },
    {
        number: '4',
        title: 'Yayınla',
        description: 'Tek tıkla kopyala, satışa başla.',
    },
];

const laserPositions = [0, 33.3, 66.6, 100];

export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentStep, setCurrentStep] = useState(0);

    // Track scroll progress within the tall container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Map scroll progress to steps (0-4)
    useMotionValueEvent(scrollYProgress, "change", (progress) => {
        // 5 zones: 0-20% = step 0, 20-40% = step 1, etc.
        const step = Math.min(4, Math.floor(progress * 5));
        setCurrentStep(step);
    });

    // Laser width based on step
    const laserWidth = currentStep > 0 ? laserPositions[currentStep - 1] : 0;

    return (
        // Tall container - creates scroll "budget" for 4 steps
        // Height = 5 viewport heights (1 for each step + 1 buffer)
        <div ref={containerRef} className="relative h-[400vh]">
            {/* Sticky section - stays centered while scrolling through container */}
            <div className="sticky top-0 h-screen flex items-center justify-center">
                <section id="how-it-works" className="w-full py-16">
                    <div className="max-w-5xl mx-auto px-6">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                                <Zap className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm text-emerald-300">4 Basit Adım</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Nasıl Çalışır?
                            </h2>
                            <p className="text-white/50 max-w-lg mx-auto">
                                4 basit adımda pazaryeri içeriklerinizi oluşturun
                            </p>
                        </motion.div>

                        {/* Timeline */}
                        <div className="relative">
                            {/* Background line */}
                            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-[2px] bg-white/10 rounded-full" />

                            {/* Laser */}
                            <motion.div
                                className="hidden md:block absolute top-10 left-[12.5%] h-[4px] rounded-full"
                                animate={{ width: `${laserWidth * 0.75}%` }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                style={{
                                    background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                                    boxShadow: "0 0 25px rgba(139, 92, 246, 0.8), 0 0 50px rgba(139, 92, 246, 0.4)"
                                }}
                            >
                                {laserWidth > 0 && (
                                    <motion.div
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <div className="w-5 h-5 bg-purple-400 rounded-full" />
                                        <div className="absolute inset-0 w-5 h-5 bg-purple-300 rounded-full animate-ping" />
                                        <div className="absolute -inset-4 bg-purple-500/40 rounded-full blur-xl" />
                                    </motion.div>
                                )}
                            </motion.div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                                {steps.map((step, index) => {
                                    const isActive = index < currentStep;

                                    return (
                                        <motion.div
                                            key={step.number}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="text-center relative"
                                        >
                                            <div className="relative z-10 mx-auto mb-6">
                                                <motion.div
                                                    className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-emerald-500/50 blur-xl"
                                                    animate={{
                                                        opacity: isActive ? 1 : 0,
                                                        scale: isActive ? 1.5 : 1
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                />

                                                <motion.div
                                                    className="relative w-20 h-20 mx-auto rounded-full bg-[#0a0a0f] flex items-center justify-center border-2"
                                                    animate={{
                                                        borderColor: isActive ? "#10b981" : "rgba(255,255,255,0.1)",
                                                        scale: isActive ? 1.15 : 1,
                                                        boxShadow: isActive ? "0 0 40px rgba(16, 185, 129, 0.6)" : "none"
                                                    }}
                                                    transition={{ type: "spring", stiffness: 200 }}
                                                >
                                                    <motion.span
                                                        className="text-2xl font-bold"
                                                        animate={{ color: isActive ? "#10b981" : "#6b7280" }}
                                                    >
                                                        {step.number}
                                                    </motion.span>
                                                </motion.div>
                                            </div>

                                            <motion.h3
                                                className="text-lg font-semibold mb-2"
                                                animate={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.4)" }}
                                            >
                                                {step.title}
                                            </motion.h3>
                                            <motion.p
                                                className="text-sm leading-relaxed"
                                                animate={{ color: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)" }}
                                            >
                                                {step.description}
                                            </motion.p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CTA */}
                        <motion.div
                            animate={{ opacity: currentStep >= 4 ? 1 : 0.4 }}
                            className="text-center mt-12"
                        >
                            <Link href="/register" className="group relative inline-flex">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity" />
                                <div className="relative inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-black bg-white rounded-full transition-transform group-hover:scale-105">
                                    Hemen Dene
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    );
}
