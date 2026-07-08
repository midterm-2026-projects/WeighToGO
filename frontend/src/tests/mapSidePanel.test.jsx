import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import MapSidePanel from '../components/dashboard/mapSidePanel';

describe('Map Side Panel Component', () => {
  const mockBarangay = {
    id: 1,
    name: 'Barangay 1',
    cases: 5,
    registeredChildren: 150,
    status: { normal: 145, deficit: 3, excess: 2 }
  };

  const mockGetRiskDetails = vi.fn().mockReturnValue({
    level: 'Low Risk',
    color: 'bg-green-500',
    ring: 'ring-green-500/30'
  });

  it('should display the barangay name and total registered children when opened', () => {
    render(
      <MapSidePanel
        barangay={mockBarangay}
        onClose={() => {}}
        getRiskDetails={mockGetRiskDetails}
      />
    );

    expect(screen.getByText('Barangay 1')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Low Risk')).toBeInTheDocument();
  });

  it('should display the exact nutritional status breakdown for normal, deficit, and excess cases', () => {
    render(
      <MapSidePanel
        barangay={mockBarangay}
        onClose={() => {}}
        getRiskDetails={mockGetRiskDetails}
      />
    );
    
    expect(screen.getByText('145')).toBeInTheDocument(); 
    expect(screen.getByText('3')).toBeInTheDocument();   
    expect(screen.getByText('2')).toBeInTheDocument();   
  });

  it('should display the correct health insight based on the risk level', () => {
    render(
      <MapSidePanel
        barangay={mockBarangay}
        onClose={() => {}}
        getRiskDetails={mockGetRiskDetails}
      />
    );
    
    expect(screen.getByText(/Great job! This barangay maintains a healthy nutritional status/i)).toBeInTheDocument();
  });

  it('should call onClose function when the close (✕) button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <MapSidePanel
        barangay={mockBarangay}
        onClose={handleClose}
        getRiskDetails={mockGetRiskDetails}
      />
    );

    const closeButton = screen.getByText('✕');
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});