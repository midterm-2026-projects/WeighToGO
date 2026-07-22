import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

const mockFilters = vi.hoisted(() => vi.fn());
const mockHealth = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  api: {
    children: {
      filters: mockFilters,
    },
    reports: {
      health: mockHealth,
    },
  },
}));

import HealthReportsPage from '../../pages/HealthReportsPage';

const barangays = [
  { label: 'All Barangays', value: 'all' },
  { label: 'Brgy. Caloocan', value: 'Brgy. Caloocan' },
  { label: 'Brgy. Lanatan', value: 'Brgy. Lanatan' },
];

const reports = [
  { barangay: 'Brgy. Caloocan', totalRegistered: 15, normal: 10, underweight: 2, suw: 0, stunted: 1, wasted: 1, obese: 1 },
  { barangay: 'Brgy. Lanatan', totalRegistered: 15, normal: 12, underweight: 1, suw: 0, stunted: 1, wasted: 0, obese: 1 },
];

describe('HealthReportsPage Display', () => {
  beforeEach(() => {
    mockFilters.mockReset();
    mockHealth.mockReset();
    mockFilters.mockResolvedValue({ data: { barangays } });
    mockHealth.mockResolvedValue({ data: reports });
  });

  it('displays the page heading and subtitle', () => {
    render(<HealthReportsPage />);
    expect(screen.getByRole('heading', { name: /health reports/i })).toBeInTheDocument();
    expect(screen.getByText(/nutritional status reports by barangay/i)).toBeInTheDocument();
  });

  it('displays Loading... initially', () => {
    render(<HealthReportsPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays OPT summary description after load', async () => {
    render(<HealthReportsPage />);
    await waitFor(() => {
      expect(screen.getByText(/operation timbang \(opt\) summary matrix/i)).toBeInTheDocument();
    });
  });

  it('displays the barangay filter dropdown with options', async () => {
    render(<HealthReportsPage />);
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveDisplayValue('All Barangays');
    });
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('All Barangays');
    expect(options[1]).toHaveTextContent('Brgy. Caloocan');
    expect(options[2]).toHaveTextContent('Brgy. Lanatan');
  });

  it('displays the Print Report button', () => {
    render(<HealthReportsPage />);
    expect(screen.getByRole('button', { name: /print report/i })).toBeInTheDocument();
  });

  it('displays table header sections after loading', async () => {
    render(<HealthReportsPage />);
    await waitFor(() => {
      expect(screen.getByText('Weight-for-Age (WFA)')).toBeInTheDocument();
      expect(screen.getByText('Weight-for-Length/Height (WFH/L)')).toBeInTheDocument();
    });
  });

  it('displays sub-column headers in table', async () => {
    render(<HealthReportsPage />);
    await waitFor(() => {
      expect(screen.getByText('Barangay')).toBeInTheDocument();
      expect(screen.getByText('Total Registered')).toBeInTheDocument();
      expect(screen.getByText('UW')).toBeInTheDocument();
      expect(screen.getByText('SUW')).toBeInTheDocument();
      expect(screen.getByText('OW')).toBeInTheDocument();
      expect(screen.getByText('ST')).toBeInTheDocument();
      expect(screen.getByText('SST')).toBeInTheDocument();
      expect(screen.getByText('MW')).toBeInTheDocument();
      expect(screen.getByText('SW')).toBeInTheDocument();
      expect(screen.getByText('OB')).toBeInTheDocument();
    });
  });

  it('displays report data for both barangays', async () => {
    render(<HealthReportsPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Brgy. Caloocan').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Brgy. Lanatan').length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getAllByText('15')).toHaveLength(2);
  });

  it('filters report rows when barangay is changed', async () => {
    render(<HealthReportsPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Brgy. Caloocan').length).toBeGreaterThanOrEqual(1);
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Brgy. Caloocan' } });

    await waitFor(() => {
      const caloocanTds = screen.getAllByText('Brgy. Caloocan');
      expect(caloocanTds.length).toBe(2);
      const lanatanTds = screen.queryAllByText('Brgy. Lanatan');
      expect(lanatanTds.length).toBe(1);
    });
  });

  it('displays fallback rows when API returns empty data', async () => {
    mockHealth.mockResolvedValueOnce({ data: [] });

    render(<HealthReportsPage />);
    await waitFor(() => {
      const caloocans = screen.getAllByText('Brgy. Caloocan');
      expect(caloocans.length).toBeGreaterThanOrEqual(1);
    });
    const totals = screen.getAllByText('40');
    expect(totals.length).toBe(2);
  });

  it('calls window.print when Print Report is clicked', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<HealthReportsPage />);
    await waitFor(() => expect(screen.getByText('Weight-for-Age (WFA)')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /print report/i }));
    expect(printSpy).toHaveBeenCalledOnce();
    printSpy.mockRestore();
  });
});
