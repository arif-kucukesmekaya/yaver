'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, X } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8881/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Giriş başarısız');
            }

            // Store tokens
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsGoogleLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8881/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Google ile giriş başarısız');
            }

            // Store tokens
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Google ile giriş başarısız');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google ile giriş iptal edildi');
    };

    return (
        <>
            <div className="h-screen flex bg-black overflow-hidden">
                {/* Left side - Image */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <Image
                        src="/auth-bg.png"
                        alt="Login background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" />

                    <div className="absolute top-8 left-8">
                        <Link
                            href="/"
                            className="text-2xl font-bold text-white"
                            style={{ fontFamily: 'var(--font-space), system-ui, sans-serif' }}
                        >
                            yaver
                        </Link>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        {/* Logo */}
                        <div className="mb-4">
                            <Link
                                href="/"
                                className="text-2xl font-bold text-white"
                                style={{ fontFamily: 'var(--font-space), system-ui, sans-serif' }}
                            >
                                yaver
                            </Link>
                        </div>

                        {/* Header */}
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-white mb-1">
                                Tekrar hoş geldiniz
                            </h1>
                            <p className="text-white/50 text-sm">
                                Hesabınıza giriş yapın
                            </p>
                        </div>

                        {/* Google Login */}
                        <div className="mb-4">
                            {isGoogleLoading ? (
                                <div className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg">
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    <span className="text-white text-sm">Google ile giriş yapılıyor...</span>
                                </div>
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="filled_black"
                                    size="large"
                                    width="100%"
                                    text="continue_with"
                                    shape="rectangular"
                                />
                            )}
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-white/30 text-xs">veya</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {error && (
                                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                                    {error}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-xs text-white/60 mb-1.5">E-posta</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="ornek@email.com"
                                        required
                                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs text-white/60 mb-1.5">Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    Şifremi unuttum
                                </Link>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black font-medium text-sm rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Giriş Yap
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Register link */}
                        <p className="mt-6 text-center text-white/50 text-sm">
                            Hesabınız yok mu?{' '}
                            <Link
                                href="/register"
                                className="text-white hover:text-indigo-400 transition-colors font-medium"
                            >
                                Kayıt olun
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
