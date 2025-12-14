'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Notifications';

const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Güvenlik', icon: Lock },
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
            <div>
                <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
                <p className="text-white/50 mt-1">Hesap ve profil ayarlarınızı yönetin</p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all', activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white')}>
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                {activeTab === 'profile' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div><h2 className="text-lg font-semibold text-white mb-1">Profil Bilgileri</h2><p className="text-sm text-white/50">Kişisel bilgilerinizi güncelleyin</p></div>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                {profileData.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div><p className="text-white font-medium">{user?.email}</p><button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors mt-1">Fotoğraf değiştir</button></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm text-white/60 mb-2">Ad</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /><input type="text" value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} placeholder="Adınız" className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all" /></div></div>
                            <div><label className="block text-sm text-white/60 mb-2">Soyad</label><input type="text" value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} placeholder="Soyadınız" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all" /></div>
                            <div><label className="block text-sm text-white/60 mb-2">Telefon</label><div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /><input type="tel" value={profileData.phoneNumber} onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })} placeholder="+90 5XX XXX XX XX" className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all" /></div></div>
                            <div><label className="block text-sm text-white/60 mb-2">Şirket</label><div className="relative"><Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /><input type="text" value={profileData.companyName} onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })} placeholder="Şirket adı" className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all" /></div></div>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl disabled:opacity-50 transition-colors">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                {saved ? 'Kaydedildi' : 'Kaydet'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'security' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div><h2 className="text-lg font-semibold text-white mb-1">Güvenlik</h2><p className="text-sm text-white/50">Şifrenizi değiştirin</p></div>
                        <div className="max-w-md space-y-4">
                            {(['current', 'new', 'confirm'] as const).map((field) => (
                                <div key={field}>
                                    <label className="block text-sm text-white/60 mb-2">{field === 'current' ? 'Mevcut Şifre' : field === 'new' ? 'Yeni Şifre' : 'Şifre Tekrar'}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input type={showPasswords[field] ? 'text' : 'password'} value={passwordData[field === 'current' ? 'currentPassword' : field === 'new' ? 'newPassword' : 'confirmPassword']} onChange={(e) => setPasswordData({ ...passwordData, [field === 'current' ? 'currentPassword' : field === 'new' ? 'newPassword' : 'confirmPassword']: e.target.value })} placeholder="••••••••" className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-all" />
                                        <button type="button" onClick={() => setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                            {showPasswords[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleChangePassword} disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl disabled:opacity-50 transition-colors">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                            Şifreyi Değiştir
                        </button>
                    </motion.div>
                )}

                {activeTab === 'notifications' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div><h2 className="text-lg font-semibold text-white mb-1">Bildirimler</h2><p className="text-sm text-white/50">E-posta bildirim tercihlerinizi yönetin</p></div>
                        <div className="space-y-4 max-w-lg">
                            {[
                                { key: 'emailUpdates', label: 'E-posta güncellemeleri', desc: 'Hesap ve güvenlik güncellemeleri hakkında bildirimler' },
                                { key: 'productNotifications', label: 'Ürün bildirimleri', desc: 'Ürünleriniz hakkında durum güncellemeleri' },
                                { key: 'marketingEmails', label: 'Pazarlama e-postaları', desc: 'Yenilikler ve özel teklifler hakkında bildirimler' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div><p className="font-medium text-white">{item.label}</p><p className="text-sm text-white/50">{item.desc}</p></div>
                                    <button onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })} className={cn('w-12 h-7 rounded-full transition-colors relative', notifications[item.key as keyof typeof notifications] ? 'bg-indigo-500' : 'bg-white/20')}>
                                        <div className={cn('w-5 h-5 bg-white rounded-full absolute top-1 transition-all', notifications[item.key as keyof typeof notifications] ? 'left-6' : 'left-1')} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'billing' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div><h2 className="text-lg font-semibold text-white mb-1">Fatura Bilgileri</h2><p className="text-sm text-white/50">Fatura ve ödeme bilgilerinizi yönetin</p></div>
                        <div className="text-center py-12"><CreditCard className="w-16 h-16 text-white/10 mx-auto mb-4" /><p className="text-white/40">Fatura bilgileri yakında eklenecek</p></div>
                    </motion.div>
                )}
            </div>
            <Toast
                type={toast.type}
                title={toast.title}
                message={toast.message}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    );
}
