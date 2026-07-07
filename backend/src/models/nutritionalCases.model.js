export default {
  async getAllCases() {
    return [
      { id: 1, classification: 'healthy' },
      { id: 2, classification: 'deficit' },
      { id: 3, classification: 'excess' },
      { id: 4, classification: 'healthy' },
      { id: 5, classification: 'deficit' },
      { id: 6, classification: 'healthy' },
      { id: 7, classification: 'deficit' },
      { id: 8, classification: 'healthy' }
    ];
  }
};