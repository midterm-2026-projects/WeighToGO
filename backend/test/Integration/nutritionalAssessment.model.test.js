import { describe, it, expect, vi, beforeEach } from 'vitest';
import assessmentModel from '../../src/models/nutritionAssessment.model.js';

vi.mock('../../src/config/db.js', () => ({
  default: {
    query: vi.fn()
  }
}));

import db from '../../src/config/db.js';

describe('NutritionAssessment Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllAssessments', () => {
    it('should return all assessments ordered by month and year', async () => {
      const mockRows = [
        { id: 1, month: 'Jan', year: 2026 },
        { id: 2, month: 'Feb', year: 2026 }
      ];
      db.query.mockResolvedValue([mockRows]);

      const result = await assessmentModel.getAllAssessments();
      expect(result).toEqual(mockRows);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM assessments ORDER BY FIELD(month, "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"), year'
      );
    });
  });

  describe('getBarangayCoordinates', () => {
    it('should return a map of barangay names to coordinates', async () => {
      const mockRows = [
        { name: 'Barangay 1', lat: 13.94, lng: 120.73 },
        { name: 'Barangay 2', lat: 13.95, lng: 120.74 }
      ];
      db.query.mockResolvedValue([mockRows]);

      const result = await assessmentModel.getBarangayCoordinates();
      expect(result).toEqual({
        'Barangay 1': { lat: 13.94, lng: 120.73 },
        'Barangay 2': { lat: 13.95, lng: 120.74 }
      });
    });
  });

  describe('getNutritionalRiskAggregations', () => {
    it('should aggregate nutritional risk by barangay', async () => {
      const mockRows = [
        { barangay: 'Barangay 1', total: 3, normal: 2, stunted: 1, obese: 0 },
        { barangay: 'Barangay 2', total: 2, normal: 0, stunted: 1, obese: 1 }
      ];
      db.query.mockResolvedValue([mockRows]);

      const result = await assessmentModel.getNutritionalRiskAggregations();
      expect(result).toEqual({
        'Barangay 1': { total: 3, normal: 2, stunted: 1, obese: 0 },
        'Barangay 2': { total: 2, normal: 0, stunted: 1, obese: 1 }
      });
    });

    it('should return an empty object when there are no rows', async () => {
      db.query.mockResolvedValue([[]]);

      const result = await assessmentModel.getNutritionalRiskAggregations();
      expect(result).toEqual({});
    });
  });

  describe('getAssessmentsByBarangay', () => {
    it('should return assessments for a specific barangay', async () => {
      const mockRows = [
        { id: 1, child_id: 1, month: 'Jan', barangay: 'Barangay 1' },
        { id: 2, child_id: 2, month: 'Feb', barangay: 'Barangay 1' }
      ];
      db.query.mockResolvedValue([mockRows]);

      const result = await assessmentModel.getAssessmentsByBarangay('Barangay 1');
      expect(result).toHaveLength(2);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.barangay = ?'),
        ['Barangay 1']
      );
    });
  });

  describe('getAggregatedBarangayData', () => {
    it('should return aggregated barangay data grouped by barangay', async () => {
      const mockRows = [
        { barangay: 'Barangay 1', total: 3, normal_count: 2, stunted_count: 1, obese_count: 0 },
        { barangay: 'Barangay 2', total: 1, normal_count: 0, stunted_count: 0, obese_count: 1 }
      ];
      db.query.mockResolvedValue([mockRows]);

      const result = await assessmentModel.getAggregatedBarangayData();
      expect(result).toHaveLength(2);
      expect(result[0].barangay).toBe('Barangay 1');
      expect(result[0].normal_count).toBe(2);
    });
  });

  describe('getMonthlyTrendData', () => {
    it('should return monthly trend data grouped by month and classification', async () => {
      const mockRows = [
        { month: 'Jan', classification: 'normal', count: 5 },
        { month: 'Jan', classification: 'stunted', count: 2 },
        { month: 'Feb', classification: 'normal', count: 3 }
      ];
      db.query.mockResolvedValue([mockRows]);

      const result = await assessmentModel.getMonthlyTrendData();
      expect(result).toHaveLength(3);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('GROUP BY a.month, a.classification')
      );
    });
  });

  describe('getFilteredAssessments', () => {
    it('should return all assessments when no filters are applied', async () => {
      const mockRows = [{ id: 1, month: 'Jan' }, { id: 2, month: 'Feb' }];
      db.query.mockResolvedValue([mockRows]);

      const result = await assessmentModel.getFilteredAssessments('all', 'all');
      expect(result).toHaveLength(2);
      expect(db.query).toHaveBeenCalledWith(
        expect.not.stringContaining('AND'),
        []
      );
    });

    it('should filter by barangay when provided', async () => {
      db.query.mockResolvedValue([[{ id: 1, month: 'Jan' }]]);

      await assessmentModel.getFilteredAssessments('Brgy. Navotas', 'all');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND c.barangay = ?'),
        ['Brgy. Navotas']
      );
    });

    it('should filter by age group 0-11 Months', async () => {
      db.query.mockResolvedValue([[]]);

      await assessmentModel.getFilteredAssessments('all', '0-11 Months');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND c.age_months >= ? AND c.age_months <= ?'),
        [0, 11]
      );
    });

    it('should filter by age group 12-23 Months', async () => {
      db.query.mockResolvedValue([[]]);

      await assessmentModel.getFilteredAssessments('all', '12-23 Months');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND c.age_months >= ? AND c.age_months <= ?'),
        [12, 23]
      );
    });

    it('should filter by age group 24-59 Months', async () => {
      db.query.mockResolvedValue([[]]);

      await assessmentModel.getFilteredAssessments('all', '24-59 Months');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND c.age_months >= ? AND c.age_months <= ?'),
        [24, 59]
      );
    });

    it('should apply both barangay and age group filters together', async () => {
      db.query.mockResolvedValue([[]]);

      await assessmentModel.getFilteredAssessments('Brgy. Navotas', '12-23 Months');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND c.barangay = ?'),
        expect.arrayContaining(['Brgy. Navotas', 12, 23])
      );
    });
  });

  describe('getFilteredBarangayBarData', () => {
    it('should return bar data for a specific month', async () => {
      const mockRows = [
        { barangay: 'Barangay 1', total: 2, normal_count: 1, stunted_count: 1, obese_count: 0 }
      ];
      db.query.mockResolvedValue([mockRows]);

      const result = await assessmentModel.getFilteredBarangayBarData('Jan');
      expect(result).toEqual(mockRows);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND a.month = ?'),
        ['Jan']
      );
    });

    it('should return all data when month is All', async () => {
      db.query.mockResolvedValue([[]]);

      await assessmentModel.getFilteredBarangayBarData('All');
      expect(db.query).toHaveBeenCalledWith(
        expect.not.stringContaining('a.month'),
        []
      );
    });
  });

  describe('getBarangayMapData', () => {
    it('should return map data with risk levels for each barangay', async () => {
      const mockBarangays = [
        { id: 1, name: 'Barangay 1', lat: 13.94, lng: 120.73 },
        { id: 2, name: 'Barangay 2', lat: 13.95, lng: 120.74 }
      ];
      const mockAggregations = [
        { barangay: 'Barangay 1', total: 10, normal: 9, stunted: 1, obese: 0, total_weight: 100, total_height: 600 },
        { barangay: 'Barangay 2', total: 10, normal: 3, stunted: 4, obese: 3, total_weight: 100, total_height: 600 }
      ];
      db.query
        .mockResolvedValueOnce([mockBarangays])
        .mockResolvedValueOnce([mockAggregations]);

      const result = await assessmentModel.getBarangayMapData();

      expect(result).toHaveLength(2);

      const brgy1 = result.find(b => b.name === 'Barangay 1');
      expect(brgy1.riskLevel).toBe('Low Risk');
      expect(brgy1.color).toBe('#22c55e');
      expect(brgy1.status.normal).toBe(9);
      expect(brgy1.status.stunted).toBe(1);
      expect(brgy1.status.obese).toBe(0);
      expect(brgy1.cases).toBe(1);

      const brgy2 = result.find(b => b.name === 'Barangay 2');
      expect(brgy2.riskLevel).toBe('High Risk');
      expect(brgy2.color).toBe('#ef4444');
      expect(brgy2.cases).toBe(7);
      expect(brgy2.registeredChildren).toBe(10);
    });

    it('should handle a barangay with no children data', async () => {
      const mockBarangays = [
        { id: 1, name: 'Barangay Unknown', lat: 13.94, lng: 120.73 }
      ];
      db.query
        .mockResolvedValueOnce([mockBarangays])
        .mockResolvedValueOnce([[]]);

      const result = await assessmentModel.getBarangayMapData();
      expect(result[0].registeredChildren).toBe(0);
      expect(result[0].cases).toBe(0);
      expect(result[0].riskLevel).toBe('Low Risk');
    });
  });
});
