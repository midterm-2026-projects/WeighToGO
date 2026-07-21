import childService from '../service/child.service.js';
import getReports from '../service/analyticsService.js';

export async function getMonthlyReport(req, res) {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ success: false, error: 'Month and year are required' });
    }
    const report = await childService.generateMonthlyReport(month, year);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getHealthReport(req, res) {
  try {
    const reports = await getReports(req.token);
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
}

export async function getMasterlistReport(req, res) {
  try {
    const children = await childService.fetchMasterlist();
    res.json({ success: true, data: children });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
