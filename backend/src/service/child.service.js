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
  Normal: 'healthy',
  Malnourished: 'deficit',
  Obese: 'excess'
};

export default {
  async fetchFilterOptions() {
    const children = await childModel.getAllChildrenRecords();

    if (!children) {
      throw new Error('Failed to retrieve child records from the database');
    }

    const uniqueBarangays = [...new Set(children.map(child => child.barangay).filter(Boolean))];
    const uniqueAges = [...new Set(children.map(child => child.ageGroup).filter(Boolean))];

    const hasWfa = children.some(child => child.wfaStatus);
    const hasHfa = children.some(child => child.hfaStatus);
    const hasWfhl = children.some(child => child.wfhlStatus);

    const barangayOptions = [
      { label: 'All Barangays', value: 'all' },
      ...uniqueBarangays.map(barangay => ({ label: barangay, value: barangay }))
    ];

    const ageOptions = [
      { label: 'All Ages', value: 'all' },
      ...uniqueAges.map(age => ({ label: age, value: age }))
    ];

    const indicatorOptions = [{ label: 'All Indicators', value: 'all' }];

    if (hasWfa) indicatorOptions.push({ label: 'Weight-for-Age (WFA)', value: 'wfa' });
    if (hasHfa) indicatorOptions.push({ label: 'Height-for-Age (HFA)', value: 'hfa' });
    if (hasWfhl) indicatorOptions.push({ label: 'Weight-for-Length/Height (WFH/L)', value: 'wfhl' });

    return {
      barangays: barangayOptions,
      ages: ageOptions,
      nutritionalIndicators: indicatorOptions
    };
  },

  async calculateNutritionalTotals() {
    const records = await childModel.getAllChildrenRecords();

    if (!records) {
      throw new Error('Failed to retrieve child records from the database');
    }

    const totals = records.reduce((acc, currentRecord) => {
      const status = currentRecord?.classification?.toLowerCase();

      if (status === 'healthy') {
        acc.healthy += 1;
      } else if (status === 'deficit') {
        acc.deficit += 1;
      } else if (status === 'excess') {
        acc.excess += 1;
      }

      return acc;
    }, { healthy: 0, deficit: 0, excess: 0 });

    return totals;
  },

  async fetchMasterlist() {
    const records = await childModel.getAllChildrenRecords();

    if (!records) {
      throw new Error('Failed to retrieve masterlist from the database');
    }

    return records;
  },

  async registerChild(payload) {
    if (!payload.name || !payload.barangay || !payload.purok || !payload.parents || payload.age === undefined) {
      throw new Error('Missing required fields for child registration');
    }

    const newRecord = await childModel.createChildRecord(payload);

    if (!newRecord) {
      throw new Error('Database insertion failed');
    }

    return newRecord;
  },

  async filterChildMasterlist(barangay, ageGroup, status) {
    if (barangay && barangay !== 'All' && !BARANGAY_OPTIONS.includes(barangay)) {
      throw new Error('Invalid Barangay selection');
    }

    if (ageGroup && ageGroup !== 'All' && !AGE_OPTIONS.includes(ageGroup)) {
      throw new Error('Invalid Nutritional Age Group selection');
    }

    if (status && status !== 'All' && !STATUS_OPTIONS.includes(status)) {
      throw new Error('Invalid Nutritional Status selection');
    }

    const classification = status && status !== 'All' ? STATUS_TO_CLASSIFICATION[status] : undefined;

    return await childModel.filterChildMasterlist(barangay, ageGroup, classification);
  },

  async fetchFilteredMasterlist(queryParams = {}) {
    const records = await childModel.getAllChildrenRecords();

    if (!records) {
      throw new Error('Failed to retrieve filtered masterlist from the database');
    }

    const { search, barangay, ageGroup } = queryParams;

    return records.filter(child => {
      if (search && !child.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (barangay && barangay !== 'all' && child.barangay !== barangay) {
        return false;
      }
      if (ageGroup && ageGroup !== 'all' && child.ageGroup !== ageGroup) {
        return false;
      }
      return true;
    });
  }
};