'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        label: string;
    };
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
}

export function StatCard({ title, value, change, icon: Icon, iconColor = 'text-indigo-400', iconBg = 'bg-indigo-500/10' }: StatCardProps) {
    return (
        <div className="relative p-6 bg-white/[0.02] border border-white/[0.08] rounded-2xl hover:border-white/[0.15] transition-all group overflow-hidden">
            {/* Subtle gradient bg on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm text-white/50 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>

                    {change && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className={cn(
                                'text-sm font-medium',
                                change.value >= 0 ? 'text-green-400' : 'text-red-400'
                            )}>
                                {change.value >= 0 ? '+' : ''}{change.value}%
                            </span>
                            <span className="text-xs text-white/40">{change.label}</span>
                        </div>
                    )}
                </div>

                <div className={cn('p-3 rounded-xl', iconBg)}>
                    <Icon className={cn('w-6 h-6', iconColor)} />
                </div>
            </div>
        </div>
    );
}

// Loading skeleton
export function StatCardSkeleton() {
    return (
        <div className="p-6 bg-white/[0.02] border border-white/[0.08] rounded-2xl animate-pulse">
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-8 w-20 bg-white/10 rounded" />
                    <div className="h-3 w-32 bg-white/10 rounded" />
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl" />
            </div>
        </div>
    );
}
