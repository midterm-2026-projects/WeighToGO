import { describe, it, expect, vi, beforeEach } from 'vitest';
import nutritionAssessmentService from '../src/service/nutritionAssessment.service.js';
import nutritionAssessmentModel from '../src/models/nutritionAssessment.model.js';

vi.mock('../src/models/nutritionAssessment.model.js', () => ({
  default: {
    getBarangayMapData: vi.fn(),
    getAssessmentsByBarangay: vi.fn(),
    getAggregatedBarangayData: vi.fn(),
    getFilteredAssessments: vi.fn(),
    getFilteredBarangayBarData: vi.fn(),
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
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { label: 'Weight-for-Age (WFA)', value: 'wfa' },
        { label: 'Height-for-Age (HFA)', value: 'hfa' },
        { label: 'Weight-for-Length/Height (WFH/L)', value: 'wfhl' }
      ]);
    });
  });

  describe('Trendline - fetchTrendlineData', () => {
    it('should aggregate data for all statuses across all months when no filter is provided', async () => {
      const mockRecords = [
        { id: 1, month: 'Jan', wfa_status: 'Normal' },
        { id: 2, month: 'Jan', wfa_status: 'Normal' },
        { id: 3, month: 'Feb', wfa_status: 'Overweight' }
      ];
      nutritionAssessmentModel.getFilteredAssessments.mockResolvedValue(mockRecords);

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
        { label: 'Normal', value: 'normal' },
        { label: 'Stunted', value: 'stunted' },
        { label: 'Obese', value: 'obese' }
      ]);
    });
  });

  describe('Bar Graph - fetchBarGraphData', () => {
    it('should aggregate data across all barangays and months by default', async () => {
      const mockAggregatedData = [
        { barangay: 'Barangay 1', total: 2, normal_count: 2, stunted_count: 0, obese_count: 0 },
        { barangay: 'Barangay 2', total: 1, normal_count: 0, stunted_count: 1, obese_count: 0 }
      ];
      nutritionAssessmentModel.getFilteredBarangayBarData.mockResolvedValue(mockAggregatedData);

      const result = await nutritionAssessmentService.fetchBarGraphData();

      expect(result.categories).toEqual(['Barangay 1', 'Barangay 2']);
      expect(result.series).toHaveLength(3);

      const normalSeries = result.series.find(s => s.name === 'Normal');
      expect(normalSeries.data).toEqual([2, 0]);

      const stuntedSeries = result.series.find(s => s.name === 'Stunted');
      expect(stuntedSeries.data).toEqual([0, 1]);
    });

    it('should filter correctly by a specific month', async () => {
      const mockAggregatedData = [
        { barangay: 'Barangay 1', total: 1, normal_count: 1, stunted_count: 0, obese_count: 0 },
        { barangay: 'Barangay 2', total: 0, normal_count: 0, stunted_count: 0, obese_count: 0 }
      ];
      nutritionAssessmentModel.getFilteredBarangayBarData.mockResolvedValue(mockAggregatedData);

      const filters = { month: 'Jan' };
      const result = await nutritionAssessmentService.fetchBarGraphData(filters);

      const normalSeries = result.series.find(s => s.name === 'Normal');
      expect(normalSeries.data).toEqual([1, 0]);

      const obeseSeries = result.series.find(s => s.name === 'Obese');
      expect(obeseSeries.data).toEqual([0, 0]);
    });

    it('should filter correctly by specific classifications', async () => {
      const mockAggregatedData = [
        { barangay: 'Barangay 1', total: 1, normal_count: 1, stunted_count: 0, obese_count: 0 },
        { barangay: 'Barangay 2', total: 1, normal_count: 0, stunted_count: 1, obese_count: 0 }
      ];
      nutritionAssessmentModel.getFilteredBarangayBarData.mockResolvedValue(mockAggregatedData);

      const filters = { classifications: ['stunted'] };
      const result = await nutritionAssessmentService.fetchBarGraphData(filters);

      expect(result.series).toHaveLength(1);
      expect(result.series[0].name).toBe('Stunted');
      expect(result.series[0].data).toEqual([0, 1]);
    });

    it('should return empty data arrays if the database is empty', async () => {
      nutritionAssessmentModel.getFilteredBarangayBarData.mockResolvedValue([]);

      const result = await nutritionAssessmentService.fetchBarGraphData();

      expect(result.categories).toEqual([]);
      expect(result.series).toHaveLength(3);
      expect(result.series[0].data).toEqual([]);
    });
  });

  describe('Map Data - fetchMapData', () => {
    it('should return map data from the model', async () => {
      const mockMapData = [
        { id: 1, name: 'Barangay 1', cases: 5, registeredChildren: 150, riskLevel: 'Low Risk', color: 'bg-green-500' },
        { id: 2, name: 'Barangay 2', cases: 25, registeredChildren: 200, riskLevel: 'Moderate Risk', color: 'bg-yellow-400' }
      ];
      nutritionAssessmentModel.getBarangayMapData.mockResolvedValue(mockMapData);

      const result = await nutritionAssessmentService.fetchMapData();
      expect(result).toEqual(mockMapData);
      expect(nutritionAssessmentModel.getBarangayMapData).toHaveBeenCalled();
    });
  });

  describe('Barangay Health Insights - fetchBarangayHealthInsights', () => {
    it('should return detailed health statistics for a selected barangay', async () => {
      const mockRecords = [
        { id: 1, wfa_status: 'Normal (N)', classification: 'normal', barangay: 'Barangay 1' },
        { id: 3, wfa_status: 'Overweight (OW)', classification: 'obese', barangay: 'Barangay 1' },
        { id: 5, wfa_status: 'Normal (N)', classification: 'normal', barangay: 'Barangay 1' }
      ];
      nutritionAssessmentModel.getAssessmentsByBarangay.mockResolvedValue(mockRecords);

      const result = await nutritionAssessmentService.fetchBarangayHealthInsights('Barangay 1');

      expect(nutritionAssessmentModel.getAssessmentsByBarangay).toHaveBeenCalledWith('Barangay 1');
      expect(result.total).toBe(3);
      expect(result.classifications.normal).toBe(2);
      expect(result.classifications.obese).toBe(1);
      expect(result.classifications.stunted).toBe(0);
      expect(result.statuses['Normal (N)']).toBe(2);
      expect(result.statuses['Overweight (OW)']).toBe(1);
    });

    it('should return an empty dataset without errors if no records exist for the barangay', async () => {
      nutritionAssessmentModel.getAssessmentsByBarangay.mockResolvedValue([]);

      const result = await nutritionAssessmentService.fetchBarangayHealthInsights('Unknown Barangay');

      expect(result.total).toBe(0);
      expect(result.classifications.normal).toBe(0);
      expect(result.classifications.stunted).toBe(0);
      expect(result.classifications.obese).toBe(0);
      expect(result.statuses).toEqual({});
    });

    it('should throw an error if no barangay identifier is provided', async () => {
      await expect(nutritionAssessmentService.fetchBarangayHealthInsights()).rejects.toThrow('Barangay identifier is required');
    });
  });
});
