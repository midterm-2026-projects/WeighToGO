import assessmentModel from "../models/nutritionAssessment.model.js";

const ALL_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const ALL_STATUSES = [
  "Normal (N)",
  "Overweight (OW)",
  "Obese (OB)",
  "Mod. Wasted (MW)",
  "Sev. Wasted (SW)",
];
const ALL_CLASSIFICATIONS = ["healthy", "deficit", "excess"];

export default {
  async fetchTrendlineFilters() {
    return ALL_STATUSES.map((status) => ({
      label: status,
      value: status,
    }));
  },

  async fetchTrendlineData(filters = {}) {
    const records = await assessmentModel.getAllAssessments();

    if (!records) {
      throw new Error(
        "Failed to retrieve nutrition assessments from the database",
      );
    }

    const activeStatuses =
      filters.statuses &&
      Array.isArray(filters.statuses) &&
      filters.statuses.length > 0
        ? filters.statuses
        : ALL_STATUSES;

    const trendData = {};
    ALL_MONTHS.forEach((month) => {
      trendData[month] = {};
      activeStatuses.forEach((status) => {
        trendData[month][status] = 0;
      });
    });

    records.forEach((record) => {
      if (trendData[record.month] && activeStatuses.includes(record.status)) {
        trendData[record.month][record.status] += 1;
      }
    });

    const series = activeStatuses.map((status) => ({
      name: status,
      data: ALL_MONTHS.map((month) => trendData[month][status]),
    }));

    return {
      categories: ALL_MONTHS,
      series: series,
    };
  },

  async fetchBarGraphFilters() {
    return {
      months: [
        { label: "All Months", value: "All" },
        ...ALL_MONTHS.map((month) => ({ label: month, value: month })),
      ],
      classifications: ALL_CLASSIFICATIONS.map((cls) => ({
        label: cls.charAt(0).toUpperCase() + cls.slice(1),
        value: cls,
      })),
    };
  },

  async fetchBarGraphData(filters = {}) {
    const records = await assessmentModel.getAllAssessments();

    if (!records) {
      throw new Error(
        "Failed to retrieve nutrition assessments from the database",
      );
    }

    const activeMonth = filters.month || "All";
    const activeClassifications =
      filters.classifications &&
      Array.isArray(filters.classifications) &&
      filters.classifications.length > 0
        ? filters.classifications
        : ALL_CLASSIFICATIONS;

    const uniqueBarangays = [
      ...new Set(records.map((r) => r.barangay).filter(Boolean)),
    ].sort();

    const barData = {};
    uniqueBarangays.forEach((barangay) => {
      barData[barangay] = {};
      activeClassifications.forEach((cls) => {
        barData[barangay][cls] = 0;
      });
    });

    records.forEach((record) => {
      const isMonthMatch =
        activeMonth === "All" || record.month === activeMonth;
      const isClassMatch = activeClassifications.includes(
        record.classification,
      );

      if (isMonthMatch && isClassMatch && barData[record.barangay]) {
        barData[record.barangay][record.classification] += 1;
      }
    });

    const series = activeClassifications.map((cls) => ({
      name: cls.charAt(0).toUpperCase() + cls.slice(1),
      data: uniqueBarangays.map((barangay) => barData[barangay][cls]),
    }));

    return {
      categories: uniqueBarangays,
      series: series,
    };
  },

  async fetchMapData() {
    const coords = await assessmentModel.getBarangayCoordinates();
    const aggregations = await assessmentModel.getNutritionalRiskAggregations();

    const mapData = [];

    for (const [barangay, data] of Object.entries(aggregations)) {
      const coordinate = coords[barangay] || { lat: 0, lng: 0 };
      const riskRatio = (data.deficit + data.excess) / data.total;

      let riskLevel = 'Low';
      let markerColor = 'green';

      if (riskRatio >= 0.4) {
        riskLevel = 'High';
        markerColor = 'red';
      } else if (riskRatio >= 0.2) {
        riskLevel = 'Medium';
        markerColor = 'orange';
      }

      mapData.push({
        barangay,
        lat: coordinate.lat,
        lng: coordinate.lng,
        metrics: data,
        riskLevel,
        markerColor
      });
    }

    return mapData;
  },

  async fetchBarangayHealthInsights(barangayName) {
    if (!barangayName) {
      throw new Error("Barangay identifier is required");
    }

    const records = await assessmentModel.getAssessmentsByBarangay(barangayName);

    if (!records || records.length === 0) {
      return {
        barangay: barangayName,
        total: 0,
        classifications: { healthy: 0, deficit: 0, excess: 0 },
        statuses: {}
      };
    }

    const insights = {
      barangay: barangayName,
      total: records.length,
      classifications: { healthy: 0, deficit: 0, excess: 0 },
      statuses: {}
    };

    records.forEach(record => {
      if (insights.classifications[record.classification] !== undefined) {
        insights.classifications[record.classification] += 1;
      }

      if (!insights.statuses[record.status]) {
        insights.statuses[record.status] = 0;
      }
      insights.statuses[record.status] += 1;
    });

    return insights;
  }
};