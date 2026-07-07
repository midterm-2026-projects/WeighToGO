export const getNutritionalIndicators = async () => {
  return [
    { label: 'All Indicators', value: 'all' },
    { label: 'Weight-for-Age (WFA)', value: 'wfa' },
    { label: 'Height-for-Age (HFA)', value: 'hfa' },
    { label: 'Weight-for-Length/Height (WFH/L)', value: 'wfhl' }
  ];
};