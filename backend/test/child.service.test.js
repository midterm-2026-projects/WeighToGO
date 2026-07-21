import { describe, it, expect, vi, beforeEach } from 'vitest';
import childService from '../src/service/child.service.js';
import childModel from '../src/models/child.model.js';

vi.mock('../src/models/child.model.js', () => ({
  default: {
    getAllChildrenRecords: vi.fn(),
    createChildRecord: vi.fn(),
    filterChildMasterlist: vi.fn(),
    getMonthlyReportData: vi.fn(),
    updateChildAssessment: vi.fn(),
    getChildById: vi.fn(),
    countByClassification: vi.fn()
  }
}));

describe('Child Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchFilterOptions', () => {
    it('should successfully extract unique filter options from raw database records', async () => {
      const mockDatabaseRecords = [
        { id: 1, barangay: 'Barangay A', age_months: 3, wfa_status: 'Normal', hfa_status: null, wfhl_status: null },
        { id: 2, barangay: 'Barangay B', age_months: 8, wfa_status: null, hfa_status: 'Stunted', wfhl_status: null },
        { id: 3, barangay: 'Barangay A', age_months: 3, wfa_status: null, hfa_status: null, wfhl_status: 'Wasted' }
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
        { label: '0-11 Months', value: '0-11 Months' }
      ]);

      expect(result.nutritionalIndicators).toEqual([
        { label: 'All Indicators', value: 'all' },
        { label: 'Weight-for-Age (WFA)', value: 'wfa' },
        { label: 'Height-for-Age (HFA)', value: 'hfa' },
        { label: 'Weight-for-Length/Height (WFH/L)', value: 'wfhl' }
      ]);
    });
  });

  describe('calculateNutritionalTotals', () => {
    it('should successfully compute totals for normal, stunted, and obese cases', async () => {
      childModel.countByClassification.mockResolvedValue({ normal: 2, stunted: 1, obese: 1 });

      const result = await childService.calculateNutritionalTotals();

      expect(childModel.countByClassification).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ normal: 2, stunted: 1, obese: 1 });
    });
  });

  describe('fetchMasterlist', () => {
    it('should retrieve the complete array of child records', async () => {
      const mockRecords = [{ id: 1, name: 'Juan', barangay: 'Brgy 1' }];
      childModel.getAllChildrenRecords.mockResolvedValue(mockRecords);

      const result = await childService.fetchMasterlist();
      expect(result).toEqual(mockRecords);
    });

    it('should throw an error if the database query fails', async () => {
      childModel.getAllChildrenRecords.mockRejectedValue(new Error('DB Error'));
      await expect(childService.fetchMasterlist()).rejects.toThrow('DB Error');
    });
  });

  describe('registerChild', () => {
    it('should successfully validate payload and call database creation method', async () => {
      const validPayload = {
        name: 'Jane Doe',
        barangay: 'Barangay 1',
        purok: 'Purok 2',
        parent_name: 'John Doe',
        age_months: 12,
        gender: 'Female',
        birthdate: '2025-01-01'
      };

      const mockDbResponse = { id: 99, ...validPayload };
      childModel.createChildRecord.mockResolvedValue(mockDbResponse);

      const result = await childService.registerChild(validPayload);
      expect(result).toEqual(mockDbResponse);
    });

    it('should reject requests missing required fields', async () => {
      const invalidPayload = { name: 'Jane Doe', barangay: 'Barangay 1' };
      await expect(childService.registerChild(invalidPayload)).rejects.toThrow('Missing required fields');
    });
  });

  describe('generateMonthlyReport', () => {
    it('should accurately calculate Total Registered, Normal, Stunted, and Obese counts', async () => {
      const mockMonthlyRecords = [
        { id: 1, classification: 'normal' },
        { id: 2, classification: 'stunted' },
        { id: 3, classification: 'obese' },
        { id: 4, classification: 'normal' }
      ];

      childModel.getMonthlyReportData.mockResolvedValue(mockMonthlyRecords);

      const report = await childService.generateMonthlyReport('Jul', 2026);

      expect(childModel.getMonthlyReportData).toHaveBeenCalledWith('Jul', 2026);
      expect(report.summary).toEqual({
        totalRegistered: 4,
        normal: 2,
        stunted: 1,
        obese: 1
      });
    });

    it('should throw an error if month or year are not provided', async () => {
      await expect(childService.generateMonthlyReport(null, 2026)).rejects.toThrow();
      await expect(childService.generateMonthlyReport(7, null)).rejects.toThrow();
    });
  });

  describe('filterChildMasterlist', () => {
    it('should throw an error if the selected Barangay is not on the masterlist configuration', async () => {
      await expect(childService.filterChildMasterlist('Brgy. NonExistent', 'All', 'All')).rejects.toThrow('Invalid Barangay selection');
    });

    it('should throw an error if the nutritional status option is invalid', async () => {
      await expect(childService.filterChildMasterlist('Brgy. Navotas', 'All', 'Severe')).rejects.toThrow('Invalid Nutritional Status selection');
    });
  });

  describe('Component Integration Testing', () => {
    it('should fetch a specific child record to populate the Dynamic Profile Modal', async () => {
      const mockChildProfile = { id: 3, name: 'Mark Santos', classification: 'stunted', wfa_status: 'Severe Underweight' };
      childModel.getChildById.mockResolvedValue(mockChildProfile);

      const profile = await childService.fetchChildProfile(3);
      expect(profile).toEqual(mockChildProfile);
    });

    it('should throw an error if attempting to fetch a profile without an ID or if profile is not found', async () => {
      await expect(childService.fetchChildProfile(null)).rejects.toThrow('Child ID is required');
      childModel.getChildById.mockResolvedValue(null);
      await expect(childService.fetchChildProfile(999)).rejects.toThrow('Child profile not found');
    });

    it('should sync and accurately reflect simulated database updates', async () => {
      childModel.countByClassification.mockResolvedValueOnce({ normal: 2, stunted: 0, obese: 0 });
      const initialTotals = await childService.calculateNutritionalTotals();
      expect(initialTotals.normal).toBe(2);

      childModel.countByClassification.mockResolvedValueOnce({ normal: 1, stunted: 1, obese: 0 });
      const updatedTotals = await childService.calculateNutritionalTotals();
      expect(updatedTotals.normal).toBe(1);
      expect(updatedTotals.stunted).toBe(1);
    });
  });
});
