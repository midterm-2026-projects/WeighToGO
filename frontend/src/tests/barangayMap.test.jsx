import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import BarangayMap from '../components/dashboard/barangayMap';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, className }) => <div data-testid="map-container" className={className}>{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children, eventHandlers, icon }) => (
    <div 
      data-testid="marker" 
      onClick={eventHandlers?.click}
      data-color={icon?.options?.html}
    >
      {children}
    </div>
  ),
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  useMap: () => ({ fitBounds: vi.fn() }),
}));

vi.mock('leaflet', () => ({
  default: {
    divIcon: () => ({ options: { html: '' } }),
    latLngBounds: () => ({})
  },
  divIcon: () => ({ options: { html: '' } }),
  latLngBounds: () => ({})
}));

describe('Interactive Barangay Map', () => {
  const mockData = [
    { id: 1, name: 'Barangay 1', cases: 5, registeredChildren: 150, status: { normal: 145, stunted: 3, obese: 2 }, coordinates: { lat: 13.9405, lng: 120.7323 }, riskLevel: 'Low Risk', color: '#22c55e' },
    { id: 2, name: 'Barangay 2', cases: 20, registeredChildren: 200, status: { normal: 175, stunted: 15, obese: 10 }, coordinates: { lat: 13.9425, lng: 120.7345 }, riskLevel: 'Moderate Risk', color: '#eab308' },
    { id: 3, name: 'Barangay 3', cases: 45, registeredChildren: 180, status: { normal: 135, stunted: 30, obese: 15 }, coordinates: { lat: 13.9445, lng: 120.7367 }, riskLevel: 'High Risk', color: '#ef4444' },
  ];

  beforeEach(() => {
    render(<BarangayMap initialData={mockData} />);
  });

  it('should render the map component and legend correctly', () => {
    expect(screen.getByText('Interactive Barangay Map')).toBeInTheDocument();
    expect(screen.getByText('Balayan Nutritional Risk Distribution')).toBeInTheDocument();
  });

  it('should render legend colors for risk levels', () => {
    expect(screen.getAllByText('Low Risk').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Moderate')).toBeInTheDocument();
    expect(screen.getAllByText('High Risk').length).toBeGreaterThanOrEqual(1);
  });

  it('should open and display the side panel when a barangay marker is clicked', async () => {
    const user = userEvent.setup();
    const markers = screen.getAllByTestId('marker');
    
    await user.click(markers[0]);
    
    expect(screen.getByText('Registered Children')).toBeInTheDocument();
    expect(screen.getByText('Nutritional Status Breakdown')).toBeInTheDocument();
  });

  it('should close the side panel when the close button is clicked inside it', async () => {
    const user = userEvent.setup();
    const markers = screen.getAllByTestId('marker');
    
    await user.click(markers[0]);
    expect(screen.getByText('Registered Children')).toBeInTheDocument();

    const closeButton = screen.getByText('✕');
    await user.click(closeButton);

    expect(screen.queryByText('Registered Children')).not.toBeInTheDocument();
  });
});