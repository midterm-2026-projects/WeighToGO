import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as ageGroupService from '../src/service/ageGroup.service.js';
import * as ageGroupModel from '../src/models/ageGroup.model.js';

vi.mock('../src/models/ageGroup.model.js', () => ({
  getAgeGroups: vi.fn(),
}));

describe('Age Group Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAgeGroupOptions', () => {
    it('should correctly retrieve available age group filter options', async () => {
      const expectedOptions = [{ label: 'All Ages', value: 'all' }];

      ageGroupModel.getAgeGroups.mockResolvedValue(expectedOptions);

      const result = await ageGroupService.fetchAgeGroupOptions();

      expect(ageGroupModel.getAgeGroups).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedOptions);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle and throw errors when filter retrieval fails', async () => {
      const errorMessage = 'Failed to fetch options';
      ageGroupModel.getAgeGroups.mockRejectedValue(new Error(errorMessage));

      await expect(ageGroupService.fetchAgeGroupOptions()).rejects.toThrow(errorMessage);
    });
  });
});