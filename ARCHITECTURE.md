# SellerAI - Modular Architecture

## 📁 Project Structure

```
src/
├── core/                      # Core functionalities
│   ├── database/             # Database configuration & schema
│   │   ├── index.ts          # Database exports
│   │   ├── original.ts       # Drizzle connection
│   │   ├── schema.ts         # Database schema
│   │   └── migrate.ts        # Migration runner
│   └── middleware/           # Global middleware
│       ├── auth.ts           # JWT authentication
│       ├── error.ts          # Error handler
│       ├── upload.ts         # File upload (Multer)
│       └── index.ts          # Middleware exports
│
├── modules/                   # Feature modules
│   ├── auth/                 # Authentication module
│   │   ├── auth.service.ts   # Business logic
│   │   ├── auth.controller.ts # Request handlers
│   │   ├── auth.routes.ts    # Route definitions
│   │   ├── auth.schema.ts    # Zod validation schemas
│   │   └── index.ts          # Module exports
│   ├── products/             # Product management
│   │   ├── products.routes.ts
│   │   └── index.ts
│   ├── ai/                   # AI content generation
│   │   ├── ai.routes.ts
│   │   ├── openai.service.ts
│   │   └── index.ts
│   ├── credits/              # Credit system
│   │   ├── credits.routes.ts
│   │   ├── credit.service.ts
│   │   └── index.ts
│   ├── upload/               # File uploads
│   │   ├── upload.routes.ts
│   │   └── index.ts
│   ├── marketplace/          # Marketplace management
│   │   ├── marketplace.routes.ts
│   │   └── index.ts
│   ├── categories/           # Category management
│   │   ├── categories.routes.ts
│   │   └── index.ts
│   └── index.ts              # All module exports
│
├── shared/                    # Shared utilities
│   ├── constants/            # Configuration constants
│   │   ├── config.ts         # App-wide configs
│   │   └── index.ts
│   ├── types/                # TypeScript types
│   │   ├── common.ts         # Common interfaces
│   │   └── index.ts
│   └── utils/                # Utility functions
│       ├── errors.ts         # Custom error classes
│       ├── jwt.ts            # JWT utilities
│       ├── password.ts       # Password hashing
│       ├── response.ts       # Response helpers
│       └── index.ts
│
├── docs/                      # API documentation
│   └── openapi.ts            # OpenAPI 3.0 spec
│
├── app.ts                     # Main application
└── index.ts                   # Entry point
```

## 🏗️ Architecture Principles

### 1. **Modular by Feature**
Each feature (auth, products, ai, etc.) is self-contained in its own module with:
- Routes
- Controllers (request handlers)
- Services (business logic)
- Schemas (validation)
- Types (if needed)

### 2. **Separation of Concerns**
- **core/**: Framework-level concerns (database, middleware)
- **modules/**: Business logic organized by feature
- **shared/**: Reusable code across modules

### 3. **Clean Dependencies**
```
modules → core → shared
```
- Modules can import from `core` and `shared`
- Modules can import from other modules (cross-module)
- `core` and `shared` are independent

### 4. **Consistent Structure**
Each module follows the pattern:
```
module/
  ├── module.routes.ts      # Hono routes
  ├── module.controller.ts  # Request handlers
  ├── module.service.ts     # Business logic
  ├── module.schema.ts      # Zod schemas
  └── index.ts              # Exports
```

## 🚀 Benefits

1. **Scalability**: Easy to add new features as modules
2. **Maintainability**: Clear file organization
3. **Testability**: Isolated modules are easier to test
4. **Reusability**: Shared utilities prevent duplication
5. **Team Collaboration**: Developers can work on different modules independently

## 📦 Module Examples

### Auth Module
```typescript
// auth.service.ts - Business logic
export class AuthService {
  static async register(input: RegisterInput) { ... }
  static async login(input: LoginInput) { ... }
}

// auth.controller.ts - Request handling
export class AuthController {
  static async register(c: Context) {
    const input = c.req.valid('json');
    const result = await AuthService.register(input);
    return c.json({ success: true, data: result });
  }
}

// auth.routes.ts - Route definitions
const authRoutes = new Hono();
authRoutes.post('/register', zValidator('json', registerSchema), AuthController.register);
```

## 🔄 Migration from Old Structure

**Before:**
```
src/
├── routes/
│   ├── auth.ts
│   ├── products.ts
├── services/
│   ├── credit.service.ts
├── middleware/
└── utils/
```

**After:**
```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.routes.ts
│   ├── products/
├── core/
│   ├── database/
│   ├── middleware/
└── shared/
    ├── utils/
    ├── types/
    ├── constants/
```

## 📝 Adding a New Module

1. Create module directory: `src/modules/feature/`
2. Add files:
   - `feature.routes.ts`
   - `feature.service.ts` (optional)
   - `feature.controller.ts` (optional)
   - `feature.schema.ts` (optional)
   - `index.ts` (exports)
3. Register in `src/modules/index.ts`
4. Mount routes in `src/app.ts`

## ✅ Tests Passed

- ✅ Authentication (register, login, /me)
- ✅ Products (CRUD operations)
- ✅ Credits (balance, transactions)
- ✅ AI (content generation)
- ✅ Upload (file handling)
- ✅ Marketplaces & Categories
- ✅ API Documentation (Swagger)

## 🎯 Next Steps

1. Add unit tests for each module (CI/CD pipeline established)
2. Create integration tests
3. Add more comprehensive OpenAPI documentation
4. Implement rate limiting
5. Add caching layer
6. Monitor Next.js 16 & React 19 stability
