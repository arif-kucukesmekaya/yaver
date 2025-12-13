'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { User } from '@/types';
import { authApi } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            const response = await authApi.me();
            if (response.success && response.data) {
                setUser(response.data as User);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = async (email: string, password: string) => {
        const response = await authApi.login(email, password);
        if (response.success && response.data) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            setUser(response.data.user as User);
        } else {
            throw new Error('Login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider
            value= {{
        user,
            isLoading,
            isAuthenticated: !!user,
                login,
                logout,
                refreshUser,
            }
}
        >
    { children }
    </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

// Hook for protected routes
export function useRequireAuth() {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            window.location.href = '/login';
        }
    }, [isAuthenticated, isLoading]);

    return { isAuthenticated, isLoading };
}
