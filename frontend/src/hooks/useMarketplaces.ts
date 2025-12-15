import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Marketplace {
    id: number;
    name: string;
    apiBaseUrl?: string;
    logoUrl?: string;
    configs?: Array<{
        id: number;
        config: Record<string, unknown>;
    }>;
}

export function useMarketplaces() {
    const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMarketplaces = async () => {
            try {
                const response = await api.get('/marketplaces');
                if (response.success) {
                    setMarketplaces(response.data as Marketplace[]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch marketplaces');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMarketplaces();
    }, []);

    return { marketplaces, isLoading, error };
}
