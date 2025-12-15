// User types
export interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    // Backend returns an object now, but keeping union for compatibility if needed. 
    // Ideally should be UserCredits object.
    credits?: UserCredits | number;
    subscription?: {
        plan?: string;
        isActive?: boolean;
        endDate?: string;
    };
}

export interface UserCredits {
    available: number;
    subscription: number;
    extra: number;
    totalEarned: number;
    totalSpent: number;
}

export interface UserProfile {
    userId: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    companyName?: string;
}

// Product types
export type ProductStatus = 'draft' | 'processing' | 'completed' | 'failed';
export type ListingStatus = 'draft' | 'published' | 'error';

export interface Product {
    id: number;
    userId: number;
    categoryId?: number;
    brandName?: string;
    rawUserPrompt?: string;
    productStatus: ProductStatus;
    createdAt: string;
    updatedAt: string;
    category?: Category;
    sourceImages?: ProductSourceImage[];
    enhancedImages?: AIEnhancedImage[];
    listings?: MarketplaceListing[];
    marketplaceSelections?: ProductMarketplaceSelection[];
}

export interface ProductSourceImage {
    id: number;
    productId: number;
    imageUrl: string;
    createdAt: string;
}

export interface AIEnhancedImage {
    id: number;
    productId: number;
    imageUrl: string;
    imageType: 'lifestyle' | 'infographic' | 'detail';
    prompt?: string;
    status?: string;
    metadata?: Record<string, any>;
    createdAt: string;
}

// Category types
export interface Category {
    id: number;
    parentId?: number;
    name: string;
}

// Marketplace types
export interface Marketplace {
    id: number;
    name: string;
    apiBaseUrl?: string;
    logoUrl?: string;
    configs?: MarketplaceConfig[];
}

export interface MarketplaceConfig {
    id: number;
    marketplaceId: number;
    config: {
        max_title_length?: number;
        description_max_length?: number;
        language?: string;
        banned_words?: string[];
        credit_cost?: number;
    };
}

export interface MarketplaceListing {
    id: number;
    productId: number;
    marketplaceId: number;
    generatedTitle?: string;
    generatedDescription?: string;
    listingStatus: ListingStatus;
    createdAt: string;
    updatedAt: string;
    marketplace?: Marketplace;
}

export interface ProductMarketplaceSelection {
    productId: number;
    marketplaceId: number;
    isSelected: boolean;
    marketplace?: Marketplace;
}

// Credit types
export type TransactionType = 'purchase' | 'monthly_refill' | 'usage' | 'bonus';

export interface CreditBalance extends UserCredits { }

export interface CreditTransaction {
    id: number;
    userId: number;
    amount: number;
    transactionType: TransactionType;
    description?: string;
    relatedProductId?: number;
    createdAt: string;
}

// Subscription types
export interface SubscriptionPlan {
    id: number;
    name: string;
    price: number;
    monthlyCreditLimit: number;
}

export interface UserSubscription {
    id: number;
    userId: number;
    planId: number;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    plan?: SubscriptionPlan;
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    error?: string;
    data?: T;
    timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Auth types
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

// AI Generation types
export interface GenerateContentInput {
    productId: number;
    marketplaceIds: number[];
}

export interface GeneratedContent {
    title: string;
    description: string;
    marketplaceId: number;
    marketplaceName?: string;
}

// Dashboard stats
export interface DashboardStats {
    totalProducts: number;
    activeListings: number;
    creditsAvailable: number;
    creditsUsedThisMonth: number;
    productsThisMonth: number;
}
