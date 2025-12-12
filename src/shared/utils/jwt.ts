import jwt from "jsonwebtoken";
import crypto from "crypto";

export interface JWTPayload {
  userId: number;
  email: string;
  role?: string;
}

export interface RefreshTokenPayload {
  userId: number;
  tokenId: string;
}

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production-12345';
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '15m'; // Short-lived access token
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Long-lived refresh token

/**
 * Generate a short-lived access token (15 minutes)
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

/**
 * Verify access token
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

/**
 * Generate a long-lived refresh token (7 days)
 */
export const generateRefreshToken = (userId: number): { token: string; tokenId: string; expiresAt: Date } => {
  const tokenId = crypto.randomUUID();
  const token = jwt.sign(
    { userId, tokenId } as RefreshTokenPayload,
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions
  );

  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return { token, tokenId, expiresAt };
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

/**
 * Generate a random password reset token
 */
export const generateResetToken = (): { token: string; expiresAt: Date } => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry
  return { token, expiresAt };
};
