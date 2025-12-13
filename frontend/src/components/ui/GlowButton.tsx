'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowButtonProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    href?: string;
    glowColor?: string;
}

export function GlowButton({
    children,
    className,
    variant = 'primary',
    size = 'md',
    onClick,
    href,
    glowColor = 'rgba(99, 102, 241, 0.5)'
}: GlowButtonProps) {
    const baseStyles = 'relative font-medium rounded-full transition-all duration-300 overflow-hidden';

    const variants = {
        primary: 'bg-white text-black hover:bg-white/90',
        secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm',
        ghost: 'bg-transparent text-white hover:bg-white/10'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3 text-base'
    };

    const content = (
        <motion.span
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Animated glow border */}
            <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `conic-gradient(from var(--angle, 0deg), ${glowColor}, transparent, ${glowColor})`,
                    animation: 'spin 3s linear infinite',
                }}
            />

            {/* Inner background */}
            <span className="absolute inset-[2px] rounded-full bg-inherit z-10" />

            {/* Content */}
            <span className="relative z-20">{children}</span>
        </motion.span>
    );

    if (href) {
        return (
            <a href={href} className="group inline-block" onClick={onClick}>
                {content}
            </a>
        );
    }

    return (
        <button className="group inline-block" onClick={onClick}>
            {content}
        </button>
    );
}
