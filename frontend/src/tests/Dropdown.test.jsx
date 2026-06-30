import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Dropdown } from '../components/dashboard/Dropdown';

describe('Dropdown Component - Filter Controls', () => {
  const mockOptions = [{ label: 'Option 1', value: 'opt1' }];

  it('should have dropdown filter controls for Barangay, Age, and Nutritional Indicator', () => {
    render(
      <>
        <Dropdown label="Barangay" options={mockOptions} selectedValue="opt1" onChange={() => {}} />
        <Dropdown label="Age" options={mockOptions} selectedValue="opt1" onChange={() => {}} />
        <Dropdown label="Nutritional Indicator" options={mockOptions} selectedValue="opt1" onChange={() => {}} />
      </>
    );

    
    expect(screen.getByText('Barangay')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Nutritional Indicator')).toBeInTheDocument();
  });

 
  it('should calls onChange handler when a new option is selected', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const testOptions = [
      { label: 'All Ages', value: 'all' },
      { label: '0-5 Months', value: '0-5' }
    ];
    
    render(
      <Dropdown 
        label="Age"
        options={testOptions} 
        selectedValue="all" 
        onChange={handleChange} 
      />
    );
    
    const selectElement = screen.getByRole('combobox');
    await user.selectOptions(selectElement, '0-5');
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('0-5');
  });
});