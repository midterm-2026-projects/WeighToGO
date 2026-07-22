import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../../services/api', () => ({
  api: {
    children: {
      filters: vi.fn().mockResolvedValue({
        data: { barangays: [{ label: 'All Barangays', value: 'all' }] },
      }),
    },
    reports: {
      health: vi.fn().mockResolvedValue({
        data: [
          { barangay: 'Brgy. Caloocan', totalRegistered: 15, normal: 10, underweight: 2, stunted: 1, wasted: 1, obese: 1 },
          { barangay: 'Brgy. Lanatan', totalRegistered: 15, normal: 12, underweight: 1, stunted: 1, wasted: 0, obese: 1 },
        ],
      }),
    },
  },
}));

import HealthReportsPage from '../../pages/HealthReportsPage';

describe('HealthReportsPage Rendering', () => {
  it('renders the page heading', () => {
    render(<HealthReportsPage />);
    expect(screen.getByRole('heading', { name: /health reports/i })).toBeInTheDocument();
  });

  it('renders the subtitle text', () => {
    render(<HealthReportsPage />);
    expect(screen.getByText(/nutritional status reports by barangay/i)).toBeInTheDocument();
  });

  it('renders the OPT summary description', () => {
    render(<HealthReportsPage />);
    expect(screen.getByText(/operation timbang \(opt\) summary matrix/i)).toBeInTheDocument();
  });

  it('renders the barangay filter dropdown', async () => {
    render(<HealthReportsPage />);
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveDisplayValue('All Barangays');
    });
  });

  it('renders the Print Report button', () => {
    render(<HealthReportsPage />);
    expect(screen.getByRole('button', { name: /print report/i })).toBeInTheDocument();
  });

  it('renders table data rows after loading', async () => {
    render(<HealthReportsPage />);
    await waitFor(() => {
      expect(screen.getByText('Brgy. Caloocan')).toBeInTheDocument();
      expect(screen.getByText('Brgy. Lanatan')).toBeInTheDocument();
    });
  });

  it('renders table header sections', async () => {
    render(<HealthReportsPage />);
    await waitFor(() => {
      expect(screen.getByText('Weight-for-Age (WFA)')).toBeInTheDocument();
      expect(screen.getByText('Height-for-Age (HFA)')).toBeInTheDocument();
      expect(screen.getByText('Weight-for-Length/Height (WFH/L)')).toBeInTheDocument();
    });
  });
});
