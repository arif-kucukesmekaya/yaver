import { fal } from "@fal-ai/client";
import OpenAI from "openai";

// Initialize APIs
// Note: Keys should be in .env. We use 'mock' to prevent crash if missing during build.
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'] || 'mock-key',
});

// Removed GoogleGenerativeAI since we are using Pollinations for images now.
// If needed later for text, re-add it.

export type ImageType = 'lifestyle' | 'infographic' | 'detail';

export class AIService {

    /**
     * Generate SEO optimized listing for specific marketplace using GPT-4o
     */
    static async generateListing(product: any, marketplaceName: string) {
        const prompt = `
        You are an elite e-commerce copywriter specializing in ${marketplaceName}.
        
        Product Details:
        - Brand: ${product.brandName}
        - Description: ${product.rawUserPrompt}
        - Category: ${product.category?.name || 'General'}
        
        Requirements for ${marketplaceName}:
        ${this.getMarketplaceRules(marketplaceName)}
        
        Output directly in JSON format:
        {
            "title": "SEO Optimized Title",
            "description": "Formatted Description (HTML or Plain Text)",
            "keywords": ["keyword1", "keyword2"]
        }
        `;

        try {
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: "You are a helpful assistant that outputs JSON." }, { role: "user", content: prompt }],
                model: "gpt-4o",
                response_format: { type: "json_object" },
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
     * Generate product images using Fal.ai (Nano Banana Pro)
     */
    static async generateProductImage(product: any, type: ImageType) {
        // Construct the prompt based on image type
        const basePrompt = product.rawUserPrompt;
        let stylePrompt = "";

        switch (type) {
            case 'lifestyle':
                stylePrompt = "Cinematic lifestyle photography, showing the product in real-world use, atmospheric lighting, depth of field, high resolution, photorealistic.";
                break;
            case 'infographic':
                stylePrompt = "Professional studio product photography, pure white background, soft lighting, sharp focus, clean look, suitable for e-commerce main image.";
                break;
            case 'detail':
                stylePrompt = "Macro close-up shot, extreme detail showing material texture and craftsmanship, shallow depth of field, 8k resolution, professional lighting.";
                break;
        }

        const fullPrompt = `Subject: ${basePrompt}. Style: ${stylePrompt}. Ensure the product looks premium and high quality.`;

        try {
            const result: any = await fal.subscribe("fal-ai/nano-banana-pro", {
                input: {
                    prompt: fullPrompt,
                    num_images: 1,
                    aspect_ratio: "1:1",
                    output_format: "png",
                    resolution: "1K"
                },
                logs: true,
            });

            if (!result.data || !result.data.images || result.data.images.length === 0) {
                throw new Error("No image returned from Fal.ai");
            }

            return {
                url: result.data.images[0].url,
                prompt: fullPrompt,
                type: type
            };

        } catch (error) {
            console.error('Image Gen Error (Fal.ai):', error);
            throw new Error(`Failed to generate ${type} image via Nano Banana`);
        }
    }

    private static getMarketplaceRules(name: string): string {
        const rules: Record<string, string> = {
            'Amazon': 'Maximize keywords in title (up to 200 chars). Use bullet points in description. Tone: Professional and persuasive.',
            'Trendyol': 'Turkish language. Title format: Brand + Product Type + Features. Short and catchy. Max 100 chars.',
            'Hepsiburada': 'Turkish language. Detailed title with technical specs. Official and informative tone. Max 150 chars.'
        };
        return rules[name] || 'Standard e-commerce SEO rules.';
    }
}
