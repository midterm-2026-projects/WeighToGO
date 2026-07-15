import assessmentModel from '../models/nutritionAssessment.model.js';

const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ALL_STATUSES = ['Normal (N)', 'Overweight (OW)', 'Obese (OB)', 'Mod. Wasted (MW)', 'Sev. Wasted (SW)'];

export default {
  async fetchTrendlineFilters() {
    return ALL_STATUSES.map(status => ({
      label: status,
      value: status
    }));
  },

  async fetchTrendlineData(filters = {}) {
    const records = await assessmentModel.getAllAssessments();

    if (!records) {
      throw new Error('Failed to retrieve nutrition assessments from the database');
    }

    const activeStatuses = filters.statuses && Array.isArray(filters.statuses) && filters.statuses.length > 0
      ? filters.statuses
      : ALL_STATUSES;

    const trendData = {};
    ALL_MONTHS.forEach(month => {
      trendData[month] = {};
      activeStatuses.forEach(status => {
        trendData[month][status] = 0;
      });
    });

    records.forEach(record => {
      if (trendData[record.month] && activeStatuses.includes(record.status)) {
        trendData[record.month][record.status] += 1;
      }
    });

    const series = activeStatuses.map(status => ({
      name: status,
      data: ALL_MONTHS.map(month => trendData[month][status])
    }));

    return {
      categories: ALL_MONTHS,
      series: series
    };
  }
};