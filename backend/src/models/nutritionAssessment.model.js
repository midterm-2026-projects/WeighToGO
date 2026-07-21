import db from '../config/db.js';

export default {
  async getAllAssessments() {
    const [rows] = await db.query('SELECT * FROM assessments ORDER BY FIELD(month, "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"), year');
    return rows;
  },

  async getBarangayCoordinates() {
    const [rows] = await db.query('SELECT name, lat, lng FROM barangays');
    const coords = {};
    rows.forEach(r => { coords[r.name] = { lat: r.lat, lng: r.lng }; });
    return coords;
  },

  async getNutritionalRiskAggregations() {
    const [rows] = await db.query(
      `SELECT c.barangay,
              COUNT(*) as total,
              SUM(CASE WHEN c.classification = 'normal' THEN 1 ELSE 0 END) as normal,
              SUM(CASE WHEN c.classification = 'stunted' THEN 1 ELSE 0 END) as stunted,
              SUM(CASE WHEN c.classification = 'obese' THEN 1 ELSE 0 END) as obese
       FROM children c
       GROUP BY c.barangay`
    );
    const aggregated = {};
    rows.forEach(r => {
      aggregated[r.barangay] = {
        total: r.total,
        normal: r.normal,
        stunted: r.stunted,
        obese: r.obese
      };
    });
    return aggregated;
  },

  async getAssessmentsByBarangay(barangayName) {
    const [rows] = await db.query(
      `SELECT a.*, c.barangay FROM assessments a
       JOIN children c ON a.child_id = c.id
       WHERE c.barangay = ?`,
      [barangayName]
    );
    return rows;
  },

  async getAggregatedBarangayData() {
    const [rows] = await db.query(
      `SELECT c.barangay,
              COUNT(*) as total,
              SUM(CASE WHEN c.classification = 'normal' THEN 1 ELSE 0 END) as normal_count,
              SUM(CASE WHEN c.classification = 'stunted' THEN 1 ELSE 0 END) as stunted_count,
              SUM(CASE WHEN c.classification = 'obese' THEN 1 ELSE 0 END) as obese_count
       FROM children c
       GROUP BY c.barangay
       ORDER BY c.barangay`
    );
    return rows;
  },

  async getMonthlyTrendData() {
    const [rows] = await db.query(
      `SELECT a.month, a.classification, COUNT(*) as count
       FROM assessments a
       GROUP BY a.month, a.classification
       ORDER BY FIELD(a.month, "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"), a.classification`
    );
    return rows;
  },

  async getFilteredAssessments(barangay, ageGroup) {
    let query = `SELECT a.*, c.barangay, c.age_months FROM assessments a
                 JOIN children c ON a.child_id = c.id WHERE 1=1`;
    const params = [];

    if (barangay && barangay !== 'all' && barangay !== 'All') {
      query += ' AND c.barangay = ?';
      params.push(barangay);
    }

    if (ageGroup && ageGroup !== 'all' && ageGroup !== 'All') {
      query += ' AND c.age_months >= ? AND c.age_months <= ?';
      if (ageGroup === '0-11 Months') { params.push(0, 11); }
      else if (ageGroup === '12-23 Months') { params.push(12, 23); }
      else if (ageGroup === '24-59 Months') { params.push(24, 59); }
    }

    query += ' ORDER BY FIELD(a.month, "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"), a.year';
    const [rows] = await db.query(query, params);
    return rows;
  },

  async getFilteredBarangayBarData(month, barangay, ageGroup) {
    const params = [];

    if (month && month !== 'All') {
      let query = `SELECT c.barangay,
              COUNT(*) as total,
              SUM(CASE WHEN a.classification = 'normal' THEN 1 ELSE 0 END) as normal_count,
              SUM(CASE WHEN a.classification = 'stunted' THEN 1 ELSE 0 END) as stunted_count,
              SUM(CASE WHEN a.classification = 'obese' THEN 1 ELSE 0 END) as obese_count
       FROM assessments a
       JOIN children c ON a.child_id = c.id
       WHERE 1=1`;
      if (month !== 'All') {
        query += ' AND a.month = ?';
        params.push(month);
      }
      if (barangay && barangay !== 'all' && barangay !== 'All') {
        query += ' AND c.barangay = ?';
        params.push(barangay);
      }
      if (ageGroup && ageGroup !== 'all' && ageGroup !== 'All') {
        query += ' AND c.age_months >= ? AND c.age_months <= ?';
        if (ageGroup === '0-11 Months') { params.push(0, 11); }
        else if (ageGroup === '12-23 Months') { params.push(12, 23); }
        else if (ageGroup === '24-59 Months') { params.push(24, 59); }
      }
      query += ' GROUP BY c.barangay ORDER BY c.barangay';
      const [rows] = await db.query(query, params);
      return rows;
    }

    let query = `SELECT c.barangay,
              COUNT(*) as total,
              SUM(CASE WHEN c.classification = 'normal' THEN 1 ELSE 0 END) as normal_count,
              SUM(CASE WHEN c.classification = 'stunted' THEN 1 ELSE 0 END) as stunted_count,
              SUM(CASE WHEN c.classification = 'obese' THEN 1 ELSE 0 END) as obese_count
       FROM children c
       WHERE 1=1`;

    if (barangay && barangay !== 'all' && barangay !== 'All') {
      query += ' AND c.barangay = ?';
      params.push(barangay);
    }
    if (ageGroup && ageGroup !== 'all' && ageGroup !== 'All') {
      query += ' AND c.age_months >= ? AND c.age_months <= ?';
      if (ageGroup === '0-11 Months') { params.push(0, 11); }
      else if (ageGroup === '12-23 Months') { params.push(12, 23); }
      else if (ageGroup === '24-59 Months') { params.push(24, 59); }
    }

    query += ' GROUP BY c.barangay ORDER BY c.barangay';
    const [rows] = await db.query(query, params);
    return rows;
  },

  async getBarangayMapData() {
    const [barangays] = await db.query('SELECT * FROM barangays');
    const [aggregations] = await db.query(
      `SELECT c.barangay,
              COUNT(*) as total,
              SUM(CASE WHEN c.classification = 'normal' THEN 1 ELSE 0 END) as normal,
              SUM(CASE WHEN c.classification = 'stunted' THEN 1 ELSE 0 END) as stunted,
              SUM(CASE WHEN c.classification = 'obese' THEN 1 ELSE 0 END) as obese,
              SUM(c.weight) as total_weight,
              SUM(c.height) as total_height
       FROM children c
       GROUP BY c.barangay`
    );

    const aggMap = {};
    aggregations.forEach(a => {
      aggMap[a.barangay] = {
        total: Number(a.total),
        normal: Number(a.normal),
        stunted: Number(a.stunted),
        obese: Number(a.obese)
      };
    });

    return barangays.map(b => {
      const data = aggMap[b.name] || { total: 0, normal: 0, stunted: 0, obese: 0 };
      const cases = data.stunted + data.obese;
      const riskRatio = data.total > 0 ? cases / data.total : 0;

      let riskLevel = 'Low Risk';
      let color = '#22c55e';

      if (riskRatio >= 0.4) {
        riskLevel = 'High Risk';
        color = '#ef4444';
      } else if (riskRatio >= 0.2) {
        riskLevel = 'Moderate Risk';
        color = '#eab308';
      }

      return {
        id: b.id,
        name: b.name,
        cases,
        registeredChildren: data.total,
        status: { normal: data.normal, stunted: data.stunted, obese: data.obese },
        coordinates: { lat: Number(b.lat), lng: Number(b.lng) },
        riskLevel,
        color
      };
    });
  }
};
