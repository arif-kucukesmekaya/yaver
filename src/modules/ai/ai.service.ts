import { fal } from "@fal-ai/client";
import OpenAI from "openai";

// Initialize APIs
// Note: Keys should be in .env. We use 'mock' to prevent crash if missing during build.

// 🔑 Configure FAL AI
fal.config({
    credentials: process.env['FAL_KEY'] || 'mock-key'
});

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'] || 'mock-key',
});

export type ImageType = 'lifestyle' | 'infographic' | 'detail';

export class AIService {

    /**
     * ⚡ ENHANCED: Generate SEO optimized listing for specific marketplace using GPT-4o-mini (FASTER)
     * - Amazon: English with SEO optimization with emojis
     * - Trendyol/Hepsiburada: Turkish with emojis
     * - Longer, more detailed descriptions
     */
    static async generateListing(product: any, marketplaceName: string) {
        const isAmazon = marketplaceName.toLowerCase().includes('amazon');
        const language = isAmazon ? 'English' : 'Turkish';

        const prompt = `
You are an elite, expert e-commerce copywriter specializing in ${marketplaceName}.

Product Details:
- Brand: ${product.brandName || 'Generic'}
- Description: ${product.rawUserPrompt}
- Category: ${product.category?.name || 'General'}

${this.getMarketplaceRules(marketplaceName)}

IMPORTANT REQUIREMENTS:
${isAmazon ? `
- Language: ENGLISH ONLY
- Title: SEO optimized with main keywords at the beginning
- Title length: 150-200 characters
- Description: Use bullet points (•) with rich details
- Description length: 800-1500 characters
- Include: Benefits, features, use cases, and specifications
- Tone: Professional, persuasive, benefit-focused
- NO HTML tags - use plain text with bullet points
- Focus on Amazon A+ content standards
` : `
- Language: TURKISH ONLY  
- Title: Add 2-3 relevant emojis that match the product
- Title length: 80-120 characters
- Description: Detailed and engaging with emojis
- Description length: 500-1000 characters
- Use emojis strategically (✨ 🎁 💎 🌟 ⭐ 🔥 etc.)
- Tone: Friendly, exciting, benefit-focused
- Format: Use line breaks and emojis for better readability
- NO HTML - use plain text with emojis and line breaks
`}

Output ONLY valid JSON (no markdown, no code blocks):
{
    "title": "SEO Optimized Title with ${isAmazon ? 'Keywords' : 'Emojis'}",
    "description": "Detailed description (${isAmazon ? '800-1500' : '500-1000'} chars) in ${language}",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}
        `;

        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an expert e-commerce copywriter. Output ONLY valid JSON without markdown formatting or code blocks. Use ${language} language.`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: "gpt-4o-mini", // ⚡ FASTER model
                response_format: { type: "json_object" },
                temperature: 0.8, // More creative
            });

            const content = completion.choices[0]?.message?.content;
            if (!content) {
                throw new Error("No content generated");
            }

            return JSON.parse(content);
        } catch (error) {
            console.error('Text Gen Error:', error);
            throw new Error(`Failed to generate listing for ${marketplaceName}`);
        }
    }

    /**
     * 🖼️ ENHANCED: Generate product images using Fal.ai
     * - If source image exists → Image-to-Image (preserves product)
     * - If no source image → Text-to-Image (generates from scratch)
     */
    static async generateProductImage(product: any, type: ImageType, sourceImageUrl?: string) {
        // Get source image from product or parameter
        const imageUrl = sourceImageUrl || product.sourceImages?.[0]?.imageUrl;

        // Determine if we should use image-to-image or text-to-image
        const useImageToImage = !!imageUrl;

        // Construct style-specific prompts
        let stylePrompt = "";

        if (useImageToImage) {
            // Image-to-Image: Preserve product appearance
            switch (type) {
                case 'lifestyle':
                    stylePrompt = "Keep the exact same product, same colors, same design. Place it in a beautiful lifestyle scene: modern interior, natural lighting, depth of field, atmospheric background, professional photography.";
                    break;
                case 'infographic':
                    stylePrompt = "Keep the exact same product, same colors, same design. Place on pure white background, studio lighting, professional e-commerce photo, sharp focus, no shadows.";
                    break;
                case 'detail':
                    stylePrompt = "Keep the exact same product, same colors, same design. Zoom in to show material texture and details, macro photography, professional lighting, premium quality.";
                    break;
            }
        } else {
            // Text-to-Image: Generate from description
            const basePrompt = product.rawUserPrompt || product.brandName;
            switch (type) {
                case 'lifestyle':
                    stylePrompt = `${basePrompt}. Cinematic lifestyle photography, showing the product in real-world use, atmospheric lighting, depth of field, high resolution, photorealistic.`;
                    break;
                case 'infographic':
                    stylePrompt = `${basePrompt}. Professional studio product photography, pure white background, soft lighting, sharp focus, clean look, suitable for e-commerce main image.`;
                    break;
                case 'detail':
                    stylePrompt = `${basePrompt}. Macro close-up shot, extreme detail showing material texture and craftsmanship, shallow depth of field, 8k resolution, professional lighting.`;
                    break;
            }
        }

        const fullPrompt = useImageToImage
            ? `Edit the provided product image: ${stylePrompt}. Keep the EXACT same product appearance, colors, shape, and design as shown in the input image. Product description: ${product.rawUserPrompt || 'as shown in image'}`
            : stylePrompt;

        try {
            const input: any = {
                prompt: fullPrompt,
                output_format: "png",
                resolution: "1K",
            };

            // Add image-to-image specific parameters for Nano Banana Pro
            if (useImageToImage && imageUrl) {
                let finalImageUrl = imageUrl;

                // 🔥 FIX: If local file, convert to base64 data URL
                if (imageUrl.startsWith('/uploads/')) {
                    const fs = await import('fs/promises');
                    const path = await import('path');
                    const filePath = path.join(process.cwd(), imageUrl);

                    try {
                        const fileBuffer = await fs.readFile(filePath);
                        const base64 = fileBuffer.toString('base64');
                        const ext = path.extname(filePath).slice(1).toLowerCase();
                        const mimeType = ext === 'jpg' ? 'jpeg' : ext;
                        finalImageUrl = `data:image/${mimeType};base64,${base64}`;
                        console.log(`📁 Converted local file to base64 (${Math.round(base64.length / 1024)}KB)`);
                    } catch (err) {
                        console.error(`❌ Failed to read local file: ${filePath}`, err);
                    }
                }

                // Nano Banana Pro uses image_urls array for reference images
                input.image_urls = [finalImageUrl];
                console.log(`🖼️ Using source image for ${type}: ${imageUrl.substring(0, 50)}...`);
            }

            console.log(`🎨 Generating ${type} image with prompt:`, fullPrompt.substring(0, 100) + '...');

            // 🔥 FIX: Use correct endpoint based on mode
            const endpoint = useImageToImage
                ? "fal-ai/nano-banana-pro/edit"  // Image editing endpoint
                : "fal-ai/nano-banana-pro";      // Text-to-image endpoint

            console.log(`🔧 Using endpoint: ${endpoint}`);

            const result: any = await fal.subscribe(endpoint, {
                input,
                logs: true,
            });

            if (!result.data || !result.data.images || result.data.images.length === 0) {
                throw new Error("No image returned from Fal.ai");
            }

            return {
                url: result.data.images[0].url,
                prompt: fullPrompt,
                type: type,
                sourceUrl: imageUrl,
                mode: useImageToImage ? 'image-to-image' : 'text-to-image',
                endpoint: endpoint
            };

        } catch (error) {
            console.error('Image Gen Error (Fal.ai):', error);
            throw new Error(`Failed to generate ${type} image via Nano Banana`);
        }
    }

    private static getMarketplaceRules(name: string): string {
        const rules: Record<string, string> = {
            'Amazon': `
AMAZON SEO RULES (English):
- Title Format: [Brand] [Product Type] - [Key Features] | [Main Benefit]
- Include: Size, color, material, quantity in title
- Keywords: Front-load most important search terms
- Description must have 5-8 bullet points starting with benefits
- Each bullet: 100-150 characters
- Use power words: Premium, Professional, Durable, High-Quality
- Focus on problem-solving and value proposition
- Include use cases and applications
- Mention warranty/guarantee if applicable
            `,
            'Trendyol': `
TRENDYOL KURALLARI (Türkçe):
- Başlık Formatı: [Marka] [Ürün Tipi] [Özellikler] [Emojiler]
- 2-3 emoji kullan (✨ 💎 🎁 gibi)
- Açıklama: Satır satır, emojilerle zenginleştirilmiş
- Detaylı özellikler ve faydalar
- Modern ve samimi ton
- Kampanya ve avantajları vurgula
- Kullanım alanlarını belirt
- Minimum 500, ideal 800 karakter açıklama
            `,
            'Hepsiburada': `
HEPSİBURADA KURALLARI (Türkçe):
- Başlık Formatı: [Marka] [Model] [Teknik Özellikler] [Emojiler]
- 1-2 emoji yeterli (⭐ 🌟 gibi)
- Açıklama: Teknik ve detaylı ama samimi
- Ürün özelliklerini madde madde
- Garanti ve satış sonrası hizmetleri vurgula
- Karşılaştırma yapmaya uygun format
- Minimum 500, ideal 700 karakter açıklama
- Resmi ama sıcak ton
            `
        };
        return rules[name] || 'Standard e-commerce SEO rules with emojis and detailed descriptions.';
    }
}
