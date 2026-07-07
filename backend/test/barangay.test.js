import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as barangayService from '../src/service/barangay.service.js';
import * as barangayModel from '../src/models/barangay.model.js';

vi.mock('../src/models/barangay.model.js', () => ({
  getBarangays: vi.fn(),
}));

describe('Barangay Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchBarangayOptions', () => {
    it('should correctly retrieve available barangay filter options', async () => {
      const expectedOptions = [{ label: 'All Barangays', value: 'all' }];

      barangayModel.getBarangays.mockResolvedValue(expectedOptions);

      const result = await barangayService.fetchBarangayOptions();

      expect(barangayModel.getBarangays).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedOptions);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle and throw errors when filter retrieval fails', async () => {
      const errorMessage = 'Failed to fetch options';
      barangayModel.getBarangays.mockRejectedValue(new Error(errorMessage));

      await expect(barangayService.fetchBarangayOptions()).rejects.toThrow(errorMessage);
    });
  });
});
