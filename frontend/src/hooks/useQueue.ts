import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface QueueStats {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    total: number;
}

export interface QueueItem {
    id: number;
    productId: number;
    sourceImageUrl: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    geminiJobId?: string;
    retryCount: number;
    createdAt: string;
    product?: {
        id: number;
        brandName?: string;
    };
}

export function useQueue() {
    const [stats, setStats] = useState<QueueStats>({
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        total: 0,
    });
    const [items, setItems] = useState<QueueItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            const response = await api.get('/queue/status');
            if (response.success) {
                setStats(response.data as QueueStats);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch queue stats');
        }
    }, []);

    const fetchItems = useCallback(async (limit = 10) => {
        try {
            const response = await api.get(`/queue/items?limit=${limit}`);
            if (response.success) {
                setItems(response.data as QueueItem[]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch queue items');
        }
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            await Promise.all([fetchStats(), fetchItems()]);
            setIsLoading(false);
        };
        fetchAll();
    }, [fetchStats, fetchItems]);

    const refetch = useCallback(async () => {
        await Promise.all([fetchStats(), fetchItems()]);
    }, [fetchStats, fetchItems]);

    return { stats, items, isLoading, error, refetch };
}
