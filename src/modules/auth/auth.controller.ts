import { AuthService } from './auth.service';
import type { RegisterInput, LoginInput } from './auth.schema';

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
