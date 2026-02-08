// import OpenAI from "openai";
import OpenAI from "openai";
import * as fs from 'fs';
import * as path from 'path';

// Initialize APIs
// Note: Keys should be in .env. We use 'mock' to prevent crash if missing during build.

// 🔑 Configure Bytedance/Ark AI Client
const aiClient = new OpenAI({
    apiKey: process.env['SEEDANCE_API_KEY'] || 'mock-key',
    baseURL: process.env['SEEDANCE_BASE_URL'] || 'https://api.openai.com/v1',
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
            const completion = await aiClient.chat.completions.create({
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
                model: process.env['SEEDANCE_TEXT_MODEL'] || "glm-4-7-251222",
                // GLM-4.7 API Example strict compliance: 
                // - No response_format: { type: "json_object" }
                // - Temperature is supported
                temperature: 0.7,
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
     * 🖼️ ENHANCED: Generate product images using Bytedance/Ark
     * - If source image exists → Image-to-Image (preserves product)
     * - If no source image → Text-to-Image (generates from scratch)
     */
    static async generateProductImage(product: any, type: ImageType, sourceImageUrl?: string) {
        // Get source image from product or parameter
        let imageUrl = sourceImageUrl || product.sourceImages?.[0]?.imageUrl;

        // 🔥 Local Dev Fix: Convert local URL to Base64 for API
        if (imageUrl && (imageUrl.startsWith('/') || imageUrl.startsWith('http://localhost'))) {
            try {
                // assume starts with /uploads...
                const relativePath = imageUrl.startsWith('http')
                    ? new URL(imageUrl).pathname
                    : imageUrl;

                const filePath = path.join(process.cwd(), relativePath);

                if (fs.existsSync(filePath)) {
                    const fileBuffer = fs.readFileSync(filePath);
                    const base64Image = fileBuffer.toString('base64');
                    // Detect mime type from extension
                    const ext = path.extname(filePath).toLowerCase().replace('.', '');
                    const mimeType = ext === 'jpg' ? 'jpeg' : ext; // jpg -> jpeg

                    imageUrl = `data:image/${mimeType};base64,${base64Image}`;
                    console.log('✅ Converted local image to Base64 for API');
                } else {
                    console.warn(`⚠️ Local image file not found: ${filePath}`);
                }
            } catch (err) {
                console.error('Failed to convert local image to base64:', err);
            }
        }

        // Determine if we should use image-to-image or text-to-image
        const useImageToImage = !!imageUrl;

        // Construct style-specific prompts
        let stylePrompt = "";

        if (useImageToImage) {
            // Image-to-Image: Preserve product appearance
            switch (type) {
                case 'lifestyle':
                    stylePrompt = "High-end product photography. Place the product in a luxurious, modern lifestyle setting. Soft, natural lighting. 8k resolution. maintain the product's original shape, color, and texture exactly. Do not alter the product. The environment should be blurred background with depth of field.";
                    break;
                case 'infographic':
                    stylePrompt = "Professional commercial product photography. Pure white background (RGB 255,255,255). Soft studio lighting. Eliminate harsh shadows. The product must remain exactly as is. High fidelity, sharp focus, 8k UHD.";
                    break;
                case 'detail':
                    stylePrompt = "Macro photography. Zoom in on the finest details of the product. Show texture and material quality. Professional lighting to highlight craftsmanship. Keep the product design unchanged. Ultra-realistic, 8k.";
                    break;
            }
        } else {
            // Text-to-Image: Generate from description
            const basePrompt = product.rawUserPrompt || product.brandName;
            switch (type) {
                case 'lifestyle':
                    stylePrompt = `${basePrompt}. Award-winning commercial photography. Cinematic lighting, photorealistic, 8k. showcasing the product in a premium environment.`;
                    break;
                case 'infographic':
                    stylePrompt = `${basePrompt}. Studio product shot, isolated on white background. Professional lighting, 4k, advertising standard.`;
                    break;
                case 'detail':
                    stylePrompt = `${basePrompt}. Extreme close-up macro shot. Highlighting material texture. Depth of field, bokeh, 8k resolution.`;
                    break;
            }
        }

        const fullPrompt = useImageToImage
            ? `(Masterpiece, top quality, best quality, official art, beautiful and aesthetic:1.2). ${stylePrompt}. The input image is the reference product. YOU MUST PRESERVE THE PRODUCT IDENTITY. Do not change the shape, logo, or key features of the product in the input image. Just change the background and lighting.`
            : stylePrompt;

        try {
            const apiKey = process.env['SEEDANCE_API_KEY'];
            const baseUrl = process.env['SEEDANCE_BASE_URL'];

            if (!apiKey || !baseUrl) {
                throw new Error("AI Credentials missing");
            }

            console.log(`🎨 Generating ${type} image via Bytedance...`);

            // Note: Using Bytedance/Ark standard image generation endpoint
            // Attempting standard /images/generations with the text model or a specific image model.

            const response = await fetch(`${baseUrl}/images/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: process.env['SEEDANCE_IMAGE_MODEL'] || 'seedream-4-5-251128',
                    prompt: fullPrompt,
                    // n: 1, 
                    size: "2048x2048",
                    image_urls: useImageToImage ? [imageUrl] : undefined, // 🔥 Correct format: Array of strings
                    response_format: "url",
                    sequential_image_generation: "disabled",
                    stream: false,
                    watermark: false
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Image API Error: ${response.status} - ${errText}`);
            }

            const data = (await response.json()) as { data: { url: string }[] };

            if (!data.data || !data.data[0] || !data.data[0].url) {
                throw new Error("Invalid image response from API");
            }

            return {
                url: data.data[0].url,
                prompt: fullPrompt,
                type: type,
                sourceUrl: imageUrl,
                mode: useImageToImage ? 'image-to-image' : 'text-to-image',
                endpoint: 'bytedance-api'
            };

        } catch (error) {
            console.error('Image Gen Error:', error);
            throw new Error(`Failed to generate ${type} image from API`);
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
