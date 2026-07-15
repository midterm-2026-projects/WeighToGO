import { describe, it, expect, vi, beforeEach } from 'vitest';
import nutritionAssessmentService from '../src/service/nutritionAssessment.service.js';
import nutritionAssessmentModel from '../src/models/nutritionAssessment.model.js';

vi.mock('../src/models/nutritionAssessment.model.js', () => ({
  default: {
    getAllAssessments: vi.fn()
  }
}));

describe('Nutrition Assessment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Trendline - fetchTrendlineFilters', () => {
    it('should return all available checkbox filter options', async () => {
      const result = await nutritionAssessmentService.fetchTrendlineFilters();
      expect(result).toHaveLength(5);
      expect(result[0]).toEqual({ label: 'Normal (N)', value: 'Normal (N)' });
    });
  });

  describe('Trendline - fetchTrendlineData', () => {
    it('should aggregate data for all statuses across all months when no filter is provided', async () => {
      const mockRecords = [
        { id: 1, month: 'Jan', status: 'Normal (N)' },
        { id: 2, month: 'Jan', status: 'Normal (N)' },
        { id: 3, month: 'Feb', status: 'Overweight (OW)' }
      ];
      nutritionAssessmentModel.getAllAssessments.mockResolvedValue(mockRecords);

      const result = await nutritionAssessmentService.fetchTrendlineData();
      expect(result.categories).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
      expect(result.series).toHaveLength(5);
    });

    it('should properly filter and return only the selected statuses', async () => {
      const mockRecords = [
        { id: 1, month: 'Mar', status: 'Normal (N)' },
        { id: 2, month: 'Mar', status: 'Obese (OB)' },
        { id: 3, month: 'Apr', status: 'Obese (OB)' }
      ];
      nutritionAssessmentModel.getAllAssessments.mockResolvedValue(mockRecords);

      const filters = { statuses: ['Obese (OB)'] };
      const result = await nutritionAssessmentService.fetchTrendlineData(filters);

      expect(result.series).toHaveLength(1);
      expect(result.series[0].name).toBe('Obese (OB)');
      expect(result.series[0].data[2]).toBe(1); 
      expect(result.series[0].data[3]).toBe(1); 
    });

    it('should return an empty series payload if the database is empty', async () => {
      nutritionAssessmentModel.getAllAssessments.mockResolvedValue([]);

      const result = await nutritionAssessmentService.fetchTrendlineData();

      expect(result.series).toHaveLength(5);
      result.series.forEach(statusSeries => {
        statusSeries.data.forEach(count => {
          expect(count).toBe(0);
        });
      });
    });

    it('should ignore malformed or unrecognized statuses in the database', async () => {
      const dirtyRecords = [
        { id: 1, month: 'Jan', status: 'Normal (N)' },
        { id: 2, month: 'Jan', status: 'UNKNOWN_STATUS' },
        { id: 3, month: 'INVALID_MONTH', status: 'Normal (N)' }
      ];
      nutritionAssessmentModel.getAllAssessments.mockResolvedValue(dirtyRecords);

      const result = await nutritionAssessmentService.fetchTrendlineData();
      
      const normalSeries = result.series.find(s => s.name === 'Normal (N)');
      expect(normalSeries.data[0]).toBe(1); 
      
      const unknownInSeries = result.series.find(s => s.name === 'UNKNOWN_STATUS');
      expect(unknownInSeries).toBeUndefined();
    });

    it('should throw an error if the database returns null', async () => {
      nutritionAssessmentModel.getAllAssessments.mockResolvedValue(null);

      await expect(nutritionAssessmentService.fetchTrendlineData()).rejects.toThrow(
        'Failed to retrieve nutrition assessments from the database'
      );
    });

    it('should propagate errors from the database query', async () => {
      nutritionAssessmentModel.getAllAssessments.mockRejectedValue(new Error('Connection Failed'));

      await expect(nutritionAssessmentService.fetchTrendlineData()).rejects.toThrow('Connection Failed');
    });
  });
});