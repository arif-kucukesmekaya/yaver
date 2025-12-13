// Marketplace logo mapping
export const marketplaceLogos: Record<string, string> = {
    'trendyol': '/logo/trendyol.png',
    'hepsiburada': '/logo/hepsiburada.png',
    'amazon': '/logo/amazon.png',
};

export function getMarketplaceLogo(name: string): string | null {
    const normalizedName = name.toLowerCase();
    return marketplaceLogos[normalizedName] || null;
}
