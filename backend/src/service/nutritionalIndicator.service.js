import * as nutritionalIndicatorModel from '../models/nutritionalIndicator.model.js';

export const fetchNutritionalOptions = async () => {
  const options = await nutritionalIndicatorModel.getNutritionalIndicators();

  if (!options) {
    throw new Error('Failed to retrieve nutritional indicator options');
  }

  return options;
};