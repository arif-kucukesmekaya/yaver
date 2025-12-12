export const apiDocumentation = {
  openapi: '3.0.0',
  info: {
    title: 'SellerAI API',
    version: '2.0.0',
    description: 'AI-powered e-commerce content generation API for multi-marketplace sellers',
  },
  servers: [
    {
      url: 'http://localhost:8881',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/': {
      get: {
        summary: 'Health check',
        responses: {
          '200': { description: 'API is running' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register new user',
        tags: ['Authentication'],
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Authentication'],
      },
    },
  },
};

export const openAPISpec = apiDocumentation;
export default apiDocumentation;
