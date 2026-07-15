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
  });


  describe('Bar Graph - fetchBarGraphFilters', () => {
    it('should return month and classification filter options', async () => {
      const result = await nutritionAssessmentService.fetchBarGraphFilters();
      
      expect(result).toHaveProperty('months');
      expect(result.months.length).toBe(13); 
      expect(result.months[0]).toEqual({ label: 'All Months', value: 'All' });
      
      expect(result).toHaveProperty('classifications');
      expect(result.classifications).toEqual([
        { label: 'Healthy', value: 'healthy' },
        { label: 'Deficit', value: 'deficit' },
        { label: 'Excess', value: 'excess' }
      ]);
    });
  });

  describe('Bar Graph - fetchBarGraphData', () => {
    it('should aggregate data across all barangays and months by default', async () => {
      const mockRecords = [
        { id: 1, month: 'Jan', classification: 'healthy', barangay: 'Barangay 1' },
        { id: 2, month: 'Feb', classification: 'healthy', barangay: 'Barangay 1' },
        { id: 3, month: 'Jan', classification: 'deficit', barangay: 'Barangay 2' }
      ];
      nutritionAssessmentModel.getAllAssessments.mockResolvedValue(mockRecords);

      const result = await nutritionAssessmentService.fetchBarGraphData();

      // Categories should be unique sorted barangays
      expect(result.categories).toEqual(['Barangay 1', 'Barangay 2']);
      expect(result.series).toHaveLength(3); 

      const healthySeries = result.series.find(s => s.name === 'Healthy');
      expect(healthySeries.data).toEqual([2, 0]);

      const deficitSeries = result.series.find(s => s.name === 'Deficit');
      expect(deficitSeries.data).toEqual([0, 1]); 
    });

    it('should filter correctly by a specific month', async () => {
      const mockRecords = [
        { id: 1, month: 'Jan', classification: 'healthy', barangay: 'Barangay 1' },
        { id: 2, month: 'Feb', classification: 'excess', barangay: 'Barangay 1' },
        { id: 3, month: 'Jan', classification: 'deficit', barangay: 'Barangay 2' }
      ];
      nutritionAssessmentModel.getAllAssessments.mockResolvedValue(mockRecords);

      const filters = { month: 'Jan' };
      const result = await nutritionAssessmentService.fetchBarGraphData(filters);

      const healthySeries = result.series.find(s => s.name === 'Healthy');
      expect(healthySeries.data).toEqual([1, 0]); 

      const excessSeries = result.series.find(s => s.name === 'Excess');
      expect(excessSeries.data).toEqual([0, 0]); 
    });

    it('should filter correctly by specific classifications', async () => {
      const mockRecords = [
        { id: 1, month: 'Jan', classification: 'healthy', barangay: 'Barangay 1' },
        { id: 2, month: 'Jan', classification: 'deficit', barangay: 'Barangay 2' }
      ];
      nutritionAssessmentModel.getAllAssessments.mockResolvedValue(mockRecords);

      const filters = { classifications: ['deficit'] };
      const result = await nutritionAssessmentService.fetchBarGraphData(filters);

      expect(result.series).toHaveLength(1); 
      expect(result.series[0].name).toBe('Deficit');
      expect(result.series[0].data).toEqual([0, 1]); 
    });

    it('should return empty data arrays if the database is empty', async () => {
      nutritionAssessmentModel.getAllAssessments.mockResolvedValue([]);

      const result = await nutritionAssessmentService.fetchBarGraphData();

      expect(result.categories).toEqual([]);
      expect(result.series).toHaveLength(3);
      expect(result.series[0].data).toEqual([]);
    });

    it('should throw an error if the database query fails', async () => {
      nutritionAssessmentModel.getAllAssessments.mockRejectedValue(new Error('Connection Failed'));

      await expect(nutritionAssessmentService.fetchBarGraphData()).rejects.toThrow('Connection Failed');
    });
  });
});