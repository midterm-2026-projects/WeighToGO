export default {
  async getAllChildrenRecords() {
    return [
      { id: 1, barangay: 'Barangay 1', ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'healthy' },
      { id: 2, barangay: 'Barangay 2', ageGroup: '6-11 Months', wfaStatus: 'Underweight', hfaStatus: 'Stunted', wfhlStatus: 'Wasted', classification: 'deficit' },
      { id: 3, barangay: 'Barangay 1', ageGroup: '12-59 Months', wfaStatus: 'Severe Underweight', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'deficit' },
      { id: 4, barangay: 'Barangay 3', ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Severe Stunted', wfhlStatus: 'Normal', classification: 'excess' },
      { id: 5, barangay: 'Barangay 2', ageGroup: '0-5 Months', wfaStatus: 'Normal', hfaStatus: 'Normal', wfhlStatus: 'Normal', classification: 'healthy' },
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
  },

  async updateChildAssessment(childId, updateData) {
    const children = await this.getAllChildrenRecords();
    const child = children.find(c => c.id === Number(childId));
    if (!child) return null;

    const newHistoryEntry = {
      date: new Date().toISOString().split('T')[0],
      height: updateData.height,
      weight: updateData.weight,
      wfaStatus: updateData.wfaStatus || child.wfaStatus,
      hfaStatus: updateData.hfaStatus || child.hfaStatus,
      wfhlStatus: updateData.wfhlStatus || child.wfhlStatus,
      classification: updateData.classification || child.classification
    };

    return {
      ...child,
      height: updateData.height,
      weight: updateData.weight,
      wfaStatus: updateData.wfaStatus || child.wfaStatus,
      hfaStatus: updateData.hfaStatus || child.hfaStatus,
      wfhlStatus: updateData.wfhlStatus || child.wfhlStatus,
      classification: updateData.classification || child.classification,
      history: [...(child.history || []), newHistoryEntry]
    };
  },

  async getChildAssessmentHistory(childId) {
    const children = await this.getAllChildrenRecords();
    const child = children.find(c => c.id === Number(childId));
    return child ? (child.history || []) : [];
  },

  async getMonthlyReportData(month, year) {
    const records = await this.getAllChildrenRecords();
    
    return records.filter(child => {
      if (!child.createdAt) return true; 
      const recordDate = new Date(child.createdAt);
      return (recordDate.getMonth() + 1) === Number(month) && recordDate.getFullYear() === Number(year);
    });
  }
};