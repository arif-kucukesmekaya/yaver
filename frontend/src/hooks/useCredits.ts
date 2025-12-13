'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CreditTransaction } from '@/types';
import { creditsApi } from '@/lib/api';

function hasToken(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
}

export function useCredits() {
    const [balance, setBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = useCallback(async () => {
        if (!hasToken()) {
            setBalance(0);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await creditsApi.getBalance();
            if (response.success && response.data) {
                setBalance(response.data.availableCredits);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch credits');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    const purchaseCredits = async (amount: number) => {
        try {
            const response = await creditsApi.purchase(amount);
            if (response.success && response.data) {
                setBalance(response.data.newBalance);
                return response.data;
            }
            throw new Error('Purchase failed');
        } catch (err) {
            throw err;
        }
    };

    return {
        balance,
        isLoading,
        error,
        refetch: fetchBalance,
        purchaseCredits,
    };
}

export function useCreditHistory(limit = 20) {
    const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        if (!hasToken()) {
            setTransactions([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await creditsApi.getHistory(limit);
            if (response.success && response.data) {
                setTransactions(response.data as CreditTransaction[]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch history');
        } finally {
            setIsLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { transactions, isLoading, error, refetch: fetchHistory };
}

