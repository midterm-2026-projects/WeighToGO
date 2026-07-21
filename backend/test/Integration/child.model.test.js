import { describe, it, expect, vi, beforeEach } from 'vitest';
import childModel from '../../src/models/child.model.js';

vi.mock('../../src/config/db.js', () => ({
  default: {
    query: vi.fn()
  }
}));

import db from '../../src/config/db.js';

describe('Child Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllChildrenRecords', () => {
    it('should return all children ordered by created_at DESC', async () => {
      const mockRows = [
        { id: 2, name: 'CHILD B', barangay: 'Brgy. Navotas' },
        { id: 1, name: 'CHILD A', barangay: 'Brgy. Caloocan' }
      ];
      db.query.mockResolvedValue([mockRows]);

      const result = await childModel.getAllChildrenRecords();
      expect(result).toEqual(mockRows);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM children ORDER BY created_at DESC');
    });

    it('should return an empty array when no children exist', async () => {
      db.query.mockResolvedValue([[]]);

      const result = await childModel.getAllChildrenRecords();
      expect(result).toEqual([]);
    });
  });

  describe('getChildById', () => {
    it('should return a child by id', async () => {
      const mockChild = { id: 1, name: 'CHILD A', barangay: 'Brgy. Navotas' };
      db.query.mockResolvedValue([[mockChild]]);

      const result = await childModel.getChildById(1);
      expect(result).toEqual(mockChild);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM children WHERE id = ?', [1]);
    });

    it('should return null when child does not exist', async () => {
      db.query.mockResolvedValue([[]]);

      const result = await childModel.getChildById(999);
      expect(result).toBeNull();
    });
  });

  describe('createChildRecord', () => {
    it('should insert a new child and return the created record', async () => {
      const mockPayload = {
        name: 'TEST CHILD',
        barangay: 'Brgy. Navotas',
        purok: 'Purok 1',
        parent_name: 'PARENT NAME',
        age_months: 12,
        gender: 'Male',
        birthdate: '2025-01-01'
      };
      db.query
        .mockResolvedValueOnce([{ insertId: 21 }])
        .mockResolvedValueOnce([[{ id: 21, ...mockPayload }]]);

      const result = await childModel.createChildRecord(mockPayload);
      expect(result.id).toBe(21);
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(db.query.mock.calls[0][0]).toContain('INSERT INTO children');
    });

    it('should use default values for optional fields', async () => {
      const mockPayload = {
        name: 'TEST CHILD',
        barangay: 'Brgy. Navotas',
        purok: 'Purok 1',
        parent_name: 'PARENT NAME',
        age_months: 6,
        gender: 'Female',
        birthdate: '2026-01-01'
      };
      db.query
        .mockResolvedValueOnce([{ insertId: 22 }])
        .mockResolvedValueOnce([[{ id: 22 }]]);

      await childModel.createChildRecord(mockPayload);
      const insertParams = db.query.mock.calls[0][1];
      expect(insertParams[7]).toBe('Normal');
      expect(insertParams[8]).toBe('Normal');
      expect(insertParams[9]).toBe('Normal');
      expect(insertParams[10]).toBe('normal');
    });
  });

  describe('filterChildMasterlist', () => {
    it('should return all children when no filters are applied', async () => {
      const mockRows = [{ id: 1 }, { id: 2 }];
      db.query.mockResolvedValue([mockRows]);

      const result = await childModel.filterChildMasterlist('All', 'All', 'All');
      expect(result).toHaveLength(2);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at DESC'),
        []
      );
    });

    it('should filter by barangay when provided', async () => {
      db.query.mockResolvedValue([[{ id: 1, barangay: 'Brgy. Navotas' }]]);

      const result = await childModel.filterChildMasterlist('Brgy. Navotas', 'All', 'All');
      expect(result).toHaveLength(1);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND barangay = ?'),
        ['Brgy. Navotas']
      );
    });

    it('should filter by age group 0-11 Months', async () => {
      db.query.mockResolvedValue([[]]);

      await childModel.filterChildMasterlist('All', '0-11 Months', 'All');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND age_months >= ? AND age_months <= ?'),
        [0, 11]
      );
    });

    it('should filter by age group 12-23 Months', async () => {
      db.query.mockResolvedValue([[]]);

      await childModel.filterChildMasterlist('All', '12-23 Months', 'All');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND age_months >= ? AND age_months <= ?'),
        [12, 23]
      );
    });

    it('should filter by age group 24-59 Months', async () => {
      db.query.mockResolvedValue([[]]);

      await childModel.filterChildMasterlist('All', '24-59 Months', 'All');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND age_months >= ? AND age_months <= ?'),
        [24, 59]
      );
    });

    it('should filter by classification', async () => {
      db.query.mockResolvedValue([[]]);

      await childModel.filterChildMasterlist('All', 'All', 'stunted');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND classification = ?'),
        ['stunted']
      );
    });

    it('should apply barangay, age, and classification filters together', async () => {
      db.query.mockResolvedValue([[]]);

      await childModel.filterChildMasterlist('Brgy. Navotas', '12-23 Months', 'normal');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND barangay = ?'),
        expect.arrayContaining(['Brgy. Navotas', 12, 23, 'normal'])
      );
    });
  });

  describe('updateChildAssessment', () => {
    it('should update child assessment and insert into assessments table', async () => {
      const mockChild = { id: 1, wfa_status: 'Normal', hfa_status: 'Normal', wfhl_status: 'Normal', classification: 'normal' };
      const mockUpdate = { weight: 10.5, height: 75.0, wfa_status: 'Normal', hfa_status: 'Stunted', wfhl_status: 'Normal', classification: 'stunted' };

      db.query
        .mockResolvedValueOnce([[mockChild]])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([[{ ...mockChild, ...mockUpdate }]]);

      const result = await childModel.updateChildAssessment(1, mockUpdate);
      expect(db.query).toHaveBeenCalledTimes(4);
      expect(db.query.mock.calls[1][0]).toContain('UPDATE children SET');
      expect(db.query.mock.calls[2][0]).toContain('INSERT INTO assessments');
    });

    it('should return null when child does not exist', async () => {
      db.query.mockResolvedValue([[]]);

      const result = await childModel.updateChildAssessment(999, { weight: 10 });
      expect(result).toBeNull();
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('getChildAssessmentHistory', () => {
    it('should return assessments ordered by year DESC and month', async () => {
      const mockRows = [
        { id: 2, child_id: 1, month: 'Feb', year: 2026 },
        { id: 1, child_id: 1, month: 'Jan', year: 2026 }
      ];
      db.query.mockResolvedValue([mockRows]);

      const result = await childModel.getChildAssessmentHistory(1);
      expect(result).toEqual(mockRows);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM assessments WHERE child_id = ?'),
        [1]
      );
    });
  });

  describe('getMonthlyReportData', () => {
    it('should return report data for a given month and year', async () => {
      const mockRows = [{ id: 1, month: 'Jan', year: 2026, weight: 10.0 }];
      db.query.mockResolvedValue([mockRows]);

      const result = await childModel.getMonthlyReportData('Jan', 2026);
      expect(result).toEqual(mockRows);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM assessments WHERE month = ? AND year = ?',
        ['Jan', 2026]
      );
    });
  });

  describe('getChildrenByBarangay', () => {
    it('should return children for a specific barangay', async () => {
      const mockRows = [{ id: 1, barangay: 'Brgy. Navotas' }, { id: 2, barangay: 'Brgy. Navotas' }];
      db.query.mockResolvedValue([mockRows]);

      const result = await childModel.getChildrenByBarangay('Brgy. Navotas');
      expect(result).toHaveLength(2);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM children WHERE barangay = ?', ['Brgy. Navotas']);
    });
  });

  describe('countAll', () => {
    it('should return total count of children', async () => {
      db.query.mockResolvedValue([[{ count: 20 }]]);

      const result = await childModel.countAll();
      expect(result).toBe(20);
    });
  });

  describe('countByClassification', () => {
    it('should return counts grouped by classification', async () => {
      const mockRows = [
        { classification: 'normal', count: 10 },
        { classification: 'stunted', count: 6 },
        { classification: 'obese', count: 4 }
      ];
      db.query.mockResolvedValue([mockRows]);

      const result = await childModel.countByClassification();
      expect(result.total).toBe(20);
      expect(result.normal).toBe(10);
      expect(result.stunted).toBe(6);
      expect(result.obese).toBe(4);
    });
  });

  describe('countFilteredTotals', () => {
    it('should return unfiltered totals when no filters applied', async () => {
      const mockRows = [
        { classification: 'normal', count: 10 },
        { classification: 'stunted', count: 10 }
      ];
      db.query.mockResolvedValue([mockRows]);

      const result = await childModel.countFilteredTotals('all', 'all');
      expect(result.total).toBe(20);
      expect(result.normal).toBe(10);
      expect(result.stunted).toBe(10);
    });

    it('should filter by barangay', async () => {
      db.query.mockResolvedValue([[{ classification: 'normal', count: 5 }]]);

      await childModel.countFilteredTotals('Brgy. Navotas', 'all');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND barangay = ?'),
        ['Brgy. Navotas']
      );
    });

    it('should filter by age group', async () => {
      db.query.mockResolvedValue([[{ classification: 'normal', count: 3 }]]);

      await childModel.countFilteredTotals('all', '0-11 Months');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('AND age_months >= ? AND age_months <= ?'),
        [0, 11]
      );
    });
  });
});
