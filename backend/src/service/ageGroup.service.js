import * as ageGroupModel from '../models/ageGroup.model.js';

export const fetchAgeGroupOptions = async () => {
  const options = await ageGroupModel.getAgeGroups();

  if (!options) {
    throw new Error('Failed to retrieve age group options');
  }

  return options;
};