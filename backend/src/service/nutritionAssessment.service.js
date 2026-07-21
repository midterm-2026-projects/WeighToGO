import assessmentModel from "../models/nutritionAssessment.model.js";

const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ALL_WFA_STATUSES = ["Normal", "Underweight", "Severe Underweight", "Overweight", "Obese"];
const ALL_HFA_STATUSES = ["Normal", "Stunted", "Severe Stunted"];
const ALL_WFHL_STATUSES = ["Normal", "Wasted", "Severely Wasted", "Overweight", "Obese"];
const ALL_CLASSIFICATIONS = ["Normal", "stunted", "obese"];

const STATUS_TYPE_MAP = {
  wfa: ALL_WFA_STATUSES,
  hfa: ALL_HFA_STATUSES,
  wfhl: ALL_WFHL_STATUSES
};

const STATUS_FIELD_MAP = {
  wfa: 'wfa_status',
  hfa: 'hfa_status',
  wfhl: 'wfhl_status'
};

const STATUS_COLORS = {
  wfa: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'],
  hfa: ['#10b981', '#f59e0b', '#ef4444'],
  wfhl: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']
};

export default {
  async fetchTrendlineFilters() {
    return [
      { label: 'Weight-for-Age (WFA)', value: 'wfa' },
      { label: 'Height-for-Age (HFA)', value: 'hfa' },
      { label: 'Weight-for-Length/Height (WFH/L)', value: 'wfhl' }
    ];
  },

  async fetchTrendlineData(filters = {}) {
    const barangay = filters.barangay || 'all';
    const ageGroup = filters.ageGroup || 'all';
    const statusType = filters.statusType || 'wfa';

    const records = await assessmentModel.getFilteredAssessments(barangay, ageGroup);
    if (!records) throw new Error("Failed to retrieve nutrition assessments");

    const activeStatuses = STATUS_TYPE_MAP[statusType] || ALL_WFA_STATUSES;
    const statusField = STATUS_FIELD_MAP[statusType] || 'wfa_status';
    const colors = STATUS_COLORS[statusType] || STATUS_COLORS.wfa;

    const trendData = {};
    ALL_MONTHS.forEach(month => {
      trendData[month] = {};
      activeStatuses.forEach(status => { trendData[month][status] = 0; });
    });

    records.forEach(record => {
      const statusValue = record[statusField];
      if (trendData[record.month] && activeStatuses.includes(statusValue)) {
        trendData[record.month][statusValue] += 1;
      }
    });

    return {
      categories: ALL_MONTHS,
      series: activeStatuses.map((status, idx) => ({
        name: status,
        data: ALL_MONTHS.map(month => trendData[month][status]),
        color: colors[idx % colors.length]
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
