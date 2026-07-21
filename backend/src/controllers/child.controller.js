import childService from '../service/child.service.js';

export async function getAllChildren(req, res) {
  try {
    const { barangay, ageGroup, status } = req.query;
    if (barangay || ageGroup || status) {
      const children = await childService.filterChildMasterlist(barangay, ageGroup, status);
      return res.json({ success: true, data: children });
    }
    const children = await childService.fetchMasterlist();
    res.json({ success: true, data: children });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getChildById(req, res) {
  try {
    const child = await childService.fetchChildProfile(req.params.id);
    res.json({ success: true, data: child });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
}

export async function registerChild(req, res) {
  try {
    const child = await childService.registerChild(req.body);
    res.status(201).json({ success: true, data: child });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function submitAssessment(req, res) {
  try {
    const updated = await childService.submitChildAssessment(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function getChildHistory(req, res) {
  try {
    const history = await childService.fetchChildHistory(req.params.id);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getFilterOptions(req, res) {
  try {
    const options = await childService.fetchFilterOptions();
    res.json({ success: true, data: options });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getNutritionalTotals(req, res) {
  try {
    const { barangay, ageGroup } = req.query;
    if (barangay || ageGroup) {
      const totals = await childService.calculateFilteredTotals(barangay, ageGroup);
      return res.json({ success: true, data: totals });
    }
    const totals = await childService.calculateNutritionalTotals();
    res.json({ success: true, data: totals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
