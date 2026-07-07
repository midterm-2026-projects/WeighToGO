import childModel from '../models/child.model.js';

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
  }
};