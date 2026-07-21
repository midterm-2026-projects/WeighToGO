import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MonthlyReportHeader } from '../components/bns/MonthlyReportHeader.jsx';

describe('Monthly Report Header Component', () => {
  it('should render the dashboard title, and all four top-level summary metrics', () => {
    const mockSummaryData = {
      totalRegistered: 42,
      normal: 25,
      stunted: 12,
      obese: 5,
    };

    render(<MonthlyReportHeader summary={mockSummaryData} />);

    expect(screen.getByRole('heading', { name: /monthly barangay report/i })).toBeInTheDocument();
    expect(screen.getByText(/summary of nutritional cases for the selected month/i)).toBeInTheDocument();

    expect(screen.getByText(/total registered/i)).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();

    expect(screen.getByText(/normal/i)).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();

    expect(screen.getByText(/stunted/i)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();

    expect(screen.getByText(/obese/i)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should allow changing the month and year', async () => {
    const mockOnMonthChange = vi.fn();
    const mockOnYearChange = vi.fn();

    render(
      <MonthlyReportHeader 
        onMonthChange={mockOnMonthChange} 
        onYearChange={mockOnYearChange} 
      />
    );

    const monthSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(monthSelect, { target: { value: 'Aug' } });
    expect(mockOnMonthChange).toHaveBeenCalledWith('Aug');

    const yearSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(yearSelect, { target: { value: '2026' } });
    expect(mockOnYearChange).toHaveBeenCalledWith(2026);
  });
});