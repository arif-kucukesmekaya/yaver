'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Package, Store, Sparkles, Send, Check } from 'lucide-react';
import { useRef } from 'react';

const steps = [
    {
        title: 'Ürün Ekle',
        desc: 'Ürün bilgilerinizi sisteme girin veya toplu yükleyin.',
        icon: Package,
        color: '#3b82f6',
    },
    {
        title: 'Pazaryeri Seç',
        desc: 'Trendyol, Hepsiburada, Amazon seçin.',
        icon: Store,
        color: '#8b5cf6',
    },
    {
        title: 'AI Üretimi',
        desc: 'Yapay zeka SEO-uyumlu içerik oluşturur.',
        icon: Sparkles,
        color: '#ec4899',
    },
    {
        title: 'Yayınla',
        desc: 'Tek tıkla pazaryerlerine gönderin.',
        icon: Send,
        color: '#10b981',
    },
];

export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Pipeline progress
    const pipelineProgress = useTransform(scrollYProgress, [0.2, 0.85], [0, 1]);

    // Step activation thresholds - first step starts at 0.2, not 0
    const stepThresholds = [0.2, 0.4, 0.6, 0.8];

    return (
        <div ref={containerRef} className="relative h-[300vh]">
            <div className="sticky top-0 min-h-screen flex items-center justify-center">
                <section id="how-it-works" className="w-full">
                    <div className="max-w-5xl mx-auto px-6">

                        {/* Header - Sadece başlık */}
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-white">Nasıl </span>
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Çalışır?
                                </span>
                            </motion.h2>

                            <motion.p
                                className="text-lg text-white/40 mt-4"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                4 adımda profesyonel içerik üretin
                            </motion.p>
                        </div>

                        {/* Pipeline & Steps - Tam ortada */}
                        <div className="relative py-8">

                            {/* Pipeline Track */}
                            <div className="hidden md:block absolute top-[6rem] left-[10%] right-[10%] h-1 rounded-full bg-white/5" />

                            {/* Animated Pipeline */}
                            <motion.div
                                className="hidden md:block absolute top-[6rem] left-[10%] h-1 rounded-full origin-left overflow-hidden"
                                style={{
                                    scaleX: pipelineProgress,
                                    width: '80%',
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-emerald-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-emerald-500 blur-md opacity-50" />

                                {/* Shimmer */}
                                <motion.div
                                    className="absolute inset-0 w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                    animate={{ x: ['-100%', '600%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                />
                            </motion.div>

                            {/* Laser Head */}
                            <motion.div
                                className="hidden md:block absolute top-[6rem]"
                                style={{
                                    left: useTransform(pipelineProgress, v => `calc(10% + ${v * 80}%)`),
                                    opacity: useTransform(scrollYProgress, [0.15, 0.25], [0, 1])
                                }}
                            >
                                <div className="relative -translate-x-1/2 -translate-y-[calc(50%-2px)]">
                                    <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_8px_rgba(255,255,255,0.4)]" />
                                </div>
                            </motion.div>

                            {/* Steps Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {steps.map((step, idx) => (
                                    <StepItem
                                        key={idx}
                                        step={step}
                                        index={idx}
                                        scrollProgress={scrollYProgress}
                                        threshold={stepThresholds[idx]}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function StepItem({ step, index, scrollProgress, threshold }: {
    step: typeof steps[0];
    index: number;
    scrollProgress: MotionValue<number>;
    threshold: number;
}) {
    const Icon = step.icon;

    // Step becomes active only after reaching its threshold
    const isActive = useTransform(scrollProgress, v => v >= threshold);

    return (
        <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            {/* Circle */}
            <div className="relative mb-6">
                {/* Glow */}
                <motion.div
                    className="absolute -inset-4 rounded-full blur-2xl transition-opacity duration-500"
                    style={{
                        backgroundColor: step.color,
                        opacity: useTransform(isActive, v => v ? 0.35 : 0)
                    }}
                />

                {/* Main Circle */}
                <motion.div
                    className="relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-500"
                    style={{
                        backgroundColor: useTransform(isActive, v => v ? step.color : 'transparent'),
                        borderWidth: 3,
                        borderColor: step.color,
                        boxShadow: useTransform(isActive, v =>
                            v ? `0 8px 40px ${step.color}50` : 'none'
                        )
                    }}
                >
                    <motion.div
                        style={{ color: useTransform(isActive, v => v ? '#ffffff' : step.color) }}
                    >
                        <Icon className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
                    </motion.div>
                </motion.div>

                {/* Checkmark */}
                <motion.div
                    className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                    style={{
                        scale: useTransform(isActive, v => v ? 1 : 0),
                        opacity: useTransform(isActive, v => v ? 1 : 0)
                    }}
                >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
            </div>

            {/* Content */}
            <motion.div
                style={{ opacity: useTransform(isActive, v => v ? 1 : 0.4) }}
                className="transition-opacity duration-500"
            >
                <h3 className="text-xl font-bold text-white mb-2">
                    {step.title}
                </h3>
                <p className="text-sm text-white/50 max-w-[180px]">
                    {step.desc}
                </p>
            </motion.div>
        </motion.div>
    );
}
