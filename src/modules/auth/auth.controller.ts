import { AuthService } from './auth.service';
import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  GoogleLoginInput
} from './auth.schema';

export class AuthController {
  /**
   * Register a new user
   */
  static async register(c: any) {
    const input = c.req.valid('json') as RegisterInput;
    const result = await AuthService.register(input);

    return c.json(
      {
        success: true,
        message: 'Registration successful',
        data: result,
        timestamp: new Date().toISOString(),
      },
      201
    );
  }

  /**
   * Login user
   */
  static async login(c: any) {
    const input = c.req.valid('json') as LoginInput;
    const result = await AuthService.login(input);

    return c.json({
      success: true,
      message: 'Login successful',
      data: result,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Login with Google OAuth
   */
  static async googleLogin(c: any) {
    const { credential } = c.req.valid('json') as GoogleLoginInput;
    const result = await AuthService.loginWithGoogle(credential);

    return c.json({
      success: true,
      message: 'Google login successful',
      data: result,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Refresh access token
   */
  static async refreshToken(c: any) {
    const { refreshToken } = c.req.valid('json') as RefreshTokenInput;
    const result = await AuthService.refreshAccessToken(refreshToken);

    return c.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Logout - revoke refresh token
   */
  static async logout(c: any) {
    const { refreshToken } = c.req.valid('json') as RefreshTokenInput;
    await AuthService.revokeRefreshToken(refreshToken);

    return c.json({
      success: true,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Request password reset
   */
  static async forgotPassword(c: any) {
    const { email } = c.req.valid('json') as ForgotPasswordInput;
    const result = await AuthService.forgotPassword(email);

    return c.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Reset password with token
   */
  static async resetPassword(c: any) {
    const { token, password } = c.req.valid('json') as ResetPasswordInput;
    const result = await AuthService.resetPassword(token, password);

    return c.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get current user profile
   */
  static async getProfile(c: any) {
    const user = c.get('user');
    const profile = await AuthService.getProfile(user.id);

    return c.json({
      success: true,
      data: profile,
      timestamp: new Date().toISOString(),
    });
  }
}
