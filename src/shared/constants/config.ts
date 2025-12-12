export const APP_CONFIG = {
  name: 'SellerAI',
  version: '2.0.0',
  environment: process.env['NODE_ENV'] || 'development',
  port: parseInt(process.env['PORT'] || '8881'),
  apiPrefix: '/api',
} as const;

export const JWT_CONFIG = {
  secret: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production-12345',
  expiresIn: process.env['JWT_EXPIRES_IN'] || '7d',
} as const;

export const DATABASE_CONFIG = {
  url: process.env['DATABASE_URL']!,
} as const;

export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  uploadDir: 'uploads',
} as const;

export const CREDIT_CONFIG = {
  initialCredits: 10,
  freeMonthlyLimit: 10,
} as const;

export const AI_CONFIG = {
  openai: {
    apiKey: process.env['OPENAI_API_KEY'],
    model: process.env['OPENAI_MODEL'] || 'gpt-4',
    baseUrl: process.env['OPENAI_BASE_URL'] || 'https://api.openai.com/v1',
  },
} as const;
