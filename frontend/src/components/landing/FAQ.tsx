'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: 'YAVER nasıl çalışır?',
        answer: 'YAVER, ürün bilgilerinizi alarak GPT-4 tabanlı yapay zeka ile her pazaryerine özel başlık ve açıklamalar oluşturur. Her platformun SEO kurallarına ve karakter limitlerlerine uygun içerikler saniyeler içinde hazır olur.'
    },
    {
        question: 'Hangi pazaryerlerini destekliyorsunuz?',
        answer: 'Şu anda Trendyol, Hepsiburada ve Amazon Türkiye desteklenmektedir. Yakında n11, GittiGidiyor ve diğer platformlar da eklenecektir.'
    },
    {
        question: 'Kredi sistemi nasıl çalışır?',
        answer: 'Her AI içerik üretimi belirli miktarda kredi kullanır. Trendyol ve Hepsiburada için 1 kredi, Amazon için 2 kredi gereklidir. Kullanılmayan kredileriniz bir sonraki aya devretmez.'
    },
    {
        question: 'Oluşturulan içerikleri düzenleyebilir miyim?',
        answer: 'Evet, oluşturulan tüm içerikleri istediğiniz gibi düzenleyebilirsiniz. Ayrıca beğenmediğiniz içerikleri tek tıkla yeniden oluşturabilirsiniz.'
    },
    {
        question: 'Ücretsiz plan ile ne kadar içerik oluşturabilirim?',
        answer: 'Ücretsiz plan ile ayda 10 kredi kullanabilirsiniz. Bu, yaklaşık 8-10 ürün için içerik üretmenize olanak tanır. Daha fazla ihtiyacınız varsa Pro plana geçebilirsiniz.'
    },
    {
        question: 'Aboneliğimi iptal edebilir miyim?',
        answer: 'Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal ettiğiniz dönemin sonuna kadar tüm özellikleri kullanmaya devam edersiniz.'
    },
    {
        question: 'API erişimi sağlıyor musunuz?',
        answer: 'Evet, Kurumsal planımızda API erişimi sunuyoruz. Bu sayede YAVER\'yi kendi sistemlerinize entegre edebilirsiniz.'
    },
    {
        question: 'Yasaklı kelime kontrolü yapılıyor mu?',
        answer: 'Evet, her pazaryerinin yasakladığı kelimeleri otomatik olarak tespit edip içeriklerden çıkarıyoruz. Bu sayede ürünlerinizin reddedilme riski minimuma iner.'
    }
];

function FAQItem({ question, answer, isOpen, onClick }: {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group"
        >
            <button
                onClick={onClick}
                className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 text-left ${isOpen
                    ? 'bg-white/[0.05] border-white/10'
                    : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10'
                    }`}
            >
                <span className="text-lg font-medium text-white pr-4">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0"
                >
                    <ChevronDown className="w-5 h-5 text-white/50" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="px-6 py-4 text-white/60 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-32 bg-black relative overflow-hidden">
            {/* Background */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-amber-300">Sıkça Sorulan Sorular</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Merak Ettikleriniz
                    </h2>

                    <p className="text-lg text-white/50">
                        Aklınıza takılan sorular mı var? Cevapları burada bulabilirsiniz.
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-12 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                >
                    <p className="text-white/60 mb-4">Başka sorunuz mu var?</p>
                    <a
                        href="mailto:destek@yaver.com"
                        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                        Bize Ulaşın
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
