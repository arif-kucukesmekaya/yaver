'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calculator,
    TrendingUp,
    Truck,
    ShoppingBag,
    DollarSign,
    Percent,
    AlertCircle,
    Tag
} from 'lucide-react';

// --- Types ---
type Marketplace = 'Trendyol' | 'Hepsiburada' | 'Amazon';

type CargoCompany = 'Yurtiçi' | 'Aras' | 'Sürat' | 'HepsiJet' | 'PTT' | 'UPS' | 'DHL';
type Category = 'Giyim' | 'Elektronik' | 'Ev' | 'Kozmetik' | 'AnneBebek' | 'Diğer';

// --- Constants & Real Data (2026 Estimates) ---
const MARKETPLACE_CONFIG: Record<Marketplace, { serviceFee: number, branding: string, logoUrl: string }> = {
    Trendyol: {
        serviceFee: 5.99,
        branding: 'text-orange-500',
        logoUrl: '/logo/trendyol.png'
    },
    Hepsiburada: {
        serviceFee: 4.50,
        branding: 'text-orange-600',
        logoUrl: '/logo/hepsiburada.png'
    },
    Amazon: {
        serviceFee: 0,
        branding: 'text-yellow-500',
        logoUrl: '/logo/amazon.png'
    }
};

// Commissions by Category (Approximate 2026 Rates)
const CATEGORY_RATES: Record<Category, Record<Marketplace, number>> = {
    'Giyim': { Trendyol: 0.21, Hepsiburada: 0.18, Amazon: 0.15 },
    'Elektronik': { Trendyol: 0.15, Hepsiburada: 0.12, Amazon: 0.09 },
    'Ev': { Trendyol: 0.16, Hepsiburada: 0.18, Amazon: 0.15 },
    'Kozmetik': { Trendyol: 0.18, Hepsiburada: 0.17, Amazon: 0.13 },
    'AnneBebek': { Trendyol: 0.16, Hepsiburada: 0.15, Amazon: 0.11 },
    'Diğer': { Trendyol: 0.20, Hepsiburada: 0.18, Amazon: 0.15 }
};

const CATEGORY_LABELS: Record<Category, string> = {
    'Giyim': 'Giyim & Moda',
    'Elektronik': 'Elektronik',
    'Ev': 'Ev & Yaşam',
    'Kozmetik': 'Kozmetik',
    'AnneBebek': 'Anne & Bebek',
    'Diğer': 'Diğer / Genel'
};

const CARGO_CONFIG: Record<CargoCompany, { price: number, logoUrl: string }> = {
    'Yurtiçi': { price: 65.00, logoUrl: '/logo/yurticikargo.png' },
    'Aras': { price: 58.50, logoUrl: '/logo/araskargo.png' },
    'Sürat': { price: 52.00, logoUrl: '/logo/suratkargo.png' },
    'HepsiJet': { price: 39.00, logoUrl: '/logo/hepsijet.jpg' },
    'PTT': { price: 55.00, logoUrl: '/logo/pttkargo.png' },
    'UPS': { price: 75.00, logoUrl: '/logo/ups.jpg' },
    'DHL': { price: 85.00, logoUrl: '/logo/dhlkargo.png' }
};

export default function DashboardCalculatorPage() {
    // State
    const [cost, setCost] = useState<number | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [category, setCategory] = useState<Category>('Giyim');
    const [marketplace, setMarketplace] = useState<Marketplace>('Trendyol');
    const [cargo, setCargo] = useState<CargoCompany>('Yurtiçi');

    // Results
    const [results, setResults] = useState({
        commissionRate: 0,
        commissionAmount: 0,
        serviceFee: 0,
        cargoCost: 0,
        totalDeductions: 0,
        netProfit: 0,
        margin: 0
    });

    // Calculate
    useEffect(() => {
        const costVal = Number(cost) || 0;
        const priceVal = Number(price) || 0;

        // 1. Get Rates
        const mpConfig = MARKETPLACE_CONFIG[marketplace];
        const rate = CATEGORY_RATES[category][marketplace];

        // 2. Calc
        const commissionAmt = priceVal * rate;
        const totalCommission = commissionAmt + mpConfig.serviceFee;
        const cargoAmt = CARGO_CONFIG[cargo].price;

        // 3. Totals
        const deductions = totalCommission + cargoAmt + costVal;
        const profit = priceVal - deductions;
        const marginPercent = priceVal > 0 ? (profit / priceVal) * 100 : 0;

        setResults({
            commissionRate: rate,
            commissionAmount: commissionAmt,
            serviceFee: mpConfig.serviceFee,
            cargoCost: cargoAmt,
            totalDeductions: deductions,
            netProfit: profit,
            margin: marginPercent
        });
    }, [cost, price, category, marketplace, cargo]);

    // Format Currency
    const fmt = (n: number) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

    return (
        <main className="min-h-screen text-white p-4 md:p-8 relative overflow-hidden">

            <div className="max-w-6xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center gap-4"
                >

                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Kâr/Zarar Hesaplama Simülasyonu</h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Gerçek 2026 komisyon verileriyle net kârınızı hesaplayın.
                        </p>
                    </div>
                </motion.div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Inputs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-5 space-y-6"
                    >
                        {/* 1. Category & Price */}
                        <div className="bg-zinc-900/80 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-xl">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Ürün & Fiyatlandırma
                            </h3>

                            <div className="space-y-5">
                                {/* Category Selector */}
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-2">Ürün Kategorisi (Kritik)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                className={`px-3 py-3 text-sm font-bold rounded-xl border transition-all truncate ${category === cat
                                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-black/40 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                                                    }`}
                                            >
                                                {CATEGORY_LABELS[cat]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-400 mb-2">Satış Fiyatı</label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                min="0"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                                onWheel={(e) => e.currentTarget.blur()}
                                                placeholder="0"
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-xl font-bold text-white placeholder:text-zinc-700 font-mono"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm select-none">TL</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-zinc-400 mb-2">Maliyet</label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                min="0"
                                                value={cost}
                                                onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))}
                                                onWheel={(e) => e.currentTarget.blur()}
                                                placeholder="0"
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-red-500/50 outline-none transition-all text-lg font-medium text-zinc-300 placeholder:text-zinc-700 font-mono"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm select-none">TL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Platform & Cargo */}
                        <div className="bg-zinc-900/80 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-xl">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                                Pazaryeri & Lojistik
                            </h3>

                            <div className="space-y-4">
                                <div className="flex flex-col gap-3">
                                    {(Object.keys(MARKETPLACE_CONFIG) as Marketplace[]).map((mk) => {
                                        const rate = CATEGORY_RATES[category][mk];
                                        const ratePercent = Math.round(rate * 100);
                                        const config = MARKETPLACE_CONFIG[mk];
                                        const calculatedComm = (Number(price) || 0) * rate;

                                        return (
                                            <button
                                                key={mk}
                                                onClick={() => setMarketplace(mk)}
                                                className={`relative flex items-center justify-between p-4 rounded-xl border transition-all text-left ${marketplace === mk
                                                    ? 'bg-gradient-to-r from-indigo-900/40 to-indigo-900/10 border-indigo-500/50 ring-1 ring-indigo-500'
                                                    : 'bg-black/30 border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-6 w-full">
                                                    <div className="w-16 h-16 relative flex items-center justify-center shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={config.logoUrl}
                                                            alt={`${mk} Logo`}
                                                            className="object-contain max-h-full max-w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className={`font-bold text-lg ${marketplace === mk ? 'text-white' : 'text-zinc-400'}`}>{mk}</div>
                                                        <div className="text-base text-zinc-500 mt-1">
                                                            Komisyon: <span className="text-indigo-300 font-mono font-bold">%{ratePercent}</span>
                                                            {config.serviceFee > 0 && <span className="opacity-70"> + {config.serviceFee} TL Hizmet</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                {Number(price) > 0 && (
                                                    <div className="text-right">
                                                        <div className="text-sm font-bold text-red-300 font-mono">-{fmt(calculatedComm + config.serviceFee)} TL</div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                                        Kargo Firması
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {(Object.keys(CARGO_CONFIG) as CargoCompany[]).map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setCargo(c)}
                                                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-sm transition-all overflow-hidden group ${cargo === c
                                                    ? 'bg-red-900/20 border-red-500 ring-1 ring-red-500/50'
                                                    : 'bg-black/30 border-white/5 hover:border-white/10 hover:bg-white/5'
                                                    }`}
                                            >
                                                {/* Logo Container */}
                                                <div className="w-16 h-16 flex items-center justify-center mb-3">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={CARGO_CONFIG[c].logoUrl}
                                                        alt={c}
                                                        className="object-contain max-h-full max-w-full"
                                                        onError={(e) => {
                                                            // Safe fallback
                                                            const target = e.currentTarget;
                                                            target.style.display = 'none';
                                                            if (target.parentElement) {
                                                                target.parentElement.innerText = c;
                                                                target.parentElement.className = "w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center text-sm font-bold text-zinc-400 mb-2";
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <div className={`font-bold mb-1 text-sm ${cargo === c ? 'text-red-400' : 'text-zinc-400 group-hover:text-zinc-300'}`}>{c}</div>
                                                <div className={`font-mono font-bold text-lg ${cargo === c ? 'text-red-300' : 'text-zinc-500'}`}>{CARGO_CONFIG[c].price} TL</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>


                    {/* RIGHT COLUMN: Results */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <div className="sticky top-6">
                            <div className="bg-black border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                                {/* Background Glow */}
                                {/* Background Glow - Centered */}
                                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[90px] opacity-30 pointer-events-none transition-colors duration-700 ${results.netProfit > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />

                                <div className="relative z-10">
                                    <h2 className="text-zinc-500 font-bold text-base mb-6 flex items-center justify-between uppercase tracking-wider">
                                        HESAPLAMA DETAYI
                                        <span className="text-sm px-3 py-1 rounded-lg bg-white/5 text-white">{marketplace} • {category}</span>
                                    </h2>

                                    {/* Waterfall visual */}
                                    <div className="space-y-3 mb-10">
                                        {/* 1. Price */}
                                        <div className="flex items-center justify-between group">
                                            <span className="text-zinc-400 text-lg font-medium group-hover:text-white transition-colors">Satış Fiyatı</span>
                                            <span className="font-mono text-2xl font-bold text-white transition-all group-hover:tracking-wider">
                                                {Number(price) > 0 ? fmt(Number(price)) : '0,00'} TL
                                            </span>
                                        </div>

                                        {/* 2. Commission */}
                                        <div className="flex items-center justify-between group text-red-400">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-red-500 mr-3" />
                                                <span className="text-base font-medium opacity-80 group-hover:opacity-100">Komisyon (%{Math.round(results.commissionRate * 100)}) + Hizmet</span>
                                            </div>
                                            <span className="font-mono text-lg font-bold opacity-80 group-hover:opacity-100">-{fmt(results.commissionAmount + results.serviceFee)} TL</span>
                                        </div>

                                        {/* 3. Cargo */}
                                        <div className="flex items-center justify-between group text-red-400">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-red-500 mr-3" />
                                                <span className="text-base font-medium opacity-80 group-hover:opacity-100">Kargo Ücreti ({cargo})</span>
                                            </div>
                                            <span className="font-mono text-lg font-bold opacity-80 group-hover:opacity-100">-{fmt(results.cargoCost)} TL</span>
                                        </div>

                                        {/* 4. Cost */}
                                        <div className="flex items-center justify-between group text-zinc-500 border-b border-white/10 pb-4 mb-4">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-zinc-600 mr-3" />
                                                <span className="text-base font-medium">Ürün Maliyeti</span>
                                            </div>
                                            <span className="font-mono text-lg font-bold">-{fmt(Number(cost) || 0)} TL</span>
                                        </div>
                                    </div>


                                    {/* FINAL RESULT */}
                                    <div className="text-center">
                                        <div className="inline-block relative">
                                            <span className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2 block">Cebine Kalan Net</span>
                                            <div className={`text-6xl md:text-7xl font-black font-mono tracking-tighter transition-all duration-300 ${results.netProfit > 0
                                                ? 'text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-emerald-600 scale-100'
                                                : results.netProfit < 0 ? 'text-red-500 scale-95' : 'text-zinc-600'
                                                }`}>
                                                {fmt(results.netProfit)}
                                            </div>
                                            <span className="text-2xl font-bold text-zinc-600 absolute -right-12 bottom-4">TL</span>
                                        </div>

                                        {Number(price) > 0 && (
                                            <div className="mt-6 flex justify-center gap-4">
                                                <div className={`px-6 py-3 rounded-2xl flex items-center shadow-lg border backdrop-blur-md ${results.netProfit > 0
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                                                    }`}>
                                                    <Percent className="w-5 h-5 mr-2" />
                                                    <span className="font-bold text-lg">%{results.margin.toFixed(2)}</span>
                                                    <span className="text-xs opacity-60 ml-2 font-medium uppercase tracking-wide">Kâr Marjı</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}
