'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
    User,
    Phone,
    Building2,
    Lock,
    Bell,
    CreditCard,
    Save,
    Loader2,
    Check,
    Eye,
    EyeOff,
    Settings,
    Shield,
    Mail,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Notifications';

const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Güvenlik', icon: Shield },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'billing', label: 'Fatura', icon: CreditCard },
];

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const { toast, success, error, hideToast } = useToast();

    const [profileData, setProfileData] = useState({ firstName: '', lastName: '', phoneNumber: '', companyName: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [notifications, setNotifications] = useState({ emailUpdates: true, productNotifications: true, marketingEmails: false });

    useEffect(() => {
        if (user) setProfileData({ firstName: user.firstName || '', lastName: user.lastName || '', phoneNumber: '', companyName: '' });
    }, [user]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            success('Kaydedildi', 'Profil bilgileri güncellendi');
        } catch {
            error('Hata', 'Kaydetme başarısız oldu');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            error('Hata', 'Şifreler eşleşmiyor');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            error('Hata', 'Şifre en az 6 karakter olmalı');
            return;
        }
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            success('Başarılı', 'Şifre başarıyla değiştirildi');
        } catch {
            error('Hata', 'Şifre değiştirme başarısız oldu');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-zinc-800 rounded-xl">
                    <Settings className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
                    <p className="text-sm text-zinc-500">Hesap ve profil ayarlarınızı yönetin</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-zinc-900/50 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                            activeTab === tab.id
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-500 hover:text-white'
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="font-semibold text-white mb-1">Profil Bilgileri</h2>
                                <p className="text-sm text-zinc-500">Kişisel bilgilerinizi güncelleyin</p>
                            </div>

                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                                    {profileData.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{user?.email}</p>
                                    <button className="text-sm text-blue-400 hover:text-blue-300 mt-1">Fotoğraf değiştir</button>
                                </div>
                            </div>

                            {/* Subscription Status Card */}
                            <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-zinc-400">Mevcut Plan</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-semibold">{user?.subscription?.plan || 'Free'}</span>
                                            {/* Free plan is always active effectively, but show tag for paid plans or generally active */}
                                            {(user?.subscription?.isActive || user?.subscription?.plan === 'Free') && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    AKTİF
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {user?.subscription?.plan && user?.subscription?.plan !== 'Free' ? (
                                        <>
                                            <p className="text-xs text-zinc-500">Yenileme Tarihi</p>
                                            <p className="text-sm text-white">
                                                {user?.subscription?.endDate
                                                    ? new Date(user.subscription.endDate).toLocaleDateString('tr-TR')
                                                    : '-'}
                                            </p>
                                        </>
                                    ) : (
                                        <Link href="/dashboard/payment" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                            Plan Yükselt &rarr;
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="w-full h-px bg-zinc-800/50" />

                            {/* Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Ad"
                                    icon={User}
                                    value={profileData.firstName}
                                    onChange={(v) => setProfileData({ ...profileData, firstName: v })}
                                    placeholder="Adınız"
                                />
                                <InputField
                                    label="Soyad"
                                    value={profileData.lastName}
                                    onChange={(v) => setProfileData({ ...profileData, lastName: v })}
                                    placeholder="Soyadınız"
                                />
                                <InputField
                                    label="Telefon"
                                    icon={Phone}
                                    value={profileData.phoneNumber}
                                    onChange={(v) => setProfileData({ ...profileData, phoneNumber: v })}
                                    placeholder="+90 5XX XXX XX XX"
                                />
                                <InputField
                                    label="Şirket"
                                    icon={Building2}
                                    value={profileData.companyName}
                                    onChange={(v) => setProfileData({ ...profileData, companyName: v })}
                                    placeholder="Şirket adı"
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className={cn(
                                        'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all',
                                        saved
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    )}
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    {saved ? 'Kaydedildi!' : 'Kaydet'}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="font-semibold text-white mb-1">Güvenlik</h2>
                                <p className="text-sm text-zinc-500">Şifrenizi değiştirin</p>
                            </div>

                            <div className="max-w-md space-y-4">
                                <PasswordField
                                    label="Mevcut Şifre"
                                    value={passwordData.currentPassword}
                                    onChange={(v) => setPasswordData({ ...passwordData, currentPassword: v })}
                                    show={showPasswords.current}
                                    onToggle={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                />
                                <PasswordField
                                    label="Yeni Şifre"
                                    value={passwordData.newPassword}
                                    onChange={(v) => setPasswordData({ ...passwordData, newPassword: v })}
                                    show={showPasswords.new}
                                    onToggle={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                />
                                <PasswordField
                                    label="Şifre Tekrar"
                                    value={passwordData.confirmPassword}
                                    onChange={(v) => setPasswordData({ ...passwordData, confirmPassword: v })}
                                    show={showPasswords.confirm}
                                    onToggle={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleChangePassword}
                                disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm rounded-xl disabled:opacity-50 transition-all"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                Şifreyi Değiştir
                            </motion.button>
                        </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                        <motion.div
                            key="notifications"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="font-semibold text-white mb-1">Bildirimler</h2>
                                <p className="text-sm text-zinc-500">E-posta bildirim tercihlerinizi yönetin</p>
                            </div>

                            <div className="space-y-4 max-w-lg">
                                {[
                                    { key: 'emailUpdates', label: 'E-posta güncellemeleri', desc: 'Hesap ve güvenlik güncellemeleri', icon: Mail },
                                    { key: 'productNotifications', label: 'Ürün bildirimleri', desc: 'Ürünleriniz hakkında durum güncellemeleri', icon: Bell },
                                    { key: 'marketingEmails', label: 'Pazarlama e-postaları', desc: 'Yenilikler ve özel teklifler', icon: CreditCard },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-zinc-800 rounded-lg">
                                                <item.icon className="w-4 h-4 text-zinc-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{item.label}</p>
                                                <p className="text-sm text-zinc-500">{item.desc}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                            className={cn(
                                                'w-12 h-7 rounded-full transition-all relative',
                                                notifications[item.key as keyof typeof notifications]
                                                    ? 'bg-blue-500'
                                                    : 'bg-zinc-700'
                                            )}
                                        >
                                            <motion.div
                                                className="w-5 h-5 bg-white rounded-full absolute top-1"
                                                animate={{ left: notifications[item.key as keyof typeof notifications] ? 'calc(100% - 24px)' : '4px' }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'billing' && (
                        <motion.div
                            key="billing"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6 text-center py-12"
                        >
                            <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
                                <CreditCard className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-white/90 text-lg mb-2">Abonelik ve Ödemeler</h2>
                                <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-8">
                                    Planınızı yönetmek, yükseltmek veya ekstra kredi satın almak için yeni ödeme sayfasını ziyaret edin.
                                </p>
                                <Link
                                    href="/dashboard/payment"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Ödeme Sayfasına Git
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Toast type={toast.type} title={toast.title} message={toast.message} isVisible={toast.isVisible} onClose={hideToast} />
        </div>
    );
}

function InputField({
    label,
    icon: Icon,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    icon?: React.ElementType;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div>
            <label className="block text-sm text-zinc-400 mb-2">{label}</label>
            <div className="relative">
                {Icon && (
                    <Icon className={cn(
                        "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                        isFocused ? "text-blue-400" : "text-zinc-600"
                    )} />
                )}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full py-2.5 rounded-xl text-sm transition-all",
                        "bg-zinc-800/50 text-white placeholder:text-zinc-600",
                        "border",
                        Icon ? "pl-10 pr-4" : "px-4",
                        isFocused ? "border-blue-500/50 ring-2 ring-blue-500/10" : "border-zinc-700/50"
                    )}
                />
            </div>
        </div>
    );
}

function PasswordField({
    label,
    value,
    onChange,
    show,
    onToggle,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    show: boolean;
    onToggle: () => void;
}) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div>
            <label className="block text-sm text-zinc-400 mb-2">{label}</label>
            <div className="relative">
                <Lock className={cn(
                    "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    isFocused ? "text-blue-400" : "text-zinc-600"
                )} />
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="••••••••"
                    className={cn(
                        "w-full pl-10 pr-11 py-2.5 rounded-xl text-sm transition-all",
                        "bg-zinc-800/50 text-white placeholder:text-zinc-600",
                        "border",
                        isFocused ? "border-blue-500/50 ring-2 ring-blue-500/10" : "border-zinc-700/50"
                    )}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
