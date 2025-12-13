'use client';

import { motion } from 'framer-motion';
import {
    Wand2,
    Languages,
    Zap,
    BarChart3,
    RefreshCw,
    Shield,
    Sparkles,
    ArrowUpRight
} from 'lucide-react';

const features = [
    {
        icon: Wand2,
        title: 'AI Destekli Üretim',
        description: 'GPT-4 ile optimize edilmiş, dönüşüm odaklı başlık ve açıklamalar anında hazır.',
        color: 'from-indigo-500 to-purple-500'
    },
    {
        icon: Languages,
        title: 'Çoklu Dil Desteği',
        description: 'Türkçe ve İngilizce içeriklerinizi otomatik olarak oluşturun ve düzenleyin.',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: Zap,
        title: 'Anında Sonuç',
        description: 'Saniyeler içinde tüm pazaryerleri için optimize edilmiş içerik alın.',
        color: 'from-amber-500 to-orange-500'
    },
    {
        icon: BarChart3,
        title: 'SEO Optimizasyonu',
        description: 'Her pazaryerinin algoritmasına uygun, arama sonuçlarında öne çıkan içerikler.',
        color: 'from-emerald-500 to-teal-500'
    },
    {
        icon: RefreshCw,
        title: 'Sınırsız Revizyon',
        description: 'Beğenmediğiniz içerikleri tek tıkla yeniden oluşturun.',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Shield,
        title: 'Platform Uyumlu',
        description: 'Her pazaryerinin kurallarına uygun, yasaklı kelime kontrolü yapılmış içerikler.',
        color: 'from-rose-500 to-pink-500'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};


export function Features() {
    return (
        <section id="features" className="py-32 bg-black relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm text-indigo-300">Neden YAVER?</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Satışlarınızı Artıran
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            Güçlü Özellikler
                        </span>
                    </h2>

                    <p className="text-lg text-white/50 max-w-2xl mx-auto">
                        E-ticaret içerik üretimini basitleştiren ve satışlarınızı artıran
                        yapay zeka destekli araçlar.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            className="group relative"
                        >
                            <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10">
                                {/* Hover glow effect */}
                                <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />

                                {/* Icon */}
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                    {feature.title}
                                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white/50" />
                                </h3>

                                <p className="text-white/50 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
