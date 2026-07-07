export const getDropdownFilters = async () => {
  return {
    barangays: [
      { label: 'All Barangays', value: 'all' },
      { label: 'Barangay 1', value: 'brgy1' },
      { label: 'Barangay 2', value: 'brgy2' }
    ],
    ages: [
      { label: 'All Ages', value: 'all' },
      { label: '0-5 Months', value: '0-5' },
      { label: '6-11 Months', value: '6-11' }
    ],
    nutritionalIndicators: [
      { label: 'All Indicators', value: 'all' },
      { label: 'Weight-for-Age', value: 'wfa' },
      { label: 'Height-for-Age', value: 'hfa' }
    ]
  };
};