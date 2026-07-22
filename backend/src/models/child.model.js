import db from '../config/db.js';

export default {
  async getAllChildrenRecords() {
    const [rows] = await db.query('SELECT * FROM children ORDER BY created_at DESC');
    return rows;
  },

  async getChildById(id) {
    const [rows] = await db.query('SELECT * FROM children WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async createChildRecord(payload) {
    const [result] = await db.query(
      `INSERT INTO children (name, barangay, purok, parent_name, age_months, gender, birthdate, wfa_status, hfa_status, wfhl_status, classification, weight, height)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.name, payload.barangay, payload.purok, payload.parent_name,
        payload.age_months, payload.gender, payload.birthdate,
        payload.wfa_status || 'Normal', payload.hfa_status || 'Normal',
        payload.wfhl_status || 'Normal', payload.classification || 'normal',
        payload.weight || null, payload.height || null
      ]
    );
    return this.getChildById(result.insertId);
  },

  async filterChildMasterlist(barangay, ageGroup, classification, name, purok, checkupStatus) {
    let query = 'SELECT * FROM children WHERE 1=1';
    const params = [];

    if (barangay && barangay !== 'All' && barangay !== 'all') {
      query += ' AND barangay = ?';
      params.push(barangay);
    }

    if (ageGroup && ageGroup !== 'All' && ageGroup !== 'all') {
      query += ' AND age_months >= ? AND age_months <= ?';
      if (ageGroup === '0-11 Months') { params.push(0, 11); }
      else if (ageGroup === '12-23 Months') { params.push(12, 23); }
      else if (ageGroup === '24-59 Months') { params.push(24, 59); }
    }

    if (classification && classification !== 'All' && classification !== 'all') {
      query += ' AND classification = ?';
      params.push(classification);
    }

    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }

    if (purok) {
      query += ' AND purok = ?';
      params.push(purok);
    }

    if (checkupStatus && checkupStatus !== 'all') {
      query += ' AND checkup_status = ?';
      params.push(checkupStatus);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  async hasAssessmentThisMonth(childId, month, year) {
    const [rows] = await db.query(
      'SELECT id FROM assessments WHERE child_id = ? AND month = ? AND year = ? LIMIT 1',
      [childId, month, year]
    );
    return rows.length > 0;
  },

  async updateChildAssessment(childId, updateData) {
    const child = await this.getChildById(childId);
    if (!child) return null;

    const month = updateData.month || new Date().toLocaleString('en-US', { month: 'short' });
    const year = updateData.year || new Date().getFullYear();

    const exists = await this.hasAssessmentThisMonth(childId, month, year);
    if (exists) {
      throw new Error(`Assessment for ${month} ${year} already exists. Cannot assess the same child twice in one month.`);
    }

    await db.query(
      `UPDATE children SET weight = ?, height = ?, wfa_status = ?, hfa_status = ?, wfhl_status = ?, classification = ? WHERE id = ?`,
      [
        updateData.weight, updateData.height,
        updateData.wfa_status || child.wfa_status,
        updateData.hfa_status || child.hfa_status,
        updateData.wfhl_status || child.wfhl_status,
        updateData.classification || child.classification,
        childId
      ]
    );

    await db.query(
      `INSERT INTO assessments (child_id, month, year, weight, height, wfa_status, hfa_status, wfhl_status, classification)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        childId, month, year,
        updateData.weight, updateData.height,
        updateData.wfa_status || child.wfa_status,
        updateData.hfa_status || child.hfa_status,
        updateData.wfhl_status || child.wfhl_status,
        updateData.classification || child.classification
      ]
    );

    await db.query(
      `UPDATE children SET checkup_status = 'Checked Up' WHERE id = ?`,
      [childId]
    );

    return this.getChildById(childId);
  },

  async getChildAssessmentHistory(childId) {
    const [rows] = await db.query(
      'SELECT * FROM assessments WHERE child_id = ? ORDER BY year DESC, FIELD(month, "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec")',
      [childId]
    );
    return rows;
  },

  async getMonthlyReportData(month, year, barangay) {
    let query = `SELECT a.*, c.name AS child_name, c.barangay, c.purok, c.parent_name, c.gender, c.age_months
      FROM assessments a
      JOIN children c ON a.child_id = c.id
      WHERE a.month = ? AND a.year = ?`;
    const params = [month, year];

    if (barangay) {
      query += ' AND c.barangay = ?';
      params.push(barangay);
    }

    query += ' ORDER BY c.name ASC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  async getChildrenByBarangay(barangay) {
    const [rows] = await db.query('SELECT * FROM children WHERE barangay = ?', [barangay]);
    return rows;
  },

  async countAll() {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM children');
    return rows[0].count;
  },

  async countByClassification() {
    const [rows] = await db.query(
      'SELECT classification, COUNT(*) as count FROM children GROUP BY classification'
    );
    const result = { total: 0, normal: 0, stunted: 0, obese: 0 };
    rows.forEach(r => {
      const cnt = Number(r.count);
      result[r.classification] = cnt;
      result.total += cnt;
    });
    return result;
  },

  async updateCheckupStatus(childId, status) {
    const validStatuses = ['Pending', 'Checked Up'];
    if (!validStatuses.includes(status)) throw new Error('Invalid checkup status');
    await db.query('UPDATE children SET checkup_status = ? WHERE id = ?', [status, childId]);
    return this.getChildById(childId);
  },

  async countFilteredTotals(barangay, ageGroup) {
    let query = 'SELECT classification, COUNT(*) as count FROM children WHERE 1=1';
    const params = [];

    if (barangay && barangay !== 'all' && barangay !== 'All') {
      query += ' AND barangay = ?';
      params.push(barangay);
    }

    if (ageGroup && ageGroup !== 'all' && ageGroup !== 'All') {
      query += ' AND age_months >= ? AND age_months <= ?';
      if (ageGroup === '0-11 Months') { params.push(0, 11); }
      else if (ageGroup === '12-23 Months') { params.push(12, 23); }
      else if (ageGroup === '24-59 Months') { params.push(24, 59); }
    }

    query += ' GROUP BY classification';
    const [rows] = await db.query(query, params);
    const result = { total: 0, normal: 0, stunted: 0, obese: 0 };
    rows.forEach(r => {
      const cnt = Number(r.count);
      result[r.classification] = cnt;
      result.total += cnt;
    });
    return result;
  }
};
