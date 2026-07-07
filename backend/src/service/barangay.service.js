import * as barangayModel from '../models/barangay.model.js';

export const fetchBarangayOptions = async () => {
  const options = await barangayModel.getBarangays();

  if (!options) {
    throw new Error('Failed to retrieve barangay options');
  }

  return options;
};