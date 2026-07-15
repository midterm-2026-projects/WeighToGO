export default {
  async getAllChildrenRecords() {
    return [
      { id: 1, barangay: 'Barangay 1', ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'healthy' },
      { id: 2, barangay: 'Barangay 2', ageGroup: '6-11 Months', wfaStatus: 'Underweight', hfaStatus: 'Stunted', wfhlStatus: 'Wasted', classification: 'deficit' },
      { id: 3, barangay: 'Barangay 1', ageGroup: '12-59 Months', wfaStatus: 'Severe Underweight', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'deficit' },
      { id: 4, barangay: 'Barangay 3', ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Severe Stunted', wfhlStatus: 'Normal', classification: 'excess' },
      { id: 5, barangay: 'Barangay 2', ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'healthy' }
    ];
      { id: 1, name: 'Juan Dela Cruz', barangay: 'Barangay 1', purok: 'Purok 1', parents: 'Maria Dela Cruz', age: 12, ageGroup: '12-59 Months', wfaStatus: 'Normal', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'healthy' },
      { id: 2, name: 'Anna Reyes', barangay: 'Barangay 2', purok: 'Purok 3', parents: 'Pedro Reyes', age: 8, ageGroup: '6-11 Months', wfaStatus: 'Underweight', hfaStatus: 'Stunted', wfhlStatus: 'Wasted', classification: 'deficit' },
      { id: 3, name: 'Mark Santos', barangay: 'Barangay 1', purok: 'Purok 2', parents: 'Jose Santos', age: 24, ageGroup: '12-59 Months', wfaStatus: 'Severe Underweight', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'deficit' },
      { id: 4, name: 'Liza Soberano', barangay: 'Barangay 3', purok: 'Purok 4', parents: 'John Soberano', age: 3, ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Severe Stunted', wfhlStatus: 'Normal', classification: 'excess' },
      { id: 5, name: 'Nadine Lustre', barangay: 'Barangay 2', purok: 'Purok 1', parents: 'James Lustre', age: 4, ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'healthy' },

      { id: 6, name: 'Juan Dela Cruz', barangay: 'Brgy. Navotas', purok: 'Purok 2', parents: 'Maria Cruz', age: 10, ageGroup: '6-11 Months', wfaStatus: 'Normal', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'healthy' },
      { id: 7, name: 'Baby Lanatan', barangay: 'Brgy. Lanatan', purok: 'Purok 4', parents: 'Ana Lanatan', age: 20, ageGroup: '12-59 Months', wfaStatus: 'Underweight', hfaStatus: 'Stunted', wfhlStatus: 'Wasted', classification: 'deficit' },
      { id: 8, name: 'Kyle Reyes', barangay: 'Brgy. Navotas', purok: 'Purok 1', parents: 'Trishia Reyes', age: 37, ageGroup: '12-59 Months', wfaStatus: 'Overweight', hfaStatus: 'Normal', wfhlStatus: 'Overweight', classification: 'excess' }
    ];
  },

  async createChildRecord(payload) {
    return {
      id: Math.floor(Math.random() * 1000) + 6,
      ...payload,
      createdAt: new Date().toISOString()
    };
  },

  async filterChildMasterlist(barangay, ageGroup, classification) {
    const records = await this.getAllChildrenRecords();

    return records.filter(child =>
      (!barangay || barangay === 'All' || child.barangay === barangay) &&
      (!ageGroup || ageGroup === 'All' || child.ageGroup === ageGroup) &&
      (!classification || classification === 'All' || child.classification === classification)
    );
  }
};
