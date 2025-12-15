'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Check } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [error, setError] = useState('');

    // Password validation
    const passwordChecks = {
        length: formData.password.length >= 6,
        hasLetter: /[a-zA-Z]/.test(formData.password),
        hasNumber: /[0-9]/.test(formData.password),
    };
    const isPasswordValid = Object.values(passwordChecks).every(Boolean);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isPasswordValid) {
            setError('Lütfen şifre gereksinimlerini karşılayın');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8881/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Kayıt başarısız');
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
                throw new Error(data.error || 'Google ile kayıt başarısız');
            }

            // Store tokens
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Google ile kayıt başarısız');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google ile kayıt iptal edildi');
    };

    return (
        <>
            <div className="h-screen flex bg-black overflow-hidden">
                {/* Left side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
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
                                Hesap oluşturun
                            </h1>
                            <p className="text-white/50 text-sm">
                                Hemen ücretsiz başlayın
                            </p>
                        </div>

                        {/* Google Signup */}
                        <div className="mb-4">
                            {isGoogleLoading ? (
                                <div className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl">
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    <span className="text-white text-sm">Google ile kayıt yapılıyor...</span>
                                </div>
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="filled_black"
                                    size="large"
                                    width="100%"
                                    text="signup_with"
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

                            {/* Name fields in row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5">Ad</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            placeholder="Adınız"
                                            className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5">Soyad</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        placeholder="Soyadınız"
                                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    />
                                </div>
                            </div>

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

                                {/* Password requirements - inline */}
                                {formData.password && (
                                    <div className="mt-2 flex flex-wrap gap-3">
                                        <PasswordCheck checked={passwordChecks.length} text="6+ karakter" />
                                        <PasswordCheck checked={passwordChecks.hasLetter} text="Harf" />
                                        <PasswordCheck checked={passwordChecks.hasNumber} text="Rakam" />
                                    </div>
                                )}
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
                                        Kayıt Ol
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login link + Terms */}
                        <div className="mt-4 text-center">
                            <p className="text-white/50 text-sm">
                                Zaten hesabınız var mı?{' '}
                                <Link href="/login" className="text-white hover:text-indigo-400 transition-colors font-medium">
                                    Giriş yapın
                                </Link>
                            </p>
                            <p className="mt-3 text-[10px] text-white/30">
                                Kayıt olarak{' '}
                                <Link href="/terms" className="underline">Kullanım Koşulları</Link>
                                {' '}ve{' '}
                                <Link href="/privacy" className="underline">Gizlilik Politikası</Link>
                                &apos;nı kabul edersiniz.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Right side - Image */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <Image
                        src="/auth-bg.png"
                        alt="Register background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/50" />

                    {/* Logo on image */}
                    <div className="absolute top-8 right-8">
                        <Link
                            href="/"
                            className="text-2xl font-bold text-white"
                            style={{ fontFamily: 'var(--font-space), system-ui, sans-serif' }}
                        >
                            yaver
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

function PasswordCheck({ checked, text }: { checked: boolean; text: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${checked ? 'bg-green-500' : 'bg-white/10'}`}>
                {checked && <Check className="w-2.5 h-2.5 text-white" />}
            </div>
            <span className={`text-xs ${checked ? 'text-green-400' : 'text-white/40'}`}>
                {text}
            </span>
        </div>
    );
}

