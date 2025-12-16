import { useEffect, useRef, useState } from 'react';

export interface SSEProductUpdate {
    type: 'status' | 'image' | 'complete';
    data: any;
}

export function useProductSSE(productId: number | null, enabled: boolean = false) {
    const [updates, setUpdates] = useState<SSEProductUpdate[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        if (!productId || !enabled) {
            // Close connection if disabled
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8881';
        const url = `${API_BASE_URL}/sse/products/${productId}/updates`;

        // Create EventSource with auth header (workaround: use query param)
        const urlWithAuth = `${url}?token=${encodeURIComponent(token)}`;
        const eventSource = new EventSource(urlWithAuth);

        eventSource.onopen = () => {
            console.log('SSE Connected');
            setIsConnected(true);
        };

        eventSource.addEventListener('status', (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            setUpdates(prev => [...prev, { type: 'status', data }]);
        });

        eventSource.addEventListener('image', (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            setUpdates(prev => [...prev, { type: 'image', data }]);
        });

        eventSource.addEventListener('complete', (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            setUpdates(prev => [...prev, { type: 'complete', data }]);
            // Close connection when complete
            eventSource.close();
            setIsConnected(false);
        });

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            setIsConnected(false);
            eventSource.close();
        };

        eventSourceRef.current = eventSource;

        return () => {
            eventSource.close();
            setIsConnected(false);
        };
    }, [productId, enabled]);

    return { updates, isConnected };
}
