import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface GenerationError {
    id: number;
    productId: number;
    marketplaceId?: number;
    errorType: string;
    errorMessage?: string;
    retryCount: number;
    resolved: boolean;
    lastRetryAt?: string;
    createdAt: string;
    product?: {
        id: number;
        brandName?: string;
    };
    marketplace?: {
        id: number;
        name: string;
        logoUrl?: string;
    };
}

export interface ErrorStats {
    total: number;
    unresolved: number;
}

export function useErrors(options?: { unresolvedOnly?: boolean; limit?: number }) {
    const [errors, setErrors] = useState<GenerationError[]>([]);
    const [stats, setStats] = useState<ErrorStats>({ total: 0, unresolved: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchErrors = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (options?.unresolvedOnly) params.append('unresolved', 'true');
            if (options?.limit) params.append('limit', options.limit.toString());

            const response = await api.get(`/errors?${params.toString()}`);
            if (response.success) {
                setErrors(response.data as GenerationError[]);
                setStats((response as unknown as { stats: ErrorStats }).stats);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch errors');
        } finally {
            setIsLoading(false);
        }
    }, [options?.unresolvedOnly, options?.limit]);

    useEffect(() => {
        fetchErrors();
    }, [fetchErrors]);

    const resolveError = useCallback(async (errorId: number) => {
        try {
            const response = await api.patch(`/errors/${errorId}/resolve`);
            if (response.success) {
                setErrors(prev => prev.map(e =>
                    e.id === errorId ? { ...e, resolved: true } : e
                ));
                setStats(prev => ({
                    ...prev,
                    unresolved: Math.max(0, prev.unresolved - 1),
                }));
            }
            return response.success;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resolve error');
            return false;
        }
    }, []);

    return { errors, stats, isLoading, error, refetch: fetchErrors, resolveError };
}
