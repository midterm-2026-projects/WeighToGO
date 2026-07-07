import nutritionalCasesModel from '../models/nutritionalCases.model.js';

export default {
  async calculateNutritionalTotals() {
    const records = await nutritionalCasesModel.getAllCases();

    if (!records) {
      throw new Error('Failed to retrieve nutritional records from the database');
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
  }
};