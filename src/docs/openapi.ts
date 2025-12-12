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
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  tags: [
    { name: 'Health', description: 'Health check endpoints' },
    { name: 'Authentication', description: 'User authentication endpoints' },
    { name: 'Products', description: 'Product management endpoints' },
    { name: 'AI Generation', description: 'AI content generation endpoints' },
    { name: 'Credits', description: 'Credit system endpoints' },
    { name: 'Upload', description: 'File upload endpoints' },
    { name: 'Marketplaces', description: 'Marketplace management endpoints' },
    { name: 'Categories', description: 'Category management endpoints' },
    { name: 'Admin', description: 'Admin panel endpoints (requires admin role)' },
  ],
  paths: {
    '/': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Check if the API is running',
        responses: {
          '200': {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: '🚀 SellerAI API is running' },
                    version: { type: 'string', example: '2.0.0' },
                    documentation: { type: 'string', example: '/api-docs' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register new user',
        description: 'Create a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', minLength: 6, example: 'SecurePass123' },
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Doe' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully' },
          '400': { description: 'Validation error' },
          '409': { description: 'Email already registered' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        description: 'Authenticate user and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'demo@sellerai.com' },
                  password: { type: 'string', example: 'demo123' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful, JWT token returned' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current user profile',
        description: 'Get the authenticated user\'s profile information',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'User profile returned' },
          '401': { description: 'Not authenticated' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        description: 'Get a new access token using a valid refresh token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'New access token returned' },
          '401': { description: 'Invalid or expired refresh token' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout',
        description: 'Revoke the refresh token to logout',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Logged out successfully' },
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Request password reset',
        description: 'Send password reset link to email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Reset link sent if email exists' },
        },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Reset password',
        description: 'Reset password using the token from forgot-password email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'password'],
                properties: {
                  token: { type: 'string' },
                  password: { type: 'string', minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Password reset successfully' },
          '400': { description: 'Invalid or expired token' },
        },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List user products',
        description: 'Get paginated list of user\'s products',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, maximum: 50 } },
        ],
        responses: {
          '200': { description: 'Products list returned with pagination' },
          '401': { description: 'Not authenticated' },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create product',
        description: 'Create a new product',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rawUserPrompt'],
                properties: {
                  brandName: { type: 'string', example: 'Samsung' },
                  categoryId: { type: 'integer', example: 1 },
                  rawUserPrompt: { type: 'string', minLength: 10, example: 'Samsung Galaxy S24 Ultra, 12GB RAM, 256GB' },
                  marketplaceIds: { type: 'array', items: { type: 'integer' }, example: [1, 2, 3] },
                  imageUrl: { type: 'string', example: '/uploads/product-image.jpg' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Product created successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Not authenticated' },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get single product',
        description: 'Get a product by ID with all related data',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Product returned' },
          '401': { description: 'Not authenticated' },
          '404': { description: 'Product not found' },
        },
      },
      patch: {
        tags: ['Products'],
        summary: 'Update product',
        description: 'Update an existing product',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  brandName: { type: 'string' },
                  categoryId: { type: 'integer' },
                  rawUserPrompt: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Product updated successfully' },
          '401': { description: 'Not authenticated' },
          '404': { description: 'Product not found' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete product',
        description: 'Delete a product by ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Product deleted successfully' },
          '401': { description: 'Not authenticated' },
          '404': { description: 'Product not found' },
        },
      },
    },
    '/products/{id}/listings': {
      get: {
        tags: ['Products'],
        summary: 'Get product listings',
        description: 'Get AI-generated marketplace listings for a product',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Listings returned' },
          '401': { description: 'Not authenticated' },
          '404': { description: 'Product not found' },
        },
      },
    },
    '/ai/generate-content': {
      post: {
        tags: ['AI Generation'],
        summary: 'Generate marketplace content',
        description: 'Generate AI-optimized titles and descriptions for selected marketplaces. Deducts credits.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'marketplaceIds'],
                properties: {
                  productId: { type: 'integer', example: 1 },
                  marketplaceIds: { type: 'array', items: { type: 'integer' }, example: [1, 2, 3] },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Content generated successfully' },
          '401': { description: 'Not authenticated' },
          '402': { description: 'Insufficient credits' },
          '404': { description: 'Product not found' },
        },
      },
    },
    '/ai/preview': {
      post: {
        tags: ['AI Generation'],
        summary: 'Preview content',
        description: 'Preview AI-generated content without spending credits',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rawUserPrompt', 'marketplaceId'],
                properties: {
                  rawUserPrompt: { type: 'string', minLength: 10 },
                  brandName: { type: 'string' },
                  categoryId: { type: 'integer' },
                  marketplaceId: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Preview generated (no credits charged)' },
          '401': { description: 'Not authenticated' },
        },
      },
    },
    '/credits': {
      get: {
        tags: ['Credits'],
        summary: 'Get credit balance',
        description: 'Get the authenticated user\'s available credit balance',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Credit balance returned' },
          '401': { description: 'Not authenticated' },
        },
      },
    },
    '/credits/history': {
      get: {
        tags: ['Credits'],
        summary: 'Get credit history',
        description: 'Get credit transaction history',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          '200': { description: 'Transaction history returned' },
          '401': { description: 'Not authenticated' },
        },
      },
    },
    '/credits/purchase': {
      post: {
        tags: ['Credits'],
        summary: 'Purchase credits',
        description: 'Purchase additional credits (placeholder for payment integration)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount'],
                properties: {
                  amount: { type: 'integer', minimum: 1, maximum: 1000, example: 50 },
                  paymentMethod: { type: 'string', enum: ['credit_card', 'paypal', 'stripe'] },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Credits purchased successfully' },
          '401': { description: 'Not authenticated' },
        },
      },
    },
    '/upload/product-image': {
      post: {
        tags: ['Upload'],
        summary: 'Upload product image',
        description: 'Upload an image file',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Image uploaded successfully' },
          '400': { description: 'Invalid file or no file uploaded' },
          '401': { description: 'Not authenticated' },
        },
      },
    },
    '/upload/product-image/{productId}': {
      post: {
        tags: ['Upload'],
        summary: 'Upload and attach image to product',
        description: 'Upload an image and attach it to a specific product',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Image uploaded and attached to product' },
          '400': { description: 'Invalid file or product ID' },
          '401': { description: 'Not authenticated' },
        },
      },
    },
    '/marketplaces': {
      get: {
        tags: ['Marketplaces'],
        summary: 'List all marketplaces',
        description: 'Get all available marketplaces with their configurations',
        responses: {
          '200': { description: 'Marketplaces list returned' },
        },
      },
    },
    '/marketplaces/{id}': {
      get: {
        tags: ['Marketplaces'],
        summary: 'Get single marketplace',
        description: 'Get a marketplace by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Marketplace returned' },
          '404': { description: 'Marketplace not found' },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get category tree',
        description: 'Get all categories as a hierarchical tree',
        responses: {
          '200': { description: 'Category tree returned' },
        },
      },
    },
    '/categories/top': {
      get: {
        tags: ['Categories'],
        summary: 'Get top-level categories',
        description: 'Get only top-level categories (no parent)',
        responses: {
          '200': { description: 'Top-level categories returned' },
        },
      },
    },
    '/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get single category',
        description: 'Get a category by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Category returned' },
          '404': { description: 'Category not found' },
        },
      },
    },
    '/categories/{id}/children': {
      get: {
        tags: ['Categories'],
        summary: 'Get child categories',
        description: 'Get all child categories of a parent category',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Child categories returned' },
          '404': { description: 'Category not found' },
        },
      },
    },
    '/admin/dashboard': {
      get: {
        tags: ['Admin'],
        summary: 'Get admin dashboard',
        description: 'Get statistics and recent activity for admin dashboard',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Dashboard data returned' },
          '401': { description: 'Not authenticated' },
          '403': { description: 'Admin access required' },
        },
      },
    },
    '/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'List all users',
        description: 'Get paginated list of all users with credits and roles',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Users list returned' },
          '403': { description: 'Admin access required' },
        },
      },
    },
    '/admin/users/{userId}': {
      get: {
        tags: ['Admin'],
        summary: 'Get user details',
        description: 'Get detailed user information including products and transactions',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'User details returned' },
          '404': { description: 'User not found' },
        },
      },
    },
    '/admin/users/{userId}/credits': {
      post: {
        tags: ['Admin'],
        summary: 'Adjust user credits',
        description: 'Add or remove credits from a user account',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount', 'reason'],
                properties: {
                  amount: { type: 'integer', example: 50 },
                  reason: { type: 'string', example: 'Bonus credits for feedback' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Credits adjusted successfully' },
          '404': { description: 'User not found' },
        },
      },
    },
    '/admin/users/{userId}/roles': {
      post: {
        tags: ['Admin'],
        summary: 'Assign role to user',
        description: 'Assign a role to a user',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['roleId'],
                properties: {
                  roleId: { type: 'integer', example: 1 },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Role assigned' },
          '404': { description: 'User or role not found' },
        },
      },
    },
    '/admin/roles': {
      get: {
        tags: ['Admin'],
        summary: 'List all roles',
        description: 'Get all available roles',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Roles list returned' },
        },
      },
    },
    '/admin/marketplaces': {
      get: {
        tags: ['Admin'],
        summary: 'List marketplaces with configs',
        description: 'Get all marketplaces with their JSONB configurations',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Marketplaces with configs returned' },
        },
      },
    },
    '/admin/marketplaces/{id}/config': {
      patch: {
        tags: ['Admin'],
        summary: 'Update marketplace config',
        description: 'Update marketplace JSONB configuration (credit_cost, title limits, etc.)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  max_title_length: { type: 'integer', example: 150 },
                  description_max_length: { type: 'integer', example: 5000 },
                  credit_cost: { type: 'integer', example: 2 },
                  language: { type: 'string', enum: ['tr', 'en'] },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Config updated' },
          '404': { description: 'Marketplace not found' },
        },
      },
    },
    '/admin/plans': {
      get: {
        tags: ['Admin'],
        summary: 'List subscription plans',
        description: 'Get all subscription plans with pricing',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Plans list returned' },
        },
      },
    },
  },
};

export const openAPISpec = apiDocumentation;
export default apiDocumentation;
