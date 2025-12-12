export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | object;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: PaginationMeta;
}

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role?: string;
}
