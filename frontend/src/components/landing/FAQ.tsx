'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
    {
        question: 'YAVER diğer araçlardan nasıl farklı?',
        answer: 'Sadece metin üretmiyoruz. YAVER, pazaryerlerinin algoritmalarını (Trendyol SEO, Amazon A10) analiz ederek satışa dönüşme ihtimali en yüksek içerikleri üretir.'
    },
    {
        question: 'Kredilerim biterse ne olur?',
        answer: 'Credits sayfasından anında ek paket satın alabilir veya bir üst plana geçerek daha uygun birim maliyetlerden faydalanabilirsiniz.'
    },
    {
        question: 'Entegrasyon ne kadar sürer?',
        answer: 'API entegrasyonu gerekmez. XML dosyanızı yüklemeniz veya ürün linklerini yapıştırmanız yeterlidir. Sisteme giriş yapıp ilk içeriğinizi üretmeniz 2 dakika sürer.'
    },
    {
        question: 'İade politikanız nedir?',
        answer: 'Memnun kalmazsanız ilk 14 gün içinde koşulsuz şartsız para iadesi yapıyoruz. Bize destek hattından ulaşmanız yeterli.'
    }
];

export function FAQ() {
    return (
        <section id="faq" className="py-32 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Aklınıza takılanlar mı var?</h2>
                    <p className="text-white/50">En sık karşılaşılan soruları sizin için derledik.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} faq={faq} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ faq }: { faq: { question: string, answer: string } }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-b border-white/5"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className={cn("text-lg font-medium transition-colors", isOpen ? "text-indigo-400" : "text-white group-hover:text-white/80")}>
                    {faq.question}
                </span>
                <span className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    isOpen ? "bg-indigo-500/20 text-indigo-400 rotate-180" : "bg-white/5 text-white/50 group-hover:bg-white/10"
                )}>
                    <ChevronDown className="w-5 h-5" />
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-white/50 leading-relaxed">
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
