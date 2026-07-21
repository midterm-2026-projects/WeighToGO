import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../../src/config/db.js', () => ({ default: { query: vi.fn() } }));
vi.mock('../../src/service/loginService.js', () => ({
  loginService: vi.fn()
}));
vi.mock('../../src/service/authService.js', () => ({
  login: vi.fn(),
  clearSession: vi.fn(),
  getSession: vi.fn(),
  verifyRouteSecurity: vi.fn()
}));

import { loginService } from '../../src/service/loginService.js';
import { login, clearSession, getSession } from '../../src/service/authService.js';

const authMiddleware = await vi.importActual('../../src/middleware/auth.js');
vi.mock('../../src/middleware/auth.js', () => ({
  authenticate: vi.fn((req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token === 'valid-token') {
      req.user = { id: 1, role: 'Administrator (Admin)', email: 'user@health.gov.ph' };
      req.token = token;
      return next();
    }
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }),
  requireRole: authMiddleware.requireRole
}));

const app = (await import('../../app.js')).default;

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid admin credentials', async () => {
      const mockUser = { id: 1, email: 'user@health.gov.ph', role: 'Administrator (Admin)' };
      loginService.mockResolvedValue(mockUser);
      login.mockResolvedValue({
        success: true,
        token: 'mock-jwt-token',
        role: 'Administrator (Admin)',
        redirectTo: '/masterlist'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ role: 'Administrator (Admin)', email: 'user@health.gov.ph', password: 'Balayan2026!' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBe('mock-jwt-token');
      expect(res.body.role).toBe('Administrator (Admin)');
    });

    it('should login successfully with valid BNS credentials', async () => {
      const mockUser = { id: 2, email: 'bns@health.gov.ph', role: 'Barangay Nutrition Scholar' };
      loginService.mockResolvedValue(mockUser);
      login.mockResolvedValue({
        success: true,
        token: 'mock-jwt-token-bns',
        role: 'Barangay Nutrition Scholar',
        redirectTo: '/health-reports'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ role: 'Barangay Nutrition Scholar', email: 'bns@health.gov.ph', password: 'BNSBalayan2026!' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.role).toBe('Barangay Nutrition Scholar');
    });

    it('should return 401 for invalid credentials', async () => {
      loginService.mockRejectedValue(new Error('Incorrect email or password'));

      const res = await request(app)
        .post('/api/auth/login')
        .send({ role: 'Administrator (Admin)', email: 'wrong@health.gov.ph', password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Incorrect email or password');
    });

    it('should return 401 for invalid role', async () => {
      loginService.mockRejectedValue(new Error('Invalid dropdown selection'));

      const res = await request(app)
        .post('/api/auth/login')
        .send({ role: 'Invalid Role', email: 'user@health.gov.ph', password: 'Balayan2026!' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 for weak password', async () => {
      loginService.mockRejectedValue(new Error('Weak password configuration'));

      const res = await request(app)
        .post('/api/auth/login')
        .send({ role: 'Administrator (Admin)', email: 'user@health.gov.ph', password: '123' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set({ Authorization: 'Bearer valid-token' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Logged out successfully');
      expect(clearSession).toHaveBeenCalled();
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/session', () => {
    it('should return active session data', async () => {
      const mockSession = { id: 1, role: 'Administrator (Admin)', email: 'user@health.gov.ph' };
      getSession.mockReturnValue(mockSession);

      const res = await request(app)
        .get('/api/auth/session')
        .set({ Authorization: 'Bearer valid-token' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toEqual(mockSession);
    });

    it('should return 401 when no active session', async () => {
      getSession.mockReturnValue(null);

      const res = await request(app)
        .get('/api/auth/session')
        .set({ Authorization: 'Bearer invalid-token' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid or expired token');
    });
  });
});
