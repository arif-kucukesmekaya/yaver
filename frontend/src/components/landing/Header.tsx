'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

const navLinks = [
    { href: '#features', label: 'Özellikler' },
    { href: '#pricing', label: 'Fiyatlandırma' },
    { href: '#how-it-works', label: 'Nasıl Çalışır' },
    { href: '#faq', label: 'SSS' },
];

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* Header */}
            <header className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                        'mx-auto flex items-center justify-between px-6 py-3 rounded-full backdrop-blur-md pointer-events-auto',
                        'transition-all duration-500 ease-out border shadow-lg',
                        isScrolled
                            ? 'max-w-xl bg-black/60 border-white/10 shadow-black/20'
                            : 'max-w-5xl bg-black/30 border-white/5'
                    )}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-3xl font-bold text-white"
                        style={{ fontFamily: 'var(--font-space), system-ui, sans-serif' }}
                    >
                        yaver
                    </Link>

                    {/* Desktop Nav - Fade out on scroll */}
                    <div className={cn(
                        'hidden md:flex items-center gap-8 transition-all duration-500',
                        isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    )}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-white/60 hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* CTA with rotating border - Hide on scroll */}
                        <div className={cn(
                            'relative hidden md:block transition-all duration-500 group',
                            isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                        )}>
                            <Link href="/register" className="group relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <button className="relative flex items-center gap-2 px-6 py-2.5 bg-black rounded-full leading-none text-white text-sm font-medium border border-white/10 backdrop-blur-xl transition-transform active:scale-95">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    <span>Başla</span>
                                </button>
                            </Link>
                        </div>


                        {/* Hamburger - Show on scroll or mobile */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={cn(
                                'p-2 text-white/70 hover:text-white transition-all duration-500',
                                isScrolled ? 'opacity-100' : 'md:opacity-0 md:w-0 md:p-0'
                            )}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </motion.nav>
            </header>

            {/* Fullscreen Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-black flex flex-col"
                    >
                        {/* Top bar */}
                        <div className="flex items-center justify-between p-6">
                            <span
                                className="text-xl font-bold text-white"
                                style={{ fontFamily: 'var(--font-space), system-ui, sans-serif' }}
                            >
                                yaver
                            </span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Menu Links */}
                        <div className="flex-1 flex flex-col items-center justify-center gap-8">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-4xl font-semibold text-white/80 hover:text-white transition-colors"
                                        style={{ fontFamily: 'var(--font-space), system-ui, sans-serif' }}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="mt-8"
                            >
                                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="group relative block w-fit mx-auto">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                    <button className="relative flex items-center gap-2 px-8 py-4 bg-black rounded-full leading-none text-white text-lg font-medium border border-white/10 backdrop-blur-xl transition-transform active:scale-95">
                                        <Sparkles className="w-5 h-5 text-indigo-400" />
                                        <span>Başla</span>
                                    </button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Bottom */}
                        <div className="p-6 flex items-center justify-center gap-6">
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-sm text-white/40 hover:text-white/70 transition-colors"
                            >
                                Giriş Yap
                            </Link>
                            <a
                                href="mailto:info@yaver.ai"
                                className="text-sm text-white/40 hover:text-white/70 transition-colors"
                            >
                                İletişim
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
