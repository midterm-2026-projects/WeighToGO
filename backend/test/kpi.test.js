import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as kpiService from '../src/service/kpi.service.js';
import * as kpiModel from '../src/models/kpi.model.js';

vi.mock('../src/models/kpi.model.js', () => ({
  getKpiTotals: vi.fn()
}));

describe('KPI Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchKpiMetrics', () => {
    it('should successfully calculate and return aggregated KPI totals', async () => {
      const expectedTotals = {
        healthy: 85,
        deficit: 45,
        excess: 12
      };
      
      kpiModel.getKpiTotals.mockResolvedValue(expectedTotals);

      const result = await kpiService.fetchKpiMetrics();

      expect(kpiModel.getKpiTotals).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedTotals);
      expect(result).toHaveProperty('healthy');
      expect(result).toHaveProperty('deficit');
      expect(result).toHaveProperty('excess');
    });

    it('should handle and throw errors when KPI calculation fails', async () => {
      const errorMessage = 'Database query failed';
      kpiModel.getKpiTotals.mockRejectedValue(new Error(errorMessage));

      await expect(kpiService.fetchKpiMetrics()).rejects.toThrow(errorMessage);
    });
  });
});