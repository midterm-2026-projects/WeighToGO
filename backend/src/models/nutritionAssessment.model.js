export default {
  async getAllAssessments() {
    return [
      { id: 1, month: 'Jan', status: 'Normal (N)', classification: 'healthy', barangay: 'Barangay 1' },
      { id: 2, month: 'Jan', status: 'Normal (N)', classification: 'healthy', barangay: 'Barangay 2' },
      { id: 3, month: 'Jan', status: 'Overweight (OW)', classification: 'excess', barangay: 'Barangay 1' },
      { id: 4, month: 'Jan', status: 'Obese (OB)', classification: 'excess', barangay: 'Barangay 3' },
      { id: 5, month: 'Feb', status: 'Normal (N)', classification: 'healthy', barangay: 'Barangay 1' },
      { id: 6, month: 'Feb', status: 'Mod. Wasted (MW)', classification: 'deficit', barangay: 'Barangay 2' },
      { id: 7, month: 'Mar', status: 'Sev. Wasted (SW)', classification: 'deficit', barangay: 'Barangay 3' },
      { id: 8, month: 'Mar', status: 'Normal (N)', classification: 'healthy', barangay: 'Barangay 1' },
      { id: 9, month: 'Mar', status: 'Normal (N)', classification: 'healthy', barangay: 'Barangay 2' },
      { id: 10, month: 'Apr', status: 'Overweight (OW)', classification: 'excess', barangay: 'Barangay 1' },
      { id: 11, month: 'May', status: 'Normal (N)', classification: 'healthy', barangay: 'Barangay 2' },
      { id: 12, month: 'May', status: 'Obese (OB)', classification: 'excess', barangay: 'Barangay 3' },
      { id: 13, month: 'Jun', status: 'Mod. Wasted (MW)', classification: 'deficit', barangay: 'Barangay 1' },
      { id: 14, month: 'Jul', status: 'Normal (N)', classification: 'healthy', barangay: 'Barangay 2' },
      { id: 15, month: 'Aug', status: 'Overweight (OW)', classification: 'excess', barangay: 'Barangay 3' },
      { id: 16, month: 'Sep', status: 'Sev. Wasted (SW)', classification: 'deficit', barangay: 'Barangay 1' },
      { id: 17, month: 'Oct', status: 'Normal (N)', classification: 'healthy', barangay: 'Barangay 2' },
      { id: 18, month: 'Nov', status: 'Obese (OB)', classification: 'excess', barangay: 'Barangay 1' },
      { id: 19, month: 'Dec', status: 'Normal (N)', classification: 'healthy', barangay: 'Barangay 3' },
      { id: 20, month: 'Dec', status: 'Mod. Wasted (MW)', classification: 'deficit', barangay: 'Barangay 2' }
    ];
  },

  async getBarangayCoordinates() {
    return {
      'Barangay 1': { lat: 13.9405, lng: 120.7323 },
      'Barangay 2': { lat: 13.9425, lng: 120.7345 },
      'Barangay 3': { lat: 13.9445, lng: 120.7367 }
    };
  },

  async getNutritionalRiskAggregations() {
    const records = await this.getAllAssessments();
    const aggregated = {};

    records.forEach(record => {
      if (!aggregated[record.barangay]) {
        aggregated[record.barangay] = {
          total: 0,
          healthy: 0,
          deficit: 0,
          excess: 0
        };
      }
      aggregated[record.barangay].total += 1;
      aggregated[record.barangay][record.classification] += 1;
    });

    return aggregated;
  }
};