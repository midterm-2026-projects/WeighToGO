export default {
  async getAllChildrenRecords() {
    return [
      { id: 1, barangay: 'Barangay 1', ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Normal', wfhlStatus: 'Normal' },
      { id: 2, barangay: 'Barangay 2', ageGroup: '6-11 Months', wfaStatus: 'Underweight', hfaStatus: 'Stunted', wfhlStatus: 'Wasted' },
      { id: 3, barangay: 'Barangay 1', ageGroup: '12-59 Months', wfaStatus: 'Severe Underweight', hfaStatus: 'Normal', wfhlStatus: 'Normal' },
      { id: 4, barangay: 'Barangay 3', ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Severe Stunted', wfhlStatus: 'Normal' }
    ];
  }
};