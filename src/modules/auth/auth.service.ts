import { db } from '../../core/database';
import { users, userProfiles, userCredits, userRoles, roles } from '../../core/database/schema';
import { hashPassword, comparePassword } from '../../shared/utils/password';
import { generateToken } from '../../shared/utils/jwt';
import { ConflictError, AuthenticationError, NotFoundError } from '../../shared/utils/errors';
import { eq } from 'drizzle-orm';

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
      availableCredits: 10,
      totalEarned: 10,
      totalSpent: 0,
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

    // Generate token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName,
        lastName,
      },
      token,
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

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        credits: user.credits?.availableCredits || 0,
      },
      token,
    };
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
        available: userData.credits?.availableCredits || 0,
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
