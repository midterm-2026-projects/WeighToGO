import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import BarangayMap from '../components/dashboard/barangayMap';

describe('Interactive Barangay Map', () => {
  beforeEach(() => {
    render(<BarangayMap />);
  });

  it('should render the map component and legend correctly', () => {
    expect(screen.getByText('Interactive Barangay Map')).toBeInTheDocument();
    expect(screen.getByText('Balayan Nutritional Risk Distribution')).toBeInTheDocument();
    expect(screen.getByText('Low Risk')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
  });

  it('should display a green color for barangays with low risk (less than 15 cases)', () => {
    const lowRiskMarker = screen.getByTestId('marker-1'); 
    
    expect(lowRiskMarker.getAttribute('data-risk')).toBe('Low Risk');
    expect(lowRiskMarker.firstChild).toHaveClass('bg-green-500');
  });

  it('should display a yellow color for barangays with moderate risk (15 to 29 cases)', () => {
    const moderateRiskMarker = screen.getByTestId('marker-2'); 
    
    expect(moderateRiskMarker.getAttribute('data-risk')).toBe('Moderate Risk');
    expect(moderateRiskMarker.firstChild).toHaveClass('bg-yellow-400');
  });

  it('should display a red color for barangays with high risk (30 or more cases)', () => {
    const highRiskMarker = screen.getByTestId('marker-3'); 
    
    expect(highRiskMarker.getAttribute('data-risk')).toBe('High Risk');
    expect(highRiskMarker.firstChild).toHaveClass('bg-red-500');
  });

});