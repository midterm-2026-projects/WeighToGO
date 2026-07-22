import childModel from '../models/child.model.js';

const BARANGAY_OPTIONS = [
  "Brgy. Caloocan", "Brgy. Lanatan", "Brgy. Uno", "Brgy. Ermita",
  "Brgy. Gumamela", "Brgy. Navotas", "Brgy. Palikpikan", "Brgy. Sampaga",
  "Brgy. Santol", "Brgy. Dilao", "Brgy. Dalig", "Brgy. Langgangan",
  "Brgy. Canda", "Brgy. Pooc", "Brgy. Tanggoy"
];
const AGE_OPTIONS = ["0-11 Months", "12-23 Months", "24-59 Months"];
const STATUS_OPTIONS = ["Normal", "Malnourished", "Obese"];

const STATUS_TO_CLASSIFICATION = {
  Normal: 'normal',
  Malnourished: 'stunted',
  Obese: 'obese'
};

export default {
  async fetchFilterOptions() {
    const children = await childModel.getAllChildrenRecords();
    if (!children) throw new Error('Failed to retrieve child records from the database');

    const uniqueBarangays = [...new Set(children.map(c => c.barangay).filter(Boolean))];
    const uniqueAges = [...new Set(children.map(c => c.age_months).filter(Boolean))];

    const ageGroups = uniqueAges.map(a => {
      if (a <= 11) return '0-11 Months';
      if (a <= 23) return '12-23 Months';
      return '24-59 Months';
    });
    const uniqueAgeGroups = [...new Set(ageGroups)];

    return {
      barangays: [
        { label: 'All Barangays', value: 'all' },
        ...uniqueBarangays.map(b => ({ label: b, value: b }))
      ],
      ages: [
        { label: 'All Ages', value: 'all' },
        ...uniqueAgeGroups.map(a => ({ label: a, value: a }))
      ],
      nutritionalIndicators: [
        { label: 'All Indicators', value: 'all' },
        { label: 'Weight-for-Age (WFA)', value: 'wfa' },
        { label: 'Height-for-Age (HFA)', value: 'hfa' },
        { label: 'Weight-for-Length/Height (WFH/L)', value: 'wfhl' }
      ]
    };
  },

  async calculateNutritionalTotals() {
    return await childModel.countByClassification();
  },

  async calculateFilteredTotals(barangay, ageGroup) {
    return await childModel.countFilteredTotals(barangay, ageGroup);
  },

  async fetchMasterlist() {
    const records = await childModel.getAllChildrenRecords();
    if (!records) throw new Error('Failed to retrieve masterlist from the database');
    return records;
  },

  async registerChild(payload) {
    if (!payload.name || !payload.barangay || !payload.purok || !payload.parent_name || payload.age_months === undefined) {
      throw new Error('Missing required fields for child registration');
    }
    const newRecord = await childModel.createChildRecord(payload);
    if (!newRecord) throw new Error('Database insertion failed');
    return newRecord;
  },

  async filterChildMasterlist(barangay, ageGroup, status, name, purok, checkupStatus) {
    if (barangay && barangay !== 'All' && barangay !== 'all' && !BARANGAY_OPTIONS.includes(barangay)) {
      throw new Error('Invalid Barangay selection');
    }
    if (ageGroup && ageGroup !== 'All' && ageGroup !== 'all' && !AGE_OPTIONS.includes(ageGroup)) {
      throw new Error('Invalid Nutritional Age Group selection');
    }
    if (status && status !== 'All' && status !== 'all' && !STATUS_OPTIONS.includes(status)) {
      throw new Error('Invalid Nutritional Status selection');
    }

    const classification = status && status !== 'All' && status !== 'all' ? STATUS_TO_CLASSIFICATION[status] : undefined;
    return await childModel.filterChildMasterlist(barangay, ageGroup, classification, name, purok, checkupStatus);
  },

  async generateMonthlyReport(month, year, barangay) {
    if (!month || !year) throw new Error('Month and year are required to generate the report');

    const records = (barangay && barangay !== 'All' && barangay !== 'all')
      ? await childModel.getMonthlyReportData(month, year, barangay)
      : await childModel.getMonthlyReportData(month, year);

    const summary = records.reduce((acc, child) => {
      acc.totalRegistered += 1;
      if (child.classification === 'normal') acc.normal += 1;
      if (child.classification === 'stunted') acc.stunted += 1;
      if (child.classification === 'obese') acc.obese += 1;
      return acc;
    }, { totalRegistered: 0, normal: 0, stunted: 0, obese: 0 });

    return { summary, records };
  },

  async submitChildAssessment(childId, assessmentData) {
    if (!childId || !assessmentData.weight || !assessmentData.height) {
      throw new Error('Child ID, weight, and height are required to submit an assessment');
    }
    const updatedRecord = await childModel.updateChildAssessment(childId, assessmentData);
    if (!updatedRecord) throw new Error('Child record not found or assessment update failed');
    return updatedRecord;
  },

  async fetchChildProfile(id) {
    if (!id) throw new Error('Child ID is required to fetch profile');
    const profile = await childModel.getChildById(id);
    if (!profile) throw new Error('Child profile not found');
    return profile;
  },

  async fetchChildHistory(id) {
    if (!id) throw new Error('Child ID is required');
    return await childModel.getChildAssessmentHistory(id);
  },

  async toggleCheckupStatus(childId, status) {
    if (!childId) throw new Error('Child ID is required');
    return await childModel.updateCheckupStatus(childId, status);
  }
};
