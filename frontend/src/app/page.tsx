import { Header, Hero, Features, HowItWorks, Pricing, FAQ, CTA, Footer } from '@/components/landing';

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
