'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, PaginatedResponse } from '@/types';
import { productsApi } from '@/lib/api';

function hasToken(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
}

interface UseProductsOptions {
    page?: number;
    limit?: number;
    autoFetch?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
    const { page = 1, limit = 10, autoFetch = true } = options;

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    });

    const fetchProducts = useCallback(async (fetchPage = page) => {
        if (!hasToken()) {
            setProducts([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await productsApi.list(fetchPage, limit) as PaginatedResponse<Product[]>;

            if (response.success && response.data) {
                setProducts(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        if (autoFetch) {
            fetchProducts();
        }
    }, [fetchProducts, autoFetch]);

    const refetch = () => fetchProducts(pagination.page);
    const nextPage = () => pagination.hasNext && fetchProducts(pagination.page + 1);
    const prevPage = () => pagination.hasPrev && fetchProducts(pagination.page - 1);
    const goToPage = (p: number) => fetchProducts(p);

    return {
        products,
        isLoading,
        error,
        pagination,
        refetch,
        nextPage,
        prevPage,
        goToPage,
    };
}

export function useProduct(productId: number | null) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = useCallback(async () => {
        if (!productId || !hasToken()) {
            setProduct(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await productsApi.get(productId);
            if (response.success && response.data) {
                setProduct(response.data as Product);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch product');
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    return { product, isLoading, error, refetch: fetchProduct };
}

