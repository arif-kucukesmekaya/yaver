"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export function Testimonials() {
    return (
        <div className="h-[40rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-20 z-10">
                Kullanıcılarımız Ne Diyor?
            </h2>
            <InfiniteMovingCards
                items={testimonials}
                direction="right"
                speed="slow"
            />
        </div>
    );
}

const testimonials = [
    {
        quote:
            "Yaver.ai sayesinde ürün açıklamalarımı yazmak haftalar alırdı, şimdi dakikalar sürüyor. Satışlarım %200 arttı!",
        name: "Ahmet Yılmaz",
        title: "E-ticaret Uzmanı",
    },
    {
        quote:
            "SEO uyumlu içerik üretmek hiç bu kadar kolay olmamıştı. Trendyol ve Hepsiburada'da üst sıralara çıktık.",
        name: "Ayşe Demir",
        title: "Butik Mağaza Sahibi",
    },
    {
        quote: "Global pazara açılırken dil bariyerini Yaver ile aştık. Harika bir asistan.",
        name: "Mehmet Öz",
        title: "İhracat Direktörü",
    },
    {
        quote:
            "Toplu işlem özelliği hayat kurtarıcı. 5000 ürünü tek seferde güncelledik.",
        name: "Canan Kaya",
        title: "Operasyon Müdürü",
    },
    {
        quote:
            "Arayüzü çok modern ve kullanımı çok kolay. Kesinlikle tavsiye ederim.",
        name: "Zeynep Çelik",
        title: "Girişimci",
    },
];
