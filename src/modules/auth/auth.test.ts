import { describe, test, expect, beforeAll, afterAll } from 'bun:test';

// Test configuration
const BASE_URL = 'http://localhost:8881';
let testUserEmail: string;
let testUserPassword: string;
let accessToken: string;
let refreshToken: string;

// Generate unique test user for each run
beforeAll(() => {
    testUserEmail = `test_${Date.now()}@example.com`;
    testUserPassword = 'TestPassword123!';
});

describe('Authentication Flow', () => {
    test('POST /auth/register - should register a new user', async () => {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUserEmail,
                password: testUserPassword,
                firstName: 'Test',
                lastName: 'User',
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.success).toBe(true);
        expect(data.data.accessToken).toBeDefined();
        expect(data.data.refreshToken).toBeDefined();
        expect(data.data.user.email).toBe(testUserEmail);

        // Save tokens for subsequent tests
        accessToken = data.data.accessToken;
        refreshToken = data.data.refreshToken;
    });

    test('POST /auth/register - should reject duplicate email', async () => {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUserEmail,
                password: testUserPassword,
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(409);
        expect(data.success).toBe(false);
    });

    test('POST /auth/login - should login with valid credentials', async () => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUserEmail,
                password: testUserPassword,
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.accessToken).toBeDefined();
        expect(data.data.refreshToken).toBeDefined();

        // Update tokens
        accessToken = data.data.accessToken;
        refreshToken = data.data.refreshToken;
    });

    test('POST /auth/login - should reject invalid credentials', async () => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUserEmail,
                password: 'wrongpassword',
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.success).toBe(false);
    });

    test('GET /auth/me - should return user profile with valid token', async () => {
        const response = await fetch(`${BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.email).toBe(testUserEmail);
        expect(data.data.credits).toBeDefined();
    });

    test('GET /auth/me - should reject without token', async () => {
        const response = await fetch(`${BASE_URL}/auth/me`);

        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.success).toBe(false);
    });

    test('POST /auth/refresh - should refresh access token', async () => {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.accessToken).toBeDefined();

        // Update access token
        accessToken = data.data.accessToken;
    });
});

describe('Password Reset Flow', () => {
    test('POST /auth/forgot-password - should accept valid email', async () => {
        const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUserEmail }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toContain('reset link');
        // In demo mode, token is returned
        expect(data._demoToken).toBeDefined();
    });

    test('POST /auth/reset-password - should reset password with valid token', async () => {
        // First get the reset token
        const forgotResponse = await fetch(`${BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUserEmail }),
        });
        const forgotData = await forgotResponse.json();
        const resetToken = forgotData._demoToken;

        // Reset password
        const newPassword = 'NewPassword123!';
        const response = await fetch(`${BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: resetToken,
                password: newPassword,
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe('Password reset successfully');

        // Verify new password works
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUserEmail,
                password: newPassword,
            }),
        });

        expect(loginResponse.status).toBe(200);
    });
});

describe('Credits System', () => {
    test('GET /credits - should return user credits', async () => {
        // Login first to get fresh token
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUserEmail,
                password: 'NewPassword123!',
            }),
        });
        const loginData = await loginResponse.json();
        accessToken = loginData.data.accessToken;

        const response = await fetch(`${BASE_URL}/credits`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.availableCredits).toBeDefined();
        expect(typeof data.data.availableCredits).toBe('number');
    });

    test('GET /credits/history - should return credit history', async () => {
        const response = await fetch(`${BASE_URL}/credits/history`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(Array.isArray(data.data)).toBe(true);
    });
});

describe('Health Check', () => {
    test('GET / - should return API status', async () => {
        const response = await fetch(`${BASE_URL}/`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toContain('SellerAI');
        expect(data.version).toBe('2.0.0');
    });

    test('GET /nonexistent - should return 404', async () => {
        const response = await fetch(`${BASE_URL}/nonexistent`);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
    });
});
