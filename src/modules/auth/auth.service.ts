import { db } from '../../core/database';
import { users, userProfiles, userCredits, creditTransactions, userRoles, roles, passwordResetTokens, refreshTokens } from '../../core/database/schema';
import { hashPassword, comparePassword } from '../../shared/utils/password';
import { generateToken, generateRefreshToken, verifyRefreshToken, generateResetToken } from '../../shared/utils/jwt';
import { ConflictError, AuthenticationError, NotFoundError, ValidationError } from '../../shared/utils/errors';
import { eq, and, gt } from 'drizzle-orm';

export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(input: RegisterInput) {
    const { email, password, firstName, lastName } = input;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
      })
      .returning();

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    // Create user profile
    if (firstName || lastName) {
      await db.insert(userProfiles).values({
        userId: newUser.id,
        firstName: firstName || null,
        lastName: lastName || null,
      });
    }

    // Initialize user credits (Free plan: 10 credits)
    await db.insert(userCredits).values({
      userId: newUser.id,
      subscriptionCredits: 10,
      extraCredits: 0,
      totalEarned: 10,
      totalSpent: 0,
    });

    // ✅ FIX: Log initial credit transaction
    await db.insert(creditTransactions).values({
      userId: newUser.id,
      amount: 10,
      transactionType: 'monthly_refill',
      description: 'Welcome bonus - Initial credits',
    });

    // Assign default role (Satıcı)
    const sellerRole = await db.query.roles.findFirst({
      where: eq(roles.roleName, 'Satıcı'),
    });

    if (sellerRole) {
      await db.insert(userRoles).values({
        userId: newUser.id,
        roleId: sellerRole.id,
      });
    }

    // Generate access token
    const accessToken = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    // Generate refresh token
    const { token: refreshToken, expiresAt } = generateRefreshToken(newUser.id);
    await db.insert(refreshTokens).values({
      userId: newUser.id,
      token: refreshToken,
      expiresAt,
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName,
        lastName,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  static async login(input: LoginInput) {
    const { email, password } = input;

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        profile: true,
        credits: true,
      },
    });

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate access token
    const accessToken = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Generate refresh token
    const { token: refreshToken, expiresAt } = generateRefreshToken(user.id);
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        credits: (user.credits?.subscriptionCredits || 0) + (user.credits?.extraCredits || 0),
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login or register with Google OAuth
   * Uses email and name from frontend (useGoogleLogin flow)
   */
  static async loginWithGoogle(input: { email: string; firstName?: string; lastName?: string }) {
    const { email, firstName, lastName } = input;

    // Check if user exists
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        profile: true,
        credits: true,
      },
    });

    // If user doesn't exist, create one (auto-registration)
    if (!user) {
      // Generate a random password hash (user won't use it since they're using Google)
      const randomPassword = crypto.randomUUID();
      const passwordHash = await hashPassword(randomPassword);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          passwordHash,
        })
        .returning();

      if (!newUser) {
        throw new Error('Failed to create user');
      }

      // Create user profile
      await db.insert(userProfiles).values({
        userId: newUser.id,
        firstName: firstName || null,
        lastName: lastName || null,
      });

      // Initialize user credits (Free plan: 10 credits)
      await db.insert(userCredits).values({
        userId: newUser.id,
        subscriptionCredits: 10,
        extraCredits: 0,
        totalEarned: 10,
        totalSpent: 0,
      });

      // ✅ FIX: Log initial credit transaction
      await db.insert(creditTransactions).values({
        userId: newUser.id,
        amount: 10,
        transactionType: 'monthly_refill',
        description: 'Welcome bonus - Initial credits (Google)',
      });

      // Assign default role (Satıcı)
      const sellerRole = await db.query.roles.findFirst({
        where: eq(roles.roleName, 'Satıcı'),
      });

      if (sellerRole) {
        await db.insert(userRoles).values({
          userId: newUser.id,
          roleId: sellerRole.id,
        });
      }

      // Fetch the complete user with relations
      user = await db.query.users.findFirst({
        where: eq(users.id, newUser.id),
        with: {
          profile: true,
          credits: true,
        },
      });
    }

    if (!user) {
      throw new Error('Failed to get user');
    }

    // Generate access token
    const accessToken = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Generate refresh token
    const { token: refreshToken, expiresAt } = generateRefreshToken(user.id);
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        credits: (user.credits?.subscriptionCredits || 0) + (user.credits?.extraCredits || 0),
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string) {
    // Verify the refresh token JWT
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Check if token exists in database and is not revoked
    const storedToken = await db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.token, refreshToken),
        eq(refreshTokens.revoked, false),
        gt(refreshTokens.expiresAt, new Date())
      ),
    });

    if (!storedToken) {
      throw new AuthenticationError('Refresh token not found or expired');
    }

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.userId),
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Generate new access token
    const accessToken = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      accessToken,
    };
  }

  /**
   * Revoke refresh token (logout)
   */
  static async revokeRefreshToken(refreshToken: string) {
    await db
      .update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.token, refreshToken));
  }

  /**
   * Request password reset - generates token
   */
  static async forgotPassword(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Don't reveal if email exists for security
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const { token, expiresAt } = generateResetToken();

    // Store token in database
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token,
      expiresAt,
    });

    // In a real app, send email here
    // For demo, return the token (in production, never expose this!)
    return {
      message: 'If the email exists, a reset link has been sent',
      // DEMO ONLY - remove in production
      _demoToken: token,
    };
  }

  /**
   * Reset password using token
   */
  static async resetPassword(token: string, newPassword: string) {
    // Find valid token
    const resetToken = await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, false),
        gt(passwordResetTokens.expiresAt, new Date())
      ),
    });

    if (!resetToken) {
      throw new ValidationError('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, resetToken.userId));

    // Mark token as used
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, resetToken.id));

    // Revoke all refresh tokens for this user (force re-login)
    await db
      .update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.userId, resetToken.userId));

    return { message: 'Password reset successfully' };
  }

  /**
   * Get user profile
   */
  static async getProfile(userId: number) {
    const userData = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        profile: true,
        credits: true,
        subscriptions: {
          with: {
            plan: true,
          },
          where: (subscriptions, { eq }) => eq(subscriptions.isActive, true),
        },
      },
    });

    if (!userData) {
      throw new NotFoundError('User not found');
    }

    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.profile?.firstName,
      lastName: userData.profile?.lastName,
      phoneNumber: userData.profile?.phoneNumber,
      companyName: userData.profile?.companyName,
      credits: {
        available: (userData.credits?.subscriptionCredits || 0) + (userData.credits?.extraCredits || 0),
        subscription: userData.credits?.subscriptionCredits || 0,
        extra: userData.credits?.extraCredits || 0,
        totalEarned: userData.credits?.totalEarned || 0,
        totalSpent: userData.credits?.totalSpent || 0,
      },
      subscription: userData.subscriptions[0]
        ? {
          plan: userData.subscriptions[0].plan?.name,
          isActive: userData.subscriptions[0].isActive,
          endDate: userData.subscriptions[0].endDate,
        }
        : null,
    };
  }
}
