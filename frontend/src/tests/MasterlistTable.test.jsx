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
        parent_name: 'BAUTISTA, ANGELIQUE',
        gender: 'Male',
        age_months: 6,
        purok: 'Purok 1',
        classification: 'Normal'
      }
    ];

    const mockOnManageChild = vi.fn();

    render(
      <MasterlistTable 
        records={mockRecords} 
        onManageChild={mockOnManageChild} 
      />
    );

    expect(screen.getByRole('columnheader', { name: /child name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /parent/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /gender/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /age \(mos\)/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /purok/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /checkup status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /action/i })).toBeInTheDocument();

    expect(screen.getByText('GOMEZ, JAMES ANDREI')).toBeInTheDocument();
  });
});