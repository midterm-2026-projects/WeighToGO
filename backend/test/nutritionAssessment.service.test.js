import { describe, it, expect, vi, beforeEach } from 'vitest';
import nutritionAssessmentService from '../src/service/nutritionAssessment.service.js';
import nutritionAssessmentModel from '../src/models/nutritionAssessment.model.js';

vi.mock('../src/models/nutritionAssessment.model.js', () => ({
  default: {
    getAllAssessments: vi.fn(),
    getBarangayCoordinates: vi.fn(),
    getNutritionalRiskAggregations: vi.fn(),
    getAssessmentsByBarangay: vi.fn()
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

  describe('Map Data - fetchMapData', () => {
    it('should combine coordinates and aggregated data to calculate correct risk levels and marker colors', async () => {
      const mockAggregations = {
        'Barangay 1': { total: 10, healthy: 9, deficit: 1, excess: 0 },
        'Barangay 2': { total: 10, healthy: 7, deficit: 3, excess: 0 },
        'Barangay 3': { total: 10, healthy: 5, deficit: 3, excess: 2 }
      };
      
      const mockCoords = {
        'Barangay 1': { lat: 13.9405, lng: 120.7323 },
        'Barangay 2': { lat: 13.9425, lng: 120.7345 },
        'Barangay 3': { lat: 13.9445, lng: 120.7367 }
      };

      nutritionAssessmentModel.getNutritionalRiskAggregations.mockResolvedValue(mockAggregations);
      nutritionAssessmentModel.getBarangayCoordinates.mockResolvedValue(mockCoords);

      const result = await nutritionAssessmentService.fetchMapData();

      expect(result).toHaveLength(3);
      
      const b1 = result.find(r => r.barangay === 'Barangay 1');
      expect(b1.riskLevel).toBe('Low');
      expect(b1.markerColor).toBe('green');
      expect(b1.lat).toBe(13.9405);

      const b2 = result.find(r => r.barangay === 'Barangay 2');
      expect(b2.riskLevel).toBe('Medium');
      expect(b2.markerColor).toBe('orange');

      const b3 = result.find(r => r.barangay === 'Barangay 3');
      expect(b3.riskLevel).toBe('High');
      expect(b3.markerColor).toBe('red');
    });
  });

  describe('Barangay Health Insights - fetchBarangayHealthInsights', () => {
    it('should return detailed health statistics for a selected barangay', async () => {
      const mockRecords = [
        { id: 1, status: 'Normal (N)', classification: 'healthy', barangay: 'Barangay 1' },
        { id: 3, status: 'Overweight (OW)', classification: 'excess', barangay: 'Barangay 1' },
        { id: 5, status: 'Normal (N)', classification: 'healthy', barangay: 'Barangay 1' }
      ];
      nutritionAssessmentModel.getAssessmentsByBarangay.mockResolvedValue(mockRecords);

      const result = await nutritionAssessmentService.fetchBarangayHealthInsights('Barangay 1');

      expect(nutritionAssessmentModel.getAssessmentsByBarangay).toHaveBeenCalledWith('Barangay 1');
      expect(result.total).toBe(3);
      expect(result.classifications.healthy).toBe(2);
      expect(result.classifications.excess).toBe(1);
      expect(result.classifications.deficit).toBe(0);
      expect(result.statuses['Normal (N)']).toBe(2);
      expect(result.statuses['Overweight (OW)']).toBe(1);
    });

    it('should return an empty dataset without errors if no records exist for the barangay', async () => {
      nutritionAssessmentModel.getAssessmentsByBarangay.mockResolvedValue([]);

      const result = await nutritionAssessmentService.fetchBarangayHealthInsights('Unknown Barangay');

      expect(result.total).toBe(0);
      expect(result.classifications.healthy).toBe(0);
      expect(result.classifications.deficit).toBe(0);
      expect(result.classifications.excess).toBe(0);
      expect(result.statuses).toEqual({});
    });

    it('should throw an error if no barangay identifier is provided', async () => {
      await expect(nutritionAssessmentService.fetchBarangayHealthInsights()).rejects.toThrow('Barangay identifier is required');
    });
  });
});