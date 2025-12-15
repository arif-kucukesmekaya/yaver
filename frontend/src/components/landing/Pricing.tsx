'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';

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
        buttonText: 'Başla',
        variant: 'basic'
    },
    {
        name: 'Pro',
        description: 'Aktif satıcılar için',
        price: '4999',
        period: '/ay',
        credits: '100 Kredi/Ay',
        icon: Zap,
        popular: true,
        features: [
            'Aylık 100 AI üretim kredisi',
            'Tüm pazaryerleri',
            'Gelişmiş SEO optimizasyonu',
            'Sıra beklemeden işlem',
            'Toplu içerik üretimi',
            'Gelişmiş Analitik',
        ],
        buttonText: 'Pro\'ya Geç',
        variant: 'pro'
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
            'Özel Hesap Yöneticisi',
        ],
        buttonText: 'İletişime Geç',
        variant: 'enterprise'
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Basit ve Şeffaf <span className="text-indigo-400">Fiyatlandırma</span>
                    </motion.h2>
                    <p className="text-lg text-white/50">
                        Gizli ücret yok. İstediğiniz zaman iptal edin.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan, index) => (
                        <PricingCard key={plan.name} plan={plan} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PricingCard({ plan, index }: { plan: typeof plans[0], index: number }) {
    const isPro = plan.variant === 'pro';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "relative p-8 rounded-3xl border transition-all duration-500 group",
                isPro
                    ? "bg-white/[0.03] border-indigo-500/50 shadow-2xl shadow-indigo-500/10 scale-105 z-10 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)]"
                    : "bg-white/[0.01] border-white/5 hover:bg-white/[0.02] hover:border-white/10 hover:-translate-y-2 hover:shadow-xl"
            )}
        >
            {isPro && (
                <>
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-purple-500/25 z-20">
                        En Çok Tercih Edilen
                    </div>
                    {/* Animated Border Beam */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent -translate-x-full animate-beam" />
                    </div>
                </>
            )}

            {/* Icon */}
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110",
                isPro ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-white/60"
            )}>
                <plan.icon className="w-6 h-6" />
            </div>

            {/* Header */}
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-white/50 text-sm mb-6">{plan.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white tracking-tight">{plan.price === 'Özel' ? '' : '₺'}{plan.price}</span>
                <span className="text-white/40">{plan.period}</span>
            </div>

            <div className="w-full h-px bg-white/5 mb-6" />

            {/* Features */}
            <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <Check className={cn("w-5 h-5 shrink-0 transition-colors", isPro ? "text-indigo-400 group-hover:text-indigo-300" : "text-white/30 group-hover:text-white/50")} />
                        {feature}
                    </li>
                ))}
            </ul>

            <Link
                href="/register"
                className={cn(
                    "block w-full py-4 rounded-xl text-center font-medium transition-all duration-200 relative overflow-hidden",
                    isPro
                        ? "bg-white text-black hover:bg-indigo-50 hover:scale-[1.02] shadow-lg shadow-white/10"
                        : "bg-white/5 text-white hover:bg-white/10 hover:scale-[1.02]"
                )}
            >
                <span className="relative z-10">{plan.buttonText}</span>
            </Link>
        </motion.div>
    );
}
