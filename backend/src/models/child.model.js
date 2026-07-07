export default {
  async getAllChildrenRecords() {
    return [
      { id: 1, name: 'Juan Dela Cruz', barangay: 'Barangay 1', purok: 'Purok 1', parents: 'Maria Dela Cruz', age: 12, ageGroup: '12-59 Months', wfaStatus: 'Normal', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'healthy' },
      { id: 2, name: 'Anna Reyes', barangay: 'Barangay 2', purok: 'Purok 3', parents: 'Pedro Reyes', age: 8, ageGroup: '6-11 Months', wfaStatus: 'Underweight', hfaStatus: 'Stunted', wfhlStatus: 'Wasted', classification: 'deficit' },
      { id: 3, name: 'Mark Santos', barangay: 'Barangay 1', purok: 'Purok 2', parents: 'Jose Santos', age: 24, ageGroup: '12-59 Months', wfaStatus: 'Severe Underweight', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'deficit' },
      { id: 4, name: 'Liza Soberano', barangay: 'Barangay 3', purok: 'Purok 4', parents: 'John Soberano', age: 3, ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Severe Stunted', wfhlStatus: 'Normal', classification: 'excess' },
      { id: 5, name: 'Nadine Lustre', barangay: 'Barangay 2', purok: 'Purok 1', parents: 'James Lustre', age: 4, ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'healthy' }
    ];
  },

  async createChildRecord(payload) {
    return { 
      id: Math.floor(Math.random() * 1000) + 6, 
      ...payload, 
      createdAt: new Date().toISOString() 
    };
  }
};