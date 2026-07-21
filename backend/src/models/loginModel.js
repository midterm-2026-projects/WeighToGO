import db from '../config/db.js';

export async function findAdminByEmailAndRole(email, role) {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? AND role = ?',
    [email, role]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await db.query('SELECT id, role, email, assigned_barangay FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}
