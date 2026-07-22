import db from '../config/db.js';

export async function findAdminByEmailAndRole(email, role) {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? AND role = ?',
    [email, role]
  );
  const user = rows[0] || null;
  if (user) {
    user.assignedBarangay = user.assigned_barangay || null;
  }
  return user;
}

export async function findUserById(id) {
  const [rows] = await db.query('SELECT id, role, email, assigned_barangay FROM users WHERE id = ?', [id]);
  const user = rows[0] || null;
  if (user) {
    user.assignedBarangay = user.assigned_barangay || null;
  }
  return user;
}
