import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/config/db.js', () => ({
  default: { query: vi.fn() }
}));

import db from '../../src/config/db.js';
import { findAdminByEmailAndRole, findUserById } from '../../src/models/loginModel.js';

describe('Login Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findAdminByEmailAndRole', () => {
    it('should return a user when email and role match', async () => {
      const mockUser = {
        id: 1,
        email: 'user@health.gov.ph',
        role: 'Administrator (Admin)',
        password: 'Balayan2026!'
      };
      db.query.mockResolvedValue([[mockUser]]);

      const result = await findAdminByEmailAndRole('user@health.gov.ph', 'Administrator (Admin)');
      expect(result).toEqual(mockUser);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ? AND role = ?',
        ['user@health.gov.ph', 'Administrator (Admin)']
      );
    });

    it('should return null when no user matches', async () => {
      db.query.mockResolvedValue([[]]);

      const result = await findAdminByEmailAndRole('nobody@health.gov.ph', 'Administrator (Admin)');
      expect(result).toBeNull();
    });

    it('should return null when role does not match', async () => {
      db.query.mockResolvedValue([[]]);

      const result = await findAdminByEmailAndRole('user@health.gov.ph', 'Barangay Nutrition Scholar');
      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should return user details by id', async () => {
      const mockUser = {
        id: 1,
        role: 'Administrator (Admin)',
        email: 'user@health.gov.ph',
        assigned_barangay: null
      };
      db.query.mockResolvedValue([[mockUser]]);

      const result = await findUserById(1);
      expect(result).toEqual(mockUser);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT id, role, email, assigned_barangay FROM users WHERE id = ?',
        [1]
      );
    });

    it('should return null for non-existent user id', async () => {
      db.query.mockResolvedValue([[]]);

      const result = await findUserById(999);
      expect(result).toBeNull();
    });

    it('should return BNS user with assigned barangay', async () => {
      const mockUser = {
        id: 2,
        role: 'Barangay Nutrition Scholar',
        email: 'bns@health.gov.ph',
        assigned_barangay: 'Brgy. Navotas'
      };
      db.query.mockResolvedValue([[mockUser]]);

      const result = await findUserById(2);
      expect(result.assigned_barangay).toBe('Brgy. Navotas');
    });
  });
});
