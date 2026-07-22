import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../../services/api', () => ({
  api: {
    children: {
      list: vi.fn().mockResolvedValue({ data: [] }),
    },
  },
}));

import AdminMasterlistPage from '../../pages/AdminMasterlistPage';

describe('AdminMasterlistPage Rendering', () => {
  it('renders the page heading', () => {
    render(<AdminMasterlistPage />);
    expect(screen.getByRole('heading', { name: /children masterlist/i })).toBeInTheDocument();
  });

  it('renders the subtitle text', () => {
    render(<AdminMasterlistPage />);
    expect(screen.getByText(/detailed list of children, dimensions, and statuses/i)).toBeInTheDocument();
  });

  it('renders the All Barangays filter dropdown', () => {
    render(<AdminMasterlistPage />);
    const selects = screen.getAllByRole('combobox');
    expect(selects[0]).toHaveDisplayValue('All Barangays');
  });

  it('renders the All Ages filter dropdown', () => {
    render(<AdminMasterlistPage />);
    const selects = screen.getAllByRole('combobox');
    expect(selects[1]).toHaveDisplayValue('All Ages');
  });

  it('renders the Overall Status filter dropdown', () => {
    render(<AdminMasterlistPage />);
    const selects = screen.getAllByRole('combobox');
    expect(selects[2]).toHaveDisplayValue('Overall Status');
  });

  it('renders the Total Registered KPI card', () => {
    render(<AdminMasterlistPage />);
    expect(screen.getByText(/total registered/i)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders table headers for all columns', async () => {
    render(<AdminMasterlistPage />);
    await waitFor(() => {
      expect(screen.getByText('Purok')).toBeInTheDocument();
      expect(screen.getByText('Barangay')).toBeInTheDocument();
      expect(screen.getByText('Parent')).toBeInTheDocument();
      expect(screen.getByText('Child Name')).toBeInTheDocument();
      expect(screen.getByText('Sex')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Birthdate')).toBeInTheDocument();
      expect(screen.getByText('Wt')).toBeInTheDocument();
      expect(screen.getByText('Ht')).toBeInTheDocument();
      expect(screen.getByText('WFA')).toBeInTheDocument();
      expect(screen.getByText('HFA')).toBeInTheDocument();
      expect(screen.getByText('WFH/L')).toBeInTheDocument();
    });
  });

  it('renders empty state message when no children', async () => {
    render(<AdminMasterlistPage />);
    await waitFor(() => {
      expect(screen.getByText(/no matching child records found/i)).toBeInTheDocument();
    });
  });
});
