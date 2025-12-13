'use client';

import { useState, useCallback } from 'react';
import type { ToastType } from '@/components/ui/Notifications';

interface ToastState {
    isVisible: boolean;
    type: ToastType;
    title: string;
    message?: string;
}

export function useToast() {
    const [toast, setToast] = useState<ToastState>({
        isVisible: false,
        type: 'info',
        title: '',
        message: undefined,
    });

    const showToast = useCallback((type: ToastType, title: string, message?: string) => {
        setToast({ isVisible: true, type, title, message });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
    }, []);

    const success = useCallback((title: string, message?: string) => {
        showToast('success', title, message);
    }, [showToast]);

    const error = useCallback((title: string, message?: string) => {
        showToast('error', title, message);
    }, [showToast]);

    const warning = useCallback((title: string, message?: string) => {
        showToast('warning', title, message);
    }, [showToast]);

    const info = useCallback((title: string, message?: string) => {
        showToast('info', title, message);
    }, [showToast]);

    return {
        toast,
        showToast,
        hideToast,
        success,
        error,
        warning,
        info,
    };
}

// Error message formatting utility
export function formatApiError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'Beklenmeyen bir hata oluştu';
}

// User-friendly error messages
export const errorMessages: Record<string, string> = {
    'No token provided': 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
    'Invalid token': 'Oturum geçersiz. Lütfen tekrar giriş yapın.',
    'Token expired': 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
    'User not found': 'Kullanıcı bulunamadı.',
    'Invalid credentials': 'E-posta veya şifre hatalı.',
    'Invalid email or password': 'E-posta veya şifre hatalı.',
    'Email already exists': 'Bu e-posta adresi zaten kayıtlı.',
    'Email already registered': 'Bu e-posta adresi zaten kayıtlı.',
    'Insufficient credits': 'Yetersiz kredi. Lütfen kredi satın alın.',
    'Not enough credits': 'Yetersiz kredi. Lütfen kredi satın alın.',
    'Product not found': 'Ürün bulunamadı.',
    'Marketplace not found': 'Pazaryeri bulunamadı.',
    'Category not found': 'Kategori bulunamadı.',
    'Failed to fetch': 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
    'Network request failed': 'Ağ hatası. Lütfen internet bağlantınızı kontrol edin.',
    'Network Error': 'Ağ hatası. Lütfen internet bağlantınızı kontrol edin.',
    'Request failed': 'İstek başarısız oldu. Lütfen tekrar deneyin.',
    'Internal server error': 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    'Rate limit exceeded': 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.',
    'Too many requests': 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.',
    'Validation error': 'Girilen bilgiler hatalı. Lütfen kontrol edin.',
    'AI generation failed': 'AI içerik üretimi başarısız oldu. Lütfen tekrar deneyin.',
    'OpenAI API error': 'AI servisi şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
    'Gemini API error': 'AI servisi şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
};

export function getUserFriendlyError(error: string): string {
    // Check exact matches
    if (errorMessages[error]) {
        return errorMessages[error];
    }

    // Check partial matches (case-insensitive)
    const lowerError = error.toLowerCase();
    for (const [key, value] of Object.entries(errorMessages)) {
        if (lowerError.includes(key.toLowerCase())) {
            return value;
        }
    }

    // Return original if no match found
    return error;
}
