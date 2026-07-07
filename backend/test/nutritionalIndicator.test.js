import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as nutritionalIndicatorService from '../src/service/nutritionalIndicator.service.js';
import * as nutritionalIndicatorModel from '../src/models/nutritionalIndicator.model.js';

vi.mock('../src/models/nutritionalIndicator.model.js', () => ({
  getNutritionalIndicators: vi.fn(),
}));

describe('Nutritional Indicator Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchNutritionalOptions', () => {
    it('should correctly retrieve available nutritional indicator filter options', async () => {
      const expectedOptions = [{ label: 'All Indicators', value: 'all' }];

      nutritionalIndicatorModel.getNutritionalIndicators.mockResolvedValue(expectedOptions);

      const result = await nutritionalIndicatorService.fetchNutritionalOptions();

      expect(nutritionalIndicatorModel.getNutritionalIndicators).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedOptions);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle and throw errors when filter retrieval fails', async () => {
      const errorMessage = 'Failed to fetch options';
      nutritionalIndicatorModel.getNutritionalIndicators.mockRejectedValue(new Error(errorMessage));

      await expect(nutritionalIndicatorService.fetchNutritionalOptions()).rejects.toThrow(errorMessage);
    });
  });
});