import { describe, it, expect, vi, beforeEach } from 'vitest';
import childService from '../src/service/child.service.js';
import childModel from '../src/models/child.model.js';

vi.mock('../src/models/child.model.js', () => ({
  default: {
    getAllChildrenRecords: vi.fn(),
    createChildRecord: vi.fn(),
    getFilteredChildren: vi.fn()
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
    });
  });

  describe('calculateNutritionalTotals', () => {
    it('should successfully compute totals for healthy, deficit, and excess cases', async () => {
      const mockRecords = [
        { id: 1, classification: 'healthy' },
        { id: 2, classification: 'healthy' },
        { id: 3, classification: 'deficit' },
        { id: 4, classification: 'excess' }
      ];

      childModel.getAllChildrenRecords.mockResolvedValue(mockRecords);

      const result = await childService.calculateNutritionalTotals();

      expect(childModel.getAllChildrenRecords).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        healthy: 2,
        deficit: 1,
        excess: 1
      });
    });
  });

  describe('fetchMasterlist', () => {
    it('should retrieve the complete array of child records', async () => {
      const mockRecords = [{ id: 1, name: 'Juan', barangay: 'Brgy 1' }];
      childModel.getAllChildrenRecords.mockResolvedValue(mockRecords);

      const result = await childService.fetchMasterlist();

      expect(childModel.getAllChildrenRecords).toHaveBeenCalledTimes(1);
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
        parents: 'John Doe',
        age: 12
      };

      const mockDbResponse = { id: 99, ...validPayload };
      childModel.createChildRecord.mockResolvedValue(mockDbResponse);

      const result = await childService.registerChild(validPayload);

      expect(childModel.createChildRecord).toHaveBeenCalledWith(validPayload);
      expect(result).toEqual(mockDbResponse);
    });

    it('should reject requests missing required fields', async () => {
      const invalidPayload = {
        name: 'Jane Doe',
        barangay: 'Barangay 1'
      };

      await expect(childService.registerChild(invalidPayload)).rejects.toThrow('Missing required fields for child registration');
      expect(childModel.createChildRecord).not.toHaveBeenCalled();
    });

    it('should throw an error if database insertion returns falsy', async () => {
      const validPayload = {
        name: 'Jane Doe',
        barangay: 'Barangay 1',
        purok: 'Purok 2',
        parents: 'John Doe',
        age: 12
      };

      childModel.createChildRecord.mockResolvedValue(null);

      await expect(childService.registerChild(validPayload)).rejects.toThrow('Database insertion failed');
    });
  });

  describe('filterChildMasterlist', () => {
    it('should throw an error if the selected Barangay is not on the masterlist configuration', async () => {
      const invalidBarangay = 'Brgy. NonExistent';
      const defaultAge = 'All';
      const defaultStatus = 'All';

      const result = childService.filterChildMasterlist(invalidBarangay, defaultAge, defaultStatus);

      await expect(result).rejects.toThrow('Invalid Barangay selection');
    });

    it('should throw an error if the age group value format selection does not exist', async () => {
      const defaultBarangay = 'All';
      const invalidAgeGroup = '60+ Months';
      const defaultStatus = 'All';

      const result = childService.filterChildMasterlist(defaultBarangay, invalidAgeGroup, defaultStatus);

      await expect(result).rejects.toThrow('Invalid Nutritional Age Group selection');
    });

    it('should throw an error if the selected nutritional status option is invalid', async () => {
      const validBarangay = 'Brgy. Navotas';
      const defaultAge = 'All';
      const invalidStatus = 'Severe';

      const result = childService.filterChildMasterlist(validBarangay, defaultAge, invalidStatus);

      await expect(result).rejects.toThrow('Invalid Nutritional Status selection');
    });
  });

  describe('fetchFilteredMasterlist', () => {
    const sampleRecords = [
      { id: 1, name: 'Juan Dela Cruz', barangay: 'Barangay 1', ageGroup: '12-59 Months' },
      { id: 2, name: 'Anna Reyes', barangay: 'Barangay 2', ageGroup: '6-11 Months' },
      { id: 3, name: 'Mark Santos', barangay: 'Barangay 1', ageGroup: '12-59 Months' }
    ];

    it('should narrow down records based on search input keywords', async () => {
      childModel.getAllChildrenRecords.mockResolvedValue(sampleRecords);

      const result = await childService.fetchFilteredMasterlist({ search: 'anna' });
      expect(result).toEqual([sampleRecords[1]]);
    });

    it('should filter datasets using dropdown criteria options', async () => {
      childModel.getAllChildrenRecords.mockResolvedValue(sampleRecords);

      const result = await childService.fetchFilteredMasterlist({ barangay: 'Barangay 1', ageGroup: '12-59 Months' });
      expect(result).toEqual([sampleRecords[0], sampleRecords[2]]);
    });

    it('should return all available records if parameters are empty or set to all', async () => {
      childModel.getAllChildrenRecords.mockResolvedValue(sampleRecords);

      const result = await childService.fetchFilteredMasterlist({ barangay: 'all', ageGroup: 'all' });
      expect(result).toEqual(sampleRecords);
    });
  });
});