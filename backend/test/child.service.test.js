import { describe, it, expect, vi, beforeEach } from 'vitest';
import childService from '../src/service/child.service.js';
import childModel from '../src/models/child.model.js';

vi.mock('../src/models/child.model.js', () => ({
  default: {
    getAllChildrenRecords: vi.fn(),
  }
}));

describe('Child Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchFilterOptions', () => {
    it('should successfully extract unique filter options from raw database records', async () => {
      const mockDatabaseRecords = [
        { id: 1, barangay: 'Barangay A', ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: null, wfhlStatus: null },
        { id: 2, barangay: 'Barangay B', ageGroup: '6-11 Months', wfaStatus: null, hfaStatus: 'Stunted', wfhlStatus: null },
        { id: 3, barangay: 'Barangay A', ageGroup: '0-5 Months', wfaStatus: null, hfaStatus: null, wfhlStatus: 'Wasted' }
      ];

      childModel.getAllChildrenRecords.mockResolvedValue(mockDatabaseRecords);

      const result = await childService.fetchFilterOptions();

      expect(childModel.getAllChildrenRecords).toHaveBeenCalledTimes(1);
      
      expect(result.barangays).toEqual([
        { label: 'All Barangays', value: 'all' },
        { label: 'Barangay A', value: 'Barangay A' },
        { label: 'Barangay B', value: 'Barangay B' }
      ]);

      expect(result.ages).toEqual([
        { label: 'All Ages', value: 'all' },
        { label: '0-5 Months', value: '0-5 Months' },
        { label: '6-11 Months', value: '6-11 Months' }
      ]);

      expect(result.nutritionalIndicators).toEqual([
        { label: 'All Indicators', value: 'all' },
        { label: 'Weight-for-Age (WFA)', value: 'wfa' },
        { label: 'Height-for-Age (HFA)', value: 'hfa' },
        { label: 'Weight-for-Length/Height (WFH/L)', value: 'wfhl' }
      ]);
    });

    it('should conditionally include only the nutritional indicators present in the data', async () => {
      const partialIndicatorRecords = [
        { id: 1, barangay: 'Barangay A', ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: null, wfhlStatus: null }
      ];

      childModel.getAllChildrenRecords.mockResolvedValue(partialIndicatorRecords);

      const result = await childService.fetchFilterOptions();

      expect(result.nutritionalIndicators).toEqual([
        { label: 'All Indicators', value: 'all' },
        { label: 'Weight-for-Age (WFA)', value: 'wfa' }
      ]);
    });

    it('should return default "All" options if the database returns an empty array', async () => {
      childModel.getAllChildrenRecords.mockResolvedValue([]);

      const result = await childService.fetchFilterOptions();

      expect(result.barangays).toEqual([{ label: 'All Barangays', value: 'all' }]);
      expect(result.ages).toEqual([{ label: 'All Ages', value: 'all' }]);
      expect(result.nutritionalIndicators).toEqual([{ label: 'All Indicators', value: 'all' }]);
    });

    it('should filter out null, undefined, or empty values in the raw data', async () => {
      const dirtyDatabaseRecords = [
        { id: 1, barangay: null, ageGroup: '0-5 Months' },
        { id: 2, barangay: 'Barangay A', ageGroup: undefined },
        { id: 3, barangay: 'Barangay A', ageGroup: '0-5 Months' },
        { id: 4, barangay: '', ageGroup: '' }
      ];

      childModel.getAllChildrenRecords.mockResolvedValue(dirtyDatabaseRecords);

      const result = await childService.fetchFilterOptions();

      expect(result.barangays).toEqual([
        { label: 'All Barangays', value: 'all' },
        { label: 'Barangay A', value: 'Barangay A' }
      ]);
      expect(result.ages).toEqual([
        { label: 'All Ages', value: 'all' },
        { label: '0-5 Months', value: '0-5 Months' }
      ]);
    });

    it('should throw an error if the database returns null or undefined instead of an array', async () => {
      childModel.getAllChildrenRecords.mockResolvedValue(null);

      await expect(childService.fetchFilterOptions()).rejects.toThrow('Failed to retrieve child records from the database');
    });

    it('should handle and throw errors when the database query fails', async () => {
      const errorMessage = 'Database connection lost';
      childModel.getAllChildrenRecords.mockRejectedValue(new Error(errorMessage));

      await expect(childService.fetchFilterOptions()).rejects.toThrow(errorMessage);
    });
  });

  describe('calculateNutritionalTotals', () => {
    it('should successfully compute totals for healthy, deficit, and excess cases', async () => {
      const mockRecords = [
        { id: 1, classification: 'healthy' },
        { id: 2, classification: 'healthy' },
        { id: 3, classification: 'deficit' },
        { id: 4, classification: 'excess' },
        { id: 5, classification: 'excess' }
      ];

      childModel.getAllChildrenRecords.mockResolvedValue(mockRecords);

      const result = await childService.calculateNutritionalTotals();

      expect(childModel.getAllChildrenRecords).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        healthy: 2,
        deficit: 1,
        excess: 2
      });
    });

    it('should return zeros for all categories if the database returns an empty array', async () => {
      childModel.getAllChildrenRecords.mockResolvedValue([]);

      const result = await childService.calculateNutritionalTotals();

      expect(result).toEqual({
        healthy: 0,
        deficit: 0,
        excess: 0
      });
    });

    it('should handle case insensitivity and ignore unmapped classifications or malformed data', async () => {
      const dirtyRecords = [
        { id: 1, classification: 'HEALTHY' },
        { id: 2, classification: 'Deficit' },
        { id: 3, classification: null },
        { id: 4, classification: undefined },
        { id: 5, classification: 'unknown_status' },
        { id: 6 } 
      ];

      childModel.getAllChildrenRecords.mockResolvedValue(dirtyRecords);

      const result = await childService.calculateNutritionalTotals();

      expect(result).toEqual({
        healthy: 1,
        deficit: 1,
        excess: 0
      });
    });

    it('should throw an error if the database returns null or undefined instead of an array', async () => {
      childModel.getAllChildrenRecords.mockResolvedValue(null);

      await expect(childService.calculateNutritionalTotals()).rejects.toThrow(
        'Failed to retrieve child records from the database'
      );
    });

    it('should handle and throw errors when the database query fails entirely', async () => {
      const errorMessage = 'Database connection timed out';
      childModel.getAllChildrenRecords.mockRejectedValue(new Error(errorMessage));

      await expect(childService.calculateNutritionalTotals()).rejects.toThrow(errorMessage);
    });
  });
});