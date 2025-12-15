'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    accentColor?: 'blue' | 'emerald' | 'amber' | 'violet';
    change?: {
        value: number;
        label: string;
    };
    href?: string;
}

const accentColors = {
    blue: {
        iconBg: 'bg-blue-500/10',
        iconText: 'text-blue-400',
        glow: 'group-hover:shadow-blue-500/5',
    },
    emerald: {
        iconBg: 'bg-emerald-500/10',
        iconText: 'text-emerald-400',
        glow: 'group-hover:shadow-emerald-500/5',
    },
    amber: {
        iconBg: 'bg-amber-500/10',
        iconText: 'text-amber-400',
        glow: 'group-hover:shadow-amber-500/5',
    },
    violet: {
        iconBg: 'bg-violet-500/10',
        iconText: 'text-violet-400',
        glow: 'group-hover:shadow-violet-500/5',
    },
};

function useAnimatedCounter(value: number, duration = 1) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(count, value, { duration, ease: 'easeOut' });
        const unsubscribe = rounded.on('change', (v) => setDisplayValue(v));
        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [value, count, rounded, duration]);

    return displayValue;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    accentColor = 'blue',
    change,
}: StatCardProps) {
    const animatedValue = useAnimatedCounter(value);
    const isPositive = change ? change.value >= 0 : true;
    const colors = accentColors[accentColor];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "group relative p-5 rounded-2xl transition-all cursor-pointer",
                "bg-zinc-900/50 border border-zinc-800/80",
                "hover:border-zinc-700/80 hover:shadow-xl",
                colors.glow
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className={cn("p-2.5 rounded-xl", colors.iconBg)}>
                    <Icon className={cn("w-5 h-5", colors.iconText)} />
                </div>

                {change && (
                    <div className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
                        isPositive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                    )}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPositive ? '+' : ''}{change.value}%
                    </div>
                )}
            </div>

            {/* Value */}
            <div className="space-y-1">
                <p className="text-3xl font-bold text-white tabular-nums tracking-tight">
                    {animatedValue.toLocaleString()}
                </p>
                <p className="text-sm text-zinc-500">{title}</p>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4 text-zinc-600" />
            </div>
        </motion.div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-zinc-800 animate-pulse" />
                <div className="w-14 h-6 rounded-lg bg-zinc-800 animate-pulse" />
            </div>
            <div className="space-y-2">
                <div className="h-8 w-24 bg-zinc-800 rounded-lg animate-pulse" />
                <div className="h-4 w-20 bg-zinc-800/50 rounded animate-pulse" />
            </div>
        </div>
    );
}
