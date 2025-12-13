'use client';

import { motion } from 'framer-motion';
import { Upload, Wand2, Copy, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: Upload,
        title: 'Ürününüzü Yükleyin',
        description: 'Ürün görselini ve temel bilgileri girin. Marka, kategori ve kısa açıklama yeterli.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        number: '02',
        icon: Wand2,
        title: 'AI İçerik Oluşturur',
        description: 'Yapay zeka, her pazaryerinin kurallarına uygun başlık ve açıklamalar oluşturur.',
        color: 'from-indigo-500 to-purple-500',
    },
    {
        number: '03',
        icon: Copy,
        title: 'Kopyalayın veya Düzenleyin',
        description: 'Oluşturulan içerikleri direkt kopyalayın veya ihtiyacınıza göre düzenleyin.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        number: '04',
        icon: CheckCircle2,
        title: 'Satışlara Başlayın',
        description: 'SEO uyumlu içeriklerle ürünlerinizi listeleyin ve satışlarınızı artırın.',
        color: 'from-emerald-500 to-teal-500',
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 bg-black relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-300">4 Basit Adım</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Dakikalar İçinde
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                            Profesyonel İçerikler
                        </span>
                    </h2>

                    <p className="text-lg text-white/50 max-w-2xl mx-auto">
                        Karmaşık süreçlere son. Basit adımlarla e-ticaret içeriklerinizi oluşturun.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="relative group"
                            >
                                {/* Arrow between steps (desktop) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                                        <ArrowRight className="w-6 h-6 text-white/20" />
                                    </div>
                                )}

                                <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10 text-center">
                                    {/* Glow on hover */}
                                    <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />

                                    {/* Step Number */}
                                    <div className="relative mb-6">
                                        <span className={`text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${step.color} opacity-20`}>
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Icon */}
                                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${step.color} mb-6 relative z-10`}>
                                        <step.icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-semibold text-white mb-3 relative z-10">{step.title}</h3>
                                    <p className="text-white/50 leading-relaxed relative z-10">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center mt-16"
                >
                    <a
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10"
                    >
                        Hemen Dene
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
