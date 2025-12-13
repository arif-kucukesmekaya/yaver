'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    type: ToastType;
    title: string;
    message?: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const toastConfig: Record<ToastType, { icon: React.ElementType; bg: string; border: string; iconColor: string }> = {
    success: {
        icon: CheckCircle,
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        iconColor: 'text-green-400',
    },
    error: {
        icon: AlertCircle,
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        iconColor: 'text-red-400',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        iconColor: 'text-amber-400',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        iconColor: 'text-blue-400',
    },
};

export function Toast({ type, title, message, isVisible, onClose, duration = 5000 }: ToastProps) {
    const config = toastConfig[type];
    const Icon = config.icon;

    // Auto close
    if (isVisible && duration > 0) {
        setTimeout(onClose, duration);
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    className={cn(
                        'fixed top-4 right-4 z-[100] max-w-sm w-full p-4 rounded-xl border backdrop-blur-sm shadow-2xl',
                        config.bg,
                        config.border
                    )}
                >
                    <div className="flex gap-3">
                        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm">{title}</p>
                            {message && (
                                <p className="text-white/60 text-sm mt-1">{message}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4 text-white/40" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Error display component for inline errors
interface ErrorAlertProps {
    error: string | null;
    onDismiss?: () => void;
    className?: string;
}

export function ErrorAlert({ error, onDismiss, className }: ErrorAlertProps) {
    if (!error) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
                'p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3',
                className
            )}
        >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                <p className="text-red-400 text-sm">{formatErrorMessage(error)}</p>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="p-1 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
                >
                    <X className="w-4 h-4 text-red-400" />
                </button>
            )}
        </motion.div>
    );
}

// Format error messages to be more user-friendly
function formatErrorMessage(error: string): string {
    const errorMap: Record<string, string> = {
        'No token provided': 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
        'Invalid token': 'Oturum geçersiz. Lütfen tekrar giriş yapın.',
        'User not found': 'Kullanıcı bulunamadı.',
        'Invalid credentials': 'E-posta veya şifre hatalı.',
        'Email already exists': 'Bu e-posta adresi zaten kayıtlı.',
        'Insufficient credits': 'Yetersiz kredi. Lütfen kredi satın alın.',
        'Product not found': 'Ürün bulunamadı.',
        'Failed to fetch': 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
        'Network Error': 'Ağ hatası. Lütfen internet bağlantınızı kontrol edin.',
        'Request failed': 'İstek başarısız oldu. Lütfen tekrar deneyin.',
        'Internal server error': 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    };

    // Check for exact matches
    if (errorMap[error]) {
        return errorMap[error];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(errorMap)) {
        if (error.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }

    // Return original if no match
    return error;
}

// Loading component
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

export function LoadingSpinner({ size = 'md', text, className }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-2',
        lg: 'w-12 h-12 border-3',
    };

    return (
        <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
            <div
                className={cn(
                    'border-indigo-500 border-t-transparent rounded-full animate-spin',
                    sizeClasses[size]
                )}
            />
            {text && <span className="text-white/50 text-sm">{text}</span>}
        </div>
    );
}

// Full page loading
export function PageLoading({ text = 'Yükleniyor...' }: { text?: string }) {
    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}

// Empty state component
interface EmptyStateProps {
    icon?: React.ElementType;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            {Icon && (
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white/20" />
                </div>
            )}
            <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
            {description && (
                <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">{description}</p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
