import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { RMasterlistTable } from '../components/bns/MasterlistTable.jsx';

describe('RMasterlistTable Component', () => {
  it('should display the masterlist table columns correctly with mock data.', () => {
    render(<RMasterlistTable />);

    expect(screen.getByRole('columnheader', { name: /name of child/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /parent \/ guardian/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /gender/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /age \(mos\)/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /purok \/ sitio/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /checkup status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /action/i })).toBeInTheDocument();

    expect(screen.getByText('GOMEZ, JAMES ANDREI')).toBeInTheDocument();
  });
});