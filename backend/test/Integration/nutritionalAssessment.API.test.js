import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../../src/middleware/auth.js', () => ({
  authenticate: (req, res, next) => {
    req.user = { email: 'user@health.gov.ph', role: 'Administrator (Admin)' };
    next();
  },
  requireRole: () => (req, res, next) => next()
}));

vi.mock('../../src/service/nutritionAssessment.service.js', () => ({
  default: {
    fetchTrendlineFilters: vi.fn(),
    fetchTrendlineData: vi.fn(),
    fetchBarGraphFilters: vi.fn(),
    fetchBarGraphData: vi.fn(),
    fetchMapData: vi.fn(),
    fetchBarangayHealthInsights: vi.fn()
  }
}));

const app = (await import('../../app.js')).default;
const analyticsService = (await import('../../src/service/nutritionAssessment.service.js')).default;

describe('NutritionAssessment API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/analytics/trendline/filters', () => {
    it('should return trendline filter options', async () => {
      const mockFilters = [
        { label: 'Weight-for-Age (WFA)', value: 'wfa' },
        { label: 'Height-for-Age (HFA)', value: 'hfa' },
        { label: 'Weight-for-Length/Height (WFH/L)', value: 'wfhl' }
      ];
      analyticsService.fetchTrendlineFilters.mockResolvedValue(mockFilters);

      const res = await request(app)
        .get('/api/analytics/trendline/filters')
        .set('Authorization', 'Bearer mock-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockFilters);
    });

    it('should handle service errors gracefully', async () => {
      analyticsService.fetchTrendlineFilters.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .get('/api/analytics/trendline/filters')
        .set('Authorization', 'Bearer mock-token');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Database error');
    });
  });

  describe('GET /api/analytics/trendline', () => {
    it('should return trendline data with default filters', async () => {
      const mockData = {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
          { name: 'Normal', data: [5, 3, 4, 2, 6, 4, 3, 5, 2, 4, 3, 5], color: '#10b981' }
        ]
      };
      analyticsService.fetchTrendlineData.mockResolvedValue(mockData);

      const res = await request(app)
        .get('/api/analytics/trendline')
        .set('Authorization', 'Bearer mock-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockData);
      expect(analyticsService.fetchTrendlineData).toHaveBeenCalledWith({});
    });

    it('should pass query parameters to the service', async () => {
      analyticsService.fetchTrendlineData.mockResolvedValue({ categories: [], series: [] });

      await request(app)
        .get('/api/analytics/trendline?barangay=Brgy.%20Navotas&ageGroup=0-11%20Months&statusType=wfa')
        .set('Authorization', 'Bearer mock-token');

      expect(analyticsService.fetchTrendlineData).toHaveBeenCalledWith(
        expect.objectContaining({
          barangay: 'Brgy. Navotas',
          ageGroup: '0-11 Months',
          statusType: 'wfa'
        })
      );
    });

    it('should handle service errors gracefully', async () => {
      analyticsService.fetchTrendlineData.mockRejectedValue(new Error('Failed to retrieve data'));

      const res = await request(app)
        .get('/api/analytics/trendline')
        .set('Authorization', 'Bearer mock-token');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to retrieve data');
    });
  });

  describe('GET /api/analytics/bar-graph/filters', () => {
    it('should return bar graph filter options', async () => {
      const mockFilters = {
        months: [{ label: 'All Months', value: 'All' }, { label: 'Jan', value: 'Jan' }],
        classifications: [{ label: 'Normal', value: 'normal' }, { label: 'Stunted', value: 'stunted' }, { label: 'Obese', value: 'obese' }]
      };
      analyticsService.fetchBarGraphFilters.mockResolvedValue(mockFilters);

      const res = await request(app)
        .get('/api/analytics/bar-graph/filters')
        .set('Authorization', 'Bearer mock-token');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockFilters);
    });
  });

  describe('GET /api/analytics/bar-graph', () => {
    it('should return bar graph data', async () => {
      const mockData = {
        categories: ['Barangay 1', 'Barangay 2'],
        series: [
          { name: 'Normal', data: [5, 3], color: '#10b981' },
          { name: 'Stunted', data: [1, 2], color: '#f59e0b' },
          { name: 'Obese', data: [0, 1], color: '#ef4444' }
        ]
      };
      analyticsService.fetchBarGraphData.mockResolvedValue(mockData);

      const res = await request(app)
        .get('/api/analytics/bar-graph')
        .set('Authorization', 'Bearer mock-token');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockData);
    });

    it('should pass query parameters to the service', async () => {
      analyticsService.fetchBarGraphData.mockResolvedValue({ categories: [], series: [] });

      await request(app)
        .get('/api/analytics/bar-graph?month=Jan&barangay=Brgy.%20Navotas')
        .set('Authorization', 'Bearer mock-token');

      expect(analyticsService.fetchBarGraphData).toHaveBeenCalledWith(
        expect.objectContaining({ month: 'Jan', barangay: 'Brgy. Navotas' })
      );
    });
  });

  describe('GET /api/analytics/map', () => {
    it('should return map data', async () => {
      const mockMapData = [
        { id: 1, name: 'Barangay 1', cases: 2, registeredChildren: 50, riskLevel: 'Low Risk', color: '#22c55e' }
      ];
      analyticsService.fetchMapData.mockResolvedValue(mockMapData);

      const res = await request(app)
        .get('/api/analytics/map')
        .set('Authorization', 'Bearer mock-token');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockMapData);
    });
  });

  describe('GET /api/analytics/barangay/:name', () => {
    it('should return health insights for a specific barangay', async () => {
      const mockInsights = {
        barangay: 'Barangay 1',
        total: 3,
        classifications: { normal: 2, stunted: 1, obese: 0 },
        statuses: { 'Normal': 2, 'Underweight': 1 }
      };
      analyticsService.fetchBarangayHealthInsights.mockResolvedValue(mockInsights);

      const res = await request(app)
        .get('/api/analytics/barangay/Barangay%201')
        .set('Authorization', 'Bearer mock-token');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockInsights);
      expect(analyticsService.fetchBarangayHealthInsights).toHaveBeenCalledWith('Barangay 1');
    });

    it('should handle errors for missing barangay', async () => {
      analyticsService.fetchBarangayHealthInsights.mockRejectedValue(new Error('Barangay identifier is required'));

      const res = await request(app)
        .get('/api/analytics/barangay/Nonexistent')
        .set('Authorization', 'Bearer mock-token');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Barangay identifier is required');
    });
  });
});
