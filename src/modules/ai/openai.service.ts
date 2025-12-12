import { db } from '../../core/database';
import { marketplaceConfigs } from '../../core/database/schema';
import { eq } from 'drizzle-orm';

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
   * Generate marketplace-specific title and description
   */
  async generateMarketplaceContent(params: GenerateContentParams): Promise<GeneratedContent> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

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

    const configData = config.config as any;
    const titleLimit = configData?.titleCharLimit || 100;
    const descLimit = configData?.descriptionCharLimit || 5000;
    const marketplace = config.marketplace.name;

    const systemPrompt = `You are an expert e-commerce content writer specializing in ${marketplace}. 
Your task is to create compelling, SEO-optimized product titles and descriptions that maximize conversion rates.

Rules:
- Title must be max ${titleLimit} characters
- Description must be max ${descLimit} characters
- Use Turkish language
- Be professional and persuasive
- Include key product features
- Optimize for ${marketplace}'s search algorithm`;

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
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = (data as any).choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content generated');
      }

      // Parse JSON response
      const generated = JSON.parse(content);

      return {
        title: generated.title.substring(0, titleLimit),
        description: generated.description.substring(0, descLimit),
        marketplace,
      };
    } catch (error) {
      console.error('OpenAI generation error:', error);
      
      // Fallback: return basic content
      return {
        title: `${params.brandName || ''} ${params.rawUserPrompt}`.substring(0, titleLimit),
        description: params.rawUserPrompt,
        marketplace,
      };
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
