import { describe, it, expect, vi, beforeEach } from 'vitest';
import nutritionalCasesService from '../src/service/nutritionalCases.service.js';
import nutritionalCasesModel from '../src/models/nutritionalCases.model.js';

vi.mock('../src/models/nutritionalCases.model.js', () => ({
  default: {
    getAllCases: vi.fn(),
  }
}));

describe('Nutritional Cases Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

      nutritionalCasesModel.getAllCases.mockResolvedValue(mockRecords);

      const result = await nutritionalCasesService.calculateNutritionalTotals();

      expect(nutritionalCasesModel.getAllCases).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        healthy: 2,
        deficit: 1,
        excess: 2
      });
    });

    it('should return zeros for all categories if the database returns an empty array', async () => {
      nutritionalCasesModel.getAllCases.mockResolvedValue([]);

      const result = await nutritionalCasesService.calculateNutritionalTotals();

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

      nutritionalCasesModel.getAllCases.mockResolvedValue(dirtyRecords);

      const result = await nutritionalCasesService.calculateNutritionalTotals();

      expect(result).toEqual({
        healthy: 1,
        deficit: 1,
        excess: 0
      });
    });

    it('should throw an error if the database returns null or undefined instead of an array', async () => {
      nutritionalCasesModel.getAllCases.mockResolvedValue(null);

      await expect(nutritionalCasesService.calculateNutritionalTotals()).rejects.toThrow(
        'Failed to retrieve nutritional records from the database'
      );
    });

    it('should handle and throw errors when the database query fails entirely', async () => {
      const errorMessage = 'Database connection timed out';
      nutritionalCasesModel.getAllCases.mockRejectedValue(new Error(errorMessage));

      await expect(nutritionalCasesService.calculateNutritionalTotals()).rejects.toThrow(errorMessage);
    });
  });
});