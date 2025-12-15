import type { ApiResponse, PaginatedResponse, UserCredits } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8881';

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getAuthHeaders(): HeadersInit {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle 401 - Token expired
                if (response.status === 401) {
                    // Try refresh token
                    const refreshed = await this.refreshTokens();
                    if (refreshed) {
                        // Retry request with new token
                        return this.request<T>(endpoint, options);
                    } else {
                        // Redirect to login
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            window.location.href = '/login';
                        }
                    }
                }

                // Handle rate limiting
                if (response.status === 429) {
                    throw new Error('Too many requests');
                }

                // Handle server errors
                if (response.status >= 500) {
                    throw new Error('Internal server error');
                }

                throw new Error(data.error || data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            // Handle network errors
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                console.error('Network Error:', error);
                throw new Error('Failed to fetch');
            }

            // Log other errors
            console.error('API Error:', error);
            throw error;
        }
    }

    private async refreshTokens(): Promise<boolean> {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

        if (!refreshToken) return false;

        try {
            const response = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) return false;

            const data = await response.json();

            if (data.data?.accessToken) {
                localStorage.setItem('accessToken', data.data.accessToken);
                if (data.data.refreshToken) {
                    localStorage.setItem('refreshToken', data.data.refreshToken);
                }
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    // GET request
    async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
        const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
        return this.request<T>(url, { method: 'GET' });
    }

    // POST request
    async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    // PATCH request
    async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    // DELETE request
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    // Upload file (multipart/form-data)
    async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        const response = await fetch(url, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }

        return data;
    }
}

export const api = new ApiClient(API_BASE_URL);

// Convenience methods
export const authApi = {
    login: (email: string, password: string) =>
        api.post<{ accessToken: string; refreshToken: string; user: unknown }>('/auth/login', { email, password }),

    register: (data: { email: string; password: string; firstName?: string; lastName?: string }) =>
        api.post<{ accessToken: string; refreshToken: string; user: unknown }>('/auth/register', data),

    me: () => api.get<unknown>('/auth/me'),

    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),

    resetPassword: (token: string, password: string) =>
        api.post('/auth/reset-password', { token, password }),

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    },
};

export const productsApi = {
    list: (page = 1, limit = 10) =>
        api.get<unknown[]>('/products', { page: String(page), limit: String(limit) }) as Promise<PaginatedResponse<unknown[]>>,

    get: (id: number) => api.get<unknown>(`/products/${id}`),

    create: (data: {
        brandName?: string;
        categoryId?: number;
        rawUserPrompt: string;
        marketplaceIds?: number[];
        imageUrl?: string;
    }) => api.post<unknown>('/products', data),

    update: (id: number, data: unknown) => api.patch<unknown>(`/products/${id}`, data),

    delete: (id: number) => api.delete(`/products/${id}`),

    getListings: (productId: number) => api.get<unknown[]>(`/products/${productId}/listings`),

    updateListing: (productId: number, marketplaceId: number, data: unknown) =>
        api.patch<unknown>(`/products/${productId}/listings/${marketplaceId}`, data),
};



export const creditsApi = {
    getBalance: () => api.get<UserCredits>('/credits'),

    getHistory: (limit = 20) => api.get<unknown[]>('/credits/history', { limit: String(limit) }),

    purchase: (amount: number) => api.post<{ creditsPurchased: number; newBalance: UserCredits }>('/credits/purchase', { amount }),
};

export const subscriptionApi = {
    upgrade: (planName: string) => api.post<{ success: boolean; data: any }>('/subscriptions/upgrade', { planName }),
};


export const aiApi = {
    generateContent: (productId: number, marketplaceIds: number[]) =>
        api.post<unknown>('/ai/generate-content', { productId, marketplaceIds }),

    preview: (data: {
        rawUserPrompt: string;
        brandName?: string;
        categoryId?: number;
        marketplaceId: number;
    }) => api.post<unknown>('/ai/preview', data),
};

export const marketplacesApi = {
    list: () => api.get<unknown[]>('/marketplaces'),
    get: (id: number) => api.get<unknown>(`/marketplaces/${id}`),
};

export const categoriesApi = {
    list: () => api.get<unknown[]>('/categories'),
};

export const uploadApi = {
    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.upload<{ url: string; filename: string }>('/upload/product-image', formData);
    },

    uploadToProduct: (productId: number, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.upload<{ url: string; id: number }>(`/upload/product-image/${productId}`, formData);
    },
};

export default api;
