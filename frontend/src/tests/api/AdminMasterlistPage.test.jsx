import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

const buildMockChildren = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Child ${i + 1}`,
    barangay: `Brgy. Caloocan`,
    purok: `Purok ${(i % 4) + 1}`,
    parent_name: `Parent ${i + 1}`,
    age_months: 24 + i,
    gender: i % 2 === 0 ? 'Male' : 'Female',
    birthdate: '2024-01-15',
    weight: 12 + i,
    height: 85 + i,
    wfa_status: 'Normal',
    hfa_status: 'Normal',
    wfhl_status: 'Normal',
    classification: 'normal',
    checkup_status: i < 5 ? 'Checked Up' : 'Pending',
  }));

const mockList = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  api: {
    children: {
      list: mockList,
    },
  },
}));

import AdminMasterlistPage from '../../pages/AdminMasterlistPage';

describe('AdminMasterlistPage Display', () => {
  beforeEach(() => {
    mockList.mockReset();
    mockList.mockResolvedValue({ data: buildMockChildren(15) });
  });
  it('displays Loading... initially', () => {
    render(<AdminMasterlistPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays heading and subtitle', () => {
    render(<AdminMasterlistPage />);
    expect(screen.getByRole('heading', { name: /children masterlist/i })).toBeInTheDocument();
    expect(screen.getByText(/detailed list of children, dimensions, and statuses/i)).toBeInTheDocument();
  });

  it('displays the filter dropdowns with defaults', () => {
    render(<AdminMasterlistPage />);
    const selects = screen.getAllByRole('combobox');
    expect(selects[0]).toHaveDisplayValue('All Barangays');
    expect(selects[1]).toHaveDisplayValue('All Ages');
    expect(selects[2]).toHaveDisplayValue('Overall Status');
  });

  it('displays all barangay options in the filter', () => {
    render(<AdminMasterlistPage />);
    const selects = screen.getAllByRole('combobox');
    const barangayOptions = selects[0].querySelectorAll('option');
    expect(barangayOptions[0]).toHaveTextContent('All Barangays');
    expect(barangayOptions[1]).toHaveTextContent('Brgy. Caloocan');
    expect(barangayOptions.length).toBe(16);
  });

  it('displays Total Registered KPI with count', async () => {
    render(<AdminMasterlistPage />);
    await waitFor(() => {
      expect(screen.getByText(/filtered child masterlist view/i)).toBeInTheDocument();
      expect(screen.getByText(/total registered/i)).toBeInTheDocument();
    });
    const kpiValue = screen.getAllByText('15')[0];
    expect(kpiValue).toBeInTheDocument();
  });

  it('displays child rows in the table after loading', async () => {
    render(<AdminMasterlistPage />);
    await waitFor(() => {
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 10')).toBeInTheDocument();
    });
  });

  it('displays status badges for each child', async () => {
    render(<AdminMasterlistPage />);
    await waitFor(() => {
      const badges = screen.getAllByText('Normal');
      expect(badges.length).toBeGreaterThanOrEqual(15);
    });
  });

  it('displays the child detail modal when a row is clicked', async () => {
    render(<AdminMasterlistPage />);
    await waitFor(() => expect(screen.getByText('Child 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Child 1'));

    expect(screen.getByText(/parent \/ caregiver/i)).toBeInTheDocument();
    const allParent1 = screen.getAllByText('Parent 1');
    expect(allParent1.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/nutritional status/i)).toBeInTheDocument();
  });

  it('displays pagination when data exceeds page size', async () => {
    render(<AdminMasterlistPage />);
    await waitFor(() => {
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  it('displays the page info text in pagination', async () => {
    render(<AdminMasterlistPage />);
    await waitFor(() => {
      expect(screen.getByText(/showing 1–10 of 15/i)).toBeInTheDocument();
    });
  });

  it('removes the modal when close button is clicked', async () => {
    render(<AdminMasterlistPage />);
    await waitFor(() => expect(screen.getByText('Child 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Child 1'));
    expect(screen.getByText(/parent \/ caregiver/i)).toBeInTheDocument();

    const closeBtn = document.querySelector('button svg')?.closest('button');
    if (closeBtn) fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText(/parent \/ caregiver/i)).not.toBeInTheDocument();
    });
  });

  it('displays empty state when API returns no children', async () => {
    mockList.mockReset();
    mockList.mockResolvedValue({ data: [] });

    render(<AdminMasterlistPage />);
    await waitFor(() => {
      expect(screen.getByText(/no matching child records found/i)).toBeInTheDocument();
    });
  });
});
