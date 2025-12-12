export const successResponse = <T>(data: T, message = "Success") => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const errorResponse = (
  message: string,
  statusCode = 500,
  errors?: any
) => ({
  success: false,
  message,
  statusCode,
  errors,
  timestamp: new Date().toISOString(),
});

export const paginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
  },
  timestamp: new Date().toISOString(),
});
