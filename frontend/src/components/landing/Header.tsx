'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, ArrowUpRight } from 'lucide-react';

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
            <header className="fixed top-0 left-0 right-0 z-50 p-4">
                <motion.nav
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                        'mx-auto flex items-center justify-between px-6 py-4 rounded-2xl backdrop-blur-2xl',
                        'transition-all duration-1000 ease-out',
                        'shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]',
                        isScrolled
                            ? 'max-w-xs bg-white/[0.08] border border-white/[0.15]'
                            : 'max-w-6xl bg-white/[0.04] border border-white/[0.1]'
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
                            {/* Rotating conic gradient border */}
                            <div
                                className="absolute -inset-[1px] rounded-full animate-border-spin"
                                style={{
                                    background: 'conic-gradient(from var(--border-angle, 0deg), #3b82f6, #8b5cf6, #ec4899, #8b5cf6, #3b82f6)',
                                    padding: '1px'
                                }}
                            />

                            <Link
                                href="/register"
                                className="relative flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-[#0a0a0a] rounded-full hover:bg-black/80 transition-colors z-10"
                            >
                                Başla
                                <ArrowUpRight className="w-3.5 h-3.5" />
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
                                {/* CTA with rotating border */}
                                <div className="relative inline-block group">
                                    <div
                                        className="absolute -inset-[1px] rounded-full animate-border-spin"
                                        style={{
                                            background: 'conic-gradient(from var(--border-angle, 0deg), #3b82f6, #8b5cf6, #ec4899, #8b5cf6, #3b82f6)',
                                        }}
                                    />
                                    <Link
                                        href="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="relative inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-white bg-black rounded-full hover:bg-black/80 transition-colors"
                                    >
                                        Ücretsiz Başla
                                        <ArrowUpRight className="w-5 h-5" />
                                    </Link>
                                </div>
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
