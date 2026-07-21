import analyticsService from '../service/nutritionAssessment.service.js';

export async function getTrendlineFilters(req, res) {
  try {
    const filters = await analyticsService.fetchTrendlineFilters();
    res.json({ success: true, data: filters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getTrendlineData(req, res) {
  try {
    const data = await analyticsService.fetchTrendlineData(req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getBarGraphFilters(req, res) {
  try {
    const filters = await analyticsService.fetchBarGraphFilters();
    res.json({ success: true, data: filters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getBarGraphData(req, res) {
  try {
    const data = await analyticsService.fetchBarGraphData(req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getMapData(req, res) {
  try {
    const data = await analyticsService.fetchMapData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getBarangayInsights(req, res) {
  try {
    const data = await analyticsService.fetchBarangayHealthInsights(req.params.name);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
