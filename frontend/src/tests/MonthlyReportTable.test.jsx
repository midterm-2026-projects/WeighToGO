import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { MonthlyReportTable } from '../components/bns/MonthlyReportTable.jsx';

describe('Monthly Report Table Component', () => {
  it('should show all the required columns for the child health measurements', () => {
    render(<MonthlyReportTable />);

    expect(screen.getByRole('columnheader', { name: /caregiver/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /child name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /barangay/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /sex/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /birthdate/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /age \(mos\)/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /weight \(kg\)/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /height \(cm\)/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /wfa/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /hfa/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /wfh\/l/i })).toBeInTheDocument();
  });

  it('should render corresponding row records cleanly with specific assessment data text rules', () => {
    render(<MonthlyReportTable />);

    expect(screen.getByText('GOMEZ, JAMES ANDREI')).toBeInTheDocument();
    expect(screen.getByText('CASTROMERO, RAYVIN')).toBeInTheDocument();

    expect(screen.getByText('7.5')).toBeInTheDocument();
    expect(screen.getByText('65')).toBeInTheDocument();
  });
});