import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { MonthlyReportTable } from '../components/bns/MonthlyReportTable.jsx';

describe('MonthlyReportTable Component', () => {
  it('should show all the required columns for the child health measurements', () => {
    render(<MonthlyReportTable />);

    expect(screen.getByRole('heading', { name: /masterlist report data/i })).toBeInTheDocument();

    expect(screen.getByRole('columnheader', { name: /caregiver/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /name of child/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /ip group/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /sex/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /date of birth/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /date measured/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /weight \(kg\)/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /height \(cm\)/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /age \(mos\)/i })).toBeInTheDocument();

    expect(screen.getByRole('columnheader', { name: /weight for age \(wfa\)/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /height for age \(hfa\)/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /weight for lt\/ht \(wfl\/h\)/i })).toBeInTheDocument();
  });

  it('should render corresponding row records cleanly with specific assessment data text rules', () => {
    render(<MonthlyReportTable />);

    expect(screen.getByText('GOMEZ, JAMES ANDREI')).toBeInTheDocument();
    expect(screen.getByText('CASTROMERO, RAYVIN')).toBeInTheDocument();

    expect(screen.getByText('4.7')).toBeInTheDocument();
    expect(screen.getByText('57.0')).toBeInTheDocument();
  });
});