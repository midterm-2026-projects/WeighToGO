import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as dropdownService from '../src/service/dropdown.service.js';
import * as dropdownModel from '../src/models/dropdown.model.js';

vi.mock('../src/models/dropdown.model.js', () => ({
  getDropdownFilters: vi.fn()
}));

describe('Dropdown Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchFilterOptions', () => {
    it('should correctly retrieve available dropdown filter options', async () => {
      const expectedOptions = {
        barangays: [{ label: 'All Barangays', value: 'all' }],
        ages: [{ label: 'All Ages', value: 'all' }],
        nutritionalIndicators: [{ label: 'All Indicators', value: 'all' }]
      };
      
      dropdownModel.getDropdownFilters.mockResolvedValue(expectedOptions);

      const result = await dropdownService.fetchFilterOptions();

      expect(dropdownModel.getDropdownFilters).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedOptions);
      expect(result).toHaveProperty('barangays');
      expect(result).toHaveProperty('ages');
      expect(result).toHaveProperty('nutritionalIndicators');
    });

    it('should handle and throw errors when filter retrieval fails', async () => {
      const errorMessage = 'Failed to fetch options';
      dropdownModel.getDropdownFilters.mockRejectedValue(new Error(errorMessage));

      await expect(dropdownService.fetchFilterOptions()).rejects.toThrow(errorMessage);
    });
  });
});