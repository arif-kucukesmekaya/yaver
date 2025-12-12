import { db } from '../../core/database';
import { marketplaceConfigs } from '../../core/database/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../../shared/utils/logger';

export interface GenerateContentParams {
  rawUserPrompt: string;
  brandName?: string;
  categoryName?: string;
  marketplaceId: number;
}

export interface GeneratedContent {
  title: string;
  description: string;
  marketplace: string;
  isAIGenerated: boolean; // Flag to indicate if this was AI-generated or fallback
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = process.env['OPENAI_API_KEY'] || '';
    if (!this.apiKey) {
      console.warn('⚠️ OPENAI_API_KEY not set. AI features will be disabled.');
    }
  }

  /**
   * Generate smart fallback content when OpenAI API fails
   * Creates marketplace-optimized content based on patterns
   */
  private generateSmartFallback(
    params: GenerateContentParams,
    marketplace: string,
    titleLimit: number,
    descLimit: number
  ): GeneratedContent {
    const { rawUserPrompt, brandName, categoryName } = params;

    // Parse key features from user prompt
    const features = rawUserPrompt.split(',').map(f => f.trim()).filter(Boolean);
    const mainProduct = features[0] || rawUserPrompt;

    // Build title based on marketplace style
    let title: string;
    let description: string;

    if (marketplace.toLowerCase() === 'amazon') {
      // Amazon style: Brand + Product + Key Features (English, keyword-rich)
      title = [
        brandName,
        mainProduct,
        ...features.slice(1, 4),
      ].filter(Boolean).join(' - ');

      description = `**Product Features:**\n\n${features.map(f => `• ${f}`).join('\n')}\n\n**About this item:**\nHigh quality ${categoryName || 'product'} from ${brandName || 'trusted manufacturer'}. Perfect for daily use with premium materials and excellent durability.`;
    } else if (marketplace.toLowerCase() === 'hepsiburada') {
      // Hepsiburada style: Detailed, category-based (Turkish)
      title = [
        brandName,
        mainProduct,
        categoryName,
        'Orijinal Ürün',
      ].filter(Boolean).join(' ');

      description = `${brandName || ''} ${mainProduct}\n\n📦 Ürün Özellikleri:\n${features.map(f => `✓ ${f}`).join('\n')}\n\n💯 Orijinal ürün garantisi\n🚚 Hızlı kargo\n📞 Müşteri desteği`;
    } else {
      // Trendyol style: Short, punchy, brand-first (Turkish)
      title = [
        brandName,
        mainProduct,
        features[1],
      ].filter(Boolean).join(' ').substring(0, titleLimit);

      description = `${mainProduct}\n\nÖzellikler:\n${features.map(f => `• ${f}`).join('\n')}\n\n✨ Kaliteli ürün\n✨ Hızlı teslimat`;
    }

    return {
      title: title.substring(0, titleLimit),
      description: description.substring(0, descLimit),
      marketplace,
      isAIGenerated: false,
    };
  }

  /**
   * Generate marketplace-specific title and description
   */
  async generateMarketplaceContent(params: GenerateContentParams): Promise<GeneratedContent> {
    // Get marketplace config
    const config = await db.query.marketplaceConfigs.findFirst({
      where: eq(marketplaceConfigs.marketplaceId, params.marketplaceId),
      with: {
        marketplace: true,
      },
    });

    if (!config) {
      throw new Error('Marketplace configuration not found');
    }

    const configData = config.config as {
      max_title_length?: number;
      description_max_length?: number;
      language?: string;
    } | null;
    const titleLimit = configData?.max_title_length || 100;
    const descLimit = configData?.description_max_length || 5000;
    const language = configData?.language || 'tr';
    const marketplace = config.marketplace.name;

    // If no API key, use smart fallback
    if (!this.apiKey) {
      logger.warn('OpenAI API key not configured, using smart fallback', { marketplace });
      return this.generateSmartFallback(params, marketplace, titleLimit, descLimit);
    }

    const languageInstruction = language === 'en'
      ? 'Use English language'
      : 'Use Turkish language';

    const systemPrompt = `You are an expert e-commerce content writer specializing in ${marketplace}. 
Your task is to create compelling, SEO-optimized product titles and descriptions that maximize conversion rates.

Rules:
- Title must be max ${titleLimit} characters
- Description must be max ${descLimit} characters
- ${languageInstruction}
- Be professional and persuasive
- Include key product features
- Optimize for ${marketplace}'s search algorithm

IMPORTANT: Return ONLY valid JSON, no markdown or extra text.`;

    const userPrompt = `Create a product title and description for ${marketplace}:

Product Info: ${params.rawUserPrompt}
${params.brandName ? `Brand: ${params.brandName}` : ''}
${params.categoryName ? `Category: ${params.categoryName}` : ''}

Return JSON format:
{
  "title": "optimized title",
  "description": "detailed description with bullet points"
}`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('OpenAI API error', {
          status: response.status,
          error: errorText,
          marketplace
        });
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = (data as any).choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content generated');
      }

      // Parse JSON response (handle potential markdown wrapper)
      let jsonContent = content;
      if (content.includes('```json')) {
        jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }

      const generated = JSON.parse(jsonContent.trim());

      logger.info('AI content generated successfully', { marketplace, titleLength: generated.title.length });

      return {
        title: generated.title.substring(0, titleLimit),
        description: generated.description.substring(0, descLimit),
        marketplace,
        isAIGenerated: true,
      };
    } catch (error) {
      logger.error('OpenAI generation failed, using smart fallback', {
        error: error instanceof Error ? error.message : 'Unknown error',
        marketplace
      });

      // Use smart fallback instead of raw user prompt
      return this.generateSmartFallback(params, marketplace, titleLimit, descLimit);
    }
  }

  /**
   * Generate content for multiple marketplaces
   */
  async generateForAllMarketplaces(
    rawUserPrompt: string,
    brandName: string | undefined,
    categoryName: string | undefined,
    marketplaceIds: number[]
  ): Promise<GeneratedContent[]> {
    const results = await Promise.all(
      marketplaceIds.map((marketplaceId) =>
        this.generateMarketplaceContent({
          rawUserPrompt,
          brandName,
          categoryName,
          marketplaceId,
        })
      )
    );

    return results;
  }
}

export const openAIService = new OpenAIService();
