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

  it('should show barangay tooltip details when hovered', async () => {
    const user = userEvent.setup();
    const highRiskMarker = screen.getByTestId('marker-3'); 

    await user.hover(highRiskMarker);

    expect(screen.getByText('Barangay 3')).toBeInTheDocument();
    expect(screen.getByText('Nutritional Cases:')).toBeInTheDocument();
  });

  it('should open and display the side panel when a barangay marker is clicked', async () => {
    const user = userEvent.setup();
    const marker = screen.getByTestId('marker-1'); 
    
    await user.click(marker);
    
    expect(screen.getByText('Registered Children')).toBeInTheDocument();
    expect(screen.getByText('Nutritional Status Breakdown')).toBeInTheDocument();
  });

  it('should close the side panel when the close button is clicked inside it', async () => {
    const user = userEvent.setup();
    const marker = screen.getByTestId('marker-1'); 
    
    await user.click(marker);
    expect(screen.getByText('Registered Children')).toBeInTheDocument();

    const closeButton = screen.getByText('✕');
    await user.click(closeButton);

    expect(screen.queryByText('Registered Children')).not.toBeInTheDocument();
  });
});