import assessmentModel from "../models/nutritionAssessment.model.js";

const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ALL_CLASSIFICATIONS = ["normal", "stunted", "obese"];

const ALL_INDIVIDUAL_STATUSES = [
  'Normal', 'Underweight', 'Severe Underweight', 'Overweight', 'Obese',
  'Stunted', 'Severe Stunted', 'Wasted', 'Severely Wasted'
];

const STATUS_COLORS = {
  'Normal': '#10b981',
  'Underweight': '#f59e0b',
  'Severe Underweight': '#ef4444',
  'Overweight': '#3b82f6',
  'Obese': '#8b5cf6',
  'Stunted': '#f97316',
  'Severe Stunted': '#dc2626',
  'Wasted': '#eab308',
  'Severely Wasted': '#b91c1c',
};

export default {
  async fetchTrendlineFilters() {
    return [
      { label: 'Normal', value: 'Normal' },
      { label: 'Underweight', value: 'Underweight' },
      { label: 'Severe Underweight', value: 'Severe Underweight' },
      { label: 'Overweight', value: 'Overweight' },
      { label: 'Obese', value: 'Obese' },
      { label: 'Stunted', value: 'Stunted' },
      { label: 'Severe Stunted', value: 'Severe Stunted' },
      { label: 'Wasted', value: 'Wasted' },
      { label: 'Severely Wasted', value: 'Severely Wasted' },
    ];
  },

  async fetchTrendlineData(filters = {}) {
    const barangay = filters.barangay || 'all';
    const ageGroup = filters.ageGroup || 'all';
    const statusType = filters.statusType || 'wfa';
    const statusesParam = filters.statuses || '';

    const activeStatuses = statusesParam
      ? statusesParam.split(',').filter(s => ALL_INDIVIDUAL_STATUSES.includes(s))
      : ['Normal', 'Underweight', 'Overweight', 'Obese'];

    const records = await assessmentModel.getFilteredAssessments(barangay, ageGroup);
    if (!records) throw new Error("Failed to retrieve nutrition assessments");

    const statusFieldMap = { wfa: 'wfa_status', hfa: 'hfa_status', wfhl: 'wfhl_status' };
    const targetFields = statusType === 'all' ? Object.values(statusFieldMap) : [statusFieldMap[statusType]];

    const trendData = {};
    ALL_MONTHS.forEach(month => {
      trendData[month] = {};
      activeStatuses.forEach(status => { trendData[month][status] = 0; });
    });

    records.forEach(record => {
      const month = record.month;
      if (!trendData[month]) return;

      const seen = new Set();
      targetFields.forEach(field => {
        const val = record[field];
        if (activeStatuses.includes(val) && !seen.has(val)) {
          seen.add(val);
          trendData[month][val] += 1;
        }
      });
    });

    return {
      categories: ALL_MONTHS,
      series: activeStatuses.map(status => ({
        name: status,
        data: ALL_MONTHS.map(month => trendData[month][status]),
        color: STATUS_COLORS[status] || '#6b7280'
      }))
    };
  },

  async fetchBarGraphFilters() {
    return {
      months: [
        { label: "All Months", value: "All" },
        ...ALL_MONTHS.map(m => ({ label: m, value: m }))
      ],
      classifications: ALL_CLASSIFICATIONS.map(cls => ({
        label: cls.charAt(0).toUpperCase() + cls.slice(1),
        value: cls
      }))
    };
  },

  async fetchBarGraphData(filters = {}) {
    const activeMonth = filters.month || "All";
    const activeBarangay = filters.barangay || "all";
    const activeAgeGroup = filters.ageGroup || "all";
    const classificationsParam = filters.classifications || "";
    const activeClassifications = classificationsParam.length > 0
      ? (typeof classificationsParam === 'string' ? classificationsParam.split(',') : classificationsParam)
      : ALL_CLASSIFICATIONS;

    const aggregated = await assessmentModel.getFilteredBarangayBarData(activeMonth);
    const uniqueBarangays = aggregated.map(a => a.barangay);

    const barData = {};
    uniqueBarangays.forEach(b => {
      barData[b] = {};
      activeClassifications.forEach(cls => { barData[b][cls] = 0; });
    });

    aggregated.forEach(record => {
      const b = record.barangay;
      if (!barData[b]) return;
      activeClassifications.forEach(cls => {
        const key = cls + '_count';
        barData[b][cls] = Number(record[key]) || 0;
      });
    });

    return {
      categories: uniqueBarangays,
      series: activeClassifications.map(cls => ({
        name: cls.charAt(0).toUpperCase() + cls.slice(1),
        data: uniqueBarangays.map(b => Number(barData[b][cls]))
      }))
    };
  },

  async fetchMapData() {
    return await assessmentModel.getBarangayMapData();
  },

  async fetchBarangayHealthInsights(barangayName) {
    if (!barangayName) throw new Error("Barangay identifier is required");

    const records = await assessmentModel.getAssessmentsByBarangay(barangayName);
    if (!records || records.length === 0) {
      return { barangay: barangayName, total: 0, classifications: { normal: 0, stunted: 0, obese: 0 }, statuses: {} };
    }

    const insights = {
      barangay: barangayName,
      total: records.length,
      classifications: { normal: 0, stunted: 0, obese: 0 },
      statuses: {}
    };

    records.forEach(record => {
      if (insights.classifications[record.classification] !== undefined) {
        insights.classifications[record.classification] += 1;
      }
      if (!insights.statuses[record.wfa_status]) insights.statuses[record.wfa_status] = 0;
      insights.statuses[record.wfa_status] += 1;
    });

    return insights;
  }
};
