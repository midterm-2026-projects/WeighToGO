import * as kpiModel from '../models/kpi.model.js';

export const fetchKpiMetrics = async (filters) => {
  const totals = await kpiModel.getKpiTotals(filters);
  
  if (!totals) {
    throw new Error('Failed to retrieve KPI metrics data');
  }
  
  return totals;
};