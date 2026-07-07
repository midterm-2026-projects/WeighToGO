import * as dropdownModel from '../models/dropdown.model.js';

export const fetchFilterOptions = async () => {
  const options = await dropdownModel.getDropdownFilters();
  
  if (!options) {
    throw new Error('Failed to retrieve filter options');
  }
  
  return options;
};