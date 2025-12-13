'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';

const navLinks = [
    { label: 'Nasıl Çalışır', href: '#how-it-works' },
    { label: 'Özellikler', href: '#features' },
    { label: 'Fiyatlandırma', href: '#pricing' },
    { label: 'SSS', href: '#faq' },
];

const socialLinks = [
    { label: 'LinkedIn', href: 'https://linkedin.com/company/yaverapp' },
    { label: 'Twitter', href: 'https://twitter.com/yaverapp' },
    { label: 'Instagram', href: 'https://instagram.com/yaverapp' },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#050508] overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none">
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-purple-600/25 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/30 rounded-full blur-[150px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Top Section */}
                <div className="py-5 md:py-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Contact Badge */}
                        <div className="flex items-center gap-2 mb-6">
                            <Plus className="w-4 h-4 text-indigo-400" />
                            <span className="text-indigo-400 text-sm font-medium">İletişim</span>
                        </div>

                        {/* Headline */}
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-semibold text-white leading-tight max-w-lg mb-6">
                            <span className="text-white">Birlikte çalışmak,</span>{' '}
                            <span className="text-white/50">platformu denemek veya daha fazla bilgi almak ister misiniz?</span>
                        </h2>

                        {/* Contact and Nav Row */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                            {/* Email */}
                            <div>
                                <p className="text-white/40 text-sm mb-2">Bize ulaşın:</p>
                                <a
                                    href="mailto:info@yaver.ai"
                                    className="group inline-flex items-center gap-2 text-white text-lg hover:text-indigo-400 transition-colors"
                                >
                                    info@yaver.ai
                                    <ArrowUpRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </a>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex flex-wrap items-center gap-6 md:gap-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="text-white/70 hover:text-white text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </motion.div>
                </div>

                {/* Big Logo Section */}
                <div className="pt-0 pb-8 md:pb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-center"
                    >
                        {/* YAVER Text - Extra Large */}
                        <span
                            className="text-[80px] sm:text-[120px] md:text-[180px] lg:text-[240px] xl:text-[280px] font-bold text-white tracking-tighter leading-none select-none"
                            style={{ fontFamily: 'var(--font-space), system-ui, sans-serif' }}
                        >
                            yaver
                        </span>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/[0.05] py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-white/30">
                            © {currentYear} Yaver. Tüm hakları saklıdır.
                        </p>

                        <div className="flex items-center gap-6">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
