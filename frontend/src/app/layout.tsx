import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { GoogleAuthProvider } from "@/components/providers/GoogleAuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["700"],
});


export const metadata: Metadata = {
  title: "YAVER - E-ticaret İçeriklerinizi AI ile Otomatik Oluşturun",
  description: "Tüm pazaryerleriniz için SEO uyumlu başlık ve açıklamalar tek tıkla hazır. Trendyol, Hepsiburada, Amazon için optimize edilmiş içerikler saniyeler içinde.",
  keywords: ["e-ticaret", "ai", "yapay zeka", "trendyol", "hepsiburada", "amazon", "ürün açıklaması", "seo"],
  authors: [{ name: "YAVER" }],
  openGraph: {
    title: "YAVER - AI Destekli E-ticaret İçerik Üretimi",
    description: "Tüm pazaryerleriniz için SEO uyumlu içerikler saniyeler içinde hazır.",
    type: "website",
    locale: "tr_TR",
    siteName: "YAVER",
  },
  twitter: {
    card: "summary_large_image",
    title: "YAVER - AI Destekli E-ticaret İçerik Üretimi",
    description: "Tüm pazaryerleriniz için SEO uyumlu içerikler saniyeler içinde hazır.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-black`}>
        <GoogleAuthProvider>
          {children}
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
