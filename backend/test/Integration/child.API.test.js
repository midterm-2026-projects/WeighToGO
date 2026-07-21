import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../../src/config/db.js', () => ({ default: { query: vi.fn() } }));
vi.mock('../../src/service/child.service.js', () => ({
  default: {
    fetchMasterlist: vi.fn(),
    filterChildMasterlist: vi.fn(),
    fetchChildProfile: vi.fn(),
    registerChild: vi.fn(),
    submitChildAssessment: vi.fn(),
    fetchChildHistory: vi.fn(),
    fetchFilterOptions: vi.fn(),
    calculateNutritionalTotals: vi.fn(),
    calculateFilteredTotals: vi.fn()
  }
}));

import childService from '../../src/service/child.service.js';

const authMiddleware = await vi.importActual('../../src/middleware/auth.js');
vi.mock('../../src/middleware/auth.js', () => ({
  authenticate: vi.fn((req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token === 'valid-token') {
      req.user = { id: 1, role: 'Administrator (Admin)' };
      req.token = token;
      return next();
    }
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }),
  requireRole: authMiddleware.requireRole
}));

const app = (await import('../../app.js')).default;

describe('Children API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const authHeader = { Authorization: 'Bearer valid-token' };

  describe('GET /api/children', () => {
    it('should return all children when no query params', async () => {
      childService.fetchMasterlist.mockResolvedValue([{ id: 1 }]);

      const res = await request(app).get('/api/children').set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(childService.fetchMasterlist).toHaveBeenCalled();
    });

    it('should filter children when query params provided', async () => {
      childService.filterChildMasterlist.mockResolvedValue([{ id: 1, barangay: 'Brgy. Navotas' }]);

      const res = await request(app)
        .get('/api/children?barangay=Brgy.+Navotas&ageGroup=12-23+Months&status=normal')
        .set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(childService.filterChildMasterlist).toHaveBeenCalledWith('Brgy. Navotas', '12-23 Months', 'normal');
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/children');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/children/:id', () => {
    it('should return a child by id', async () => {
      childService.fetchChildProfile.mockResolvedValue({ id: 1, name: 'CHILD A' });

      const res = await request(app).get('/api/children/1').set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(1);
    });

    it('should return 404 for non-existent child', async () => {
      childService.fetchChildProfile.mockRejectedValue(new Error('Child not found'));

      const res = await request(app).get('/api/children/999').set(authHeader);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/children', () => {
    it('should register a new child', async () => {
      const mockChild = { id: 21, name: 'TEST CHILD' };
      childService.registerChild.mockResolvedValue(mockChild);

      const res = await request(app)
        .post('/api/children')
        .set(authHeader)
        .send({ name: 'TEST CHILD', barangay: 'Brgy. Navotas', gender: 'Male' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('TEST CHILD');
    });

    it('should return 400 on registration error', async () => {
      childService.registerChild.mockRejectedValue(new Error('Validation failed'));

      const res = await request(app)
        .post('/api/children')
        .set(authHeader)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/children/:id/assessment', () => {
    it('should submit an assessment', async () => {
      childService.submitChildAssessment.mockResolvedValue({ id: 1, weight: 10.5 });

      const res = await request(app)
        .put('/api/children/1/assessment')
        .set(authHeader)
        .send({ weight: 10.5, height: 75.0 });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 400 on assessment error', async () => {
      childService.submitChildAssessment.mockRejectedValue(new Error('Invalid data'));

      const res = await request(app)
        .put('/api/children/999/assessment')
        .set(authHeader)
        .send({ weight: 10.5 });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/children/:id/history', () => {
    it('should return child assessment history', async () => {
      childService.fetchChildHistory.mockResolvedValue([{ id: 1, month: 'Jan', year: 2026 }]);

      const res = await request(app).get('/api/children/1/history').set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/children/filters', () => {
    it('should return filter options', async () => {
      childService.fetchFilterOptions.mockResolvedValue({ barangays: ['Brgy. Navotas'], ageGroups: ['0-11 Months'] });

      const res = await request(app).get('/api/children/filters').set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.barangays).toContain('Brgy. Navotas');
    });
  });

  describe('GET /api/children/totals', () => {
    it('should return nutritional totals without filters', async () => {
      childService.calculateNutritionalTotals.mockResolvedValue({ total: 20, normal: 10 });

      const res = await request(app).get('/api/children/totals').set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(20);
    });

    it('should return filtered totals when query params provided', async () => {
      childService.calculateFilteredTotals.mockResolvedValue({ total: 5, normal: 3 });

      const res = await request(app)
        .get('/api/children/totals?barangay=Brgy.+Navotas&ageGroup=0-11+Months')
        .set(authHeader);
      expect(res.status).toBe(200);
      expect(childService.calculateFilteredTotals).toHaveBeenCalledWith('Brgy. Navotas', '0-11 Months');
    });
  });
});
