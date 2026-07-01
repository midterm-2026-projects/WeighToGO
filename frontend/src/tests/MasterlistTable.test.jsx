import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest'; 
import '@testing-library/jest-dom';
import { MasterlistTable } from '../components/bns/MasterlistTable.jsx';

describe('MasterlistTable Component', () => { 
  it('should display the masterlist table columns correctly with mock data.', () => {

    const mockRecords = [
      {
        id: 1, 
        name: 'GOMEZ, JAMES ANDREI',
        parent: 'BAUTISTA, ANGELIQUE',
        gender: 'Male',
        age: 6,
        purok: 'Purok 1',
        status: 'Pending'
      }
    ];

    const mockOnManageChild = vi.fn();

    render(
      <MasterlistTable 
        records={mockRecords} 
        onManageChild={mockOnManageChild} 
      />
    );

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