'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

const plans = [
    {
        name: 'Başlangıç',
        description: 'Denemek isteyenler için',
        price: '0',
        period: 'Ücretsiz',
        credits: '10 Kredi/Ay',
        icon: Sparkles,
        popular: false,
        features: [
            'Aylık 10 AI üretim kredisi',
            'Trendyol desteği',
            'Hepsiburada desteği',
            'Temel SEO optimizasyonu',
            'E-posta desteği',
        ],
        buttonText: 'Ücretsiz Başla',
        buttonVariant: 'secondary' as const,
    },
    {
        name: 'Pro',
        description: 'Aktif satıcılar için',
        price: '299',
        period: '/ay',
        credits: '100 Kredi/Ay',
        icon: Zap,
        popular: true,
        features: [
            'Aylık 100 AI üretim kredisi',
            'Tüm pazaryerleri (Trendyol, Hepsiburada, Amazon)',
            'Gelişmiş SEO optimizasyonu',
            'Öncelikli destek',
            'Toplu içerik üretimi',
            'Revizyon geçmişi',
        ],
        buttonText: 'Pro\'ya Geç',
        buttonVariant: 'primary' as const,
    },
    {
        name: 'Kurumsal',
        description: 'Büyük mağazalar için',
        price: 'Özel',
        period: 'Fiyat',
        credits: 'Sınırsız',
        icon: Crown,
        popular: false,
        features: [
            'Sınırsız AI üretim',
            'Özel API erişimi',
            'Marka özelleştirme',
            'Özel entegrasyonlar',
            '7/24 Premium destek',
            'Hesap yöneticisi',
            'SLA garantisi',
        ],
        buttonText: 'İletişime Geç',
        buttonVariant: 'secondary' as const,
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                        <Crown className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Esnek Fiyatlandırma</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        İhtiyacınıza Uygun
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Plan Seçin
                        </span>
                    </h2>

                    <p className="text-lg text-white/50 max-w-2xl mx-auto">
                        Her bütçeye uygun planlar. İstediğiniz zaman yükseltme veya iptal edebilirsiniz.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-sm font-medium text-white z-10">
                                    En Popüler
                                </div>
                            )}

                            <div
                                className={`relative h-full p-8 rounded-2xl border transition-all duration-500 ${plan.popular
                                        ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-indigo-500/30 hover:border-indigo-500/50'
                                        : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04]'
                                    }`}
                            >
                                {/* Glow effect for popular plan */}
                                {plan.popular && (
                                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl transition-opacity duration-500" />
                                )}

                                <div className="relative">
                                    {/* Plan Icon */}
                                    <div className={`inline-flex p-3 rounded-xl mb-6 ${plan.popular
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                            : 'bg-white/10'
                                        }`}>
                                        <plan.icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Plan Name & Description */}
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-white/50 mb-6">{plan.description}</p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <span className="text-5xl font-bold text-white">
                                            {plan.price === 'Özel' ? '' : '₺'}
                                            {plan.price}
                                        </span>
                                        <span className="text-white/50 ml-2">{plan.period}</span>
                                        <div className="text-sm text-indigo-400 mt-2">{plan.credits}</div>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                                <span className="text-white/70">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <Link
                                        href="/register"
                                        className={`block w-full py-4 rounded-xl font-medium text-center transition-all duration-300 ${plan.buttonVariant === 'primary'
                                                ? 'bg-white text-black hover:bg-white/90'
                                                : 'bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:border-white/20'
                                            }`}
                                    >
                                        {plan.buttonText}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center text-white/40 mt-12"
                >
                    Tüm planlar 14 gün para iade garantisi içerir. Kredi kartı gerekmez.
                </motion.p>
            </div>
        </section>
    );
}
