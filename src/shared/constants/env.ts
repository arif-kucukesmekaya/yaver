// Environment Configuration
export const ENV = {
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  PORT: parseInt(process.env['PORT'] || '8881', 10),
  
  // Database
  DATABASE_URL: process.env['DATABASE_URL']!,
  
  // JWT
  JWT_SECRET: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production-12345',
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || '7d',
  
  // OpenAI
  OPENAI_API_KEY: process.env['OPENAI_API_KEY'],
  OPENAI_MODEL: process.env['OPENAI_MODEL'] || 'gpt-4',
  OPENAI_BASE_URL: process.env['OPENAI_BASE_URL'] || 'https://api.openai.com/v1',
  
  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  UPLOAD_DIR: 'uploads',
  
  // Credits
  INITIAL_CREDITS: 10,
  FREE_MONTHLY_LIMIT: 10,
  
  // Validation
  isProduction: () => process.env.NODE_ENV === 'production',
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isTest: () => process.env.NODE_ENV === 'test',
} as const;

// Validate required env vars
const requiredEnvVars = ['DATABASE_URL'] as const;

export function validateEnv(): void {
  const missing = requiredEnvVars.filter(
    (key) => !process.env[key as string]
  );
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
