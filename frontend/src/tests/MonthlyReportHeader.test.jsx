import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MonthlyReportHeader } from '../components/bns/MonthlyReportHeader.jsx';

describe('MonthlyReportHeader Component - Week 3 Day 1', () => {
  it('should render the dashboard title, action controls, and all four top-level summary metrics', () => {
    const mockSummaryData = {
      totalRegistered: 42,
      normal: 25,
      malnourished: 12,
      obese: 5,
    };

    render(<MonthlyReportHeader summaryData={mockSummaryData} />);

    expect(screen.getByRole('heading', { name: /monthly barangay report/i })).toBeInTheDocument();
    expect(screen.getByText(/summary of nutritional cases for the selected month/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /print report/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit to admin/i })).toBeInTheDocument();

    expect(screen.getByText(/total registered/i)).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();

    expect(screen.getByText(/normal \(all metrics\)/i)).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();

    expect(screen.getByText(/malnourished \/ stunted/i)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();

    expect(screen.getByText(/obese/i)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should allow changing the month and clicking action controls', async () => {
    const user = userEvent.setup();
    const mockOnMonthChange = vi.fn();
    const mockOnPrint = vi.fn();
    const mockOnSubmit = vi.fn();

    render(
      <MonthlyReportHeader 
        onMonthChange={mockOnMonthChange} 
        onPrint={mockOnPrint} 
        onSubmit={mockOnSubmit} 
      />
    );

    const dateInput = screen.getByLabelText(/select month/i);

    fireEvent.change(dateInput, { target: { value: '2026-08' } });
    expect(mockOnMonthChange).toHaveBeenCalledWith('2026-08');

    const printBtn = screen.getByRole('button', { name: /print report/i });
    await user.click(printBtn);
    expect(mockOnPrint).toHaveBeenCalledTimes(1);

    const submitBtn = screen.getByRole('button', { name: /submit to admin/i });
    await user.click(submitBtn);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});