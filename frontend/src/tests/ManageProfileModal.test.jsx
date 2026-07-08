import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { ManageProfileModal } from '../components/bns/ManageProfileModal.jsx';

describe('ManageProfileModal Component', () => {
  it('should display inner profile fields, switch tabs, and trigger close action', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();

    const mockChildRecord = {
      name: 'GOMEZ, JAMES ANDREI',
      parent: 'BAUTISTA, ANGELIQUE',
      purok: 'Purok 1',
      age: 6,
      gender: 'Male',
      birthdate: '2020-01-01'
    };

    render(
      <ManageProfileModal 
        isOpen={true} 
        onClose={mockOnClose} 
        childRecord={mockChildRecord} 
      />
    );

    expect(screen.getByRole('heading', { name: /gomez, james andrei/i })).toBeInTheDocument();
    expect(screen.getByText('BAUTISTA, ANGELIQUE')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /monthly assessment/i }));
    expect(screen.getByText(/assessment completed!/i)).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.includes('4.7 kg'); 
    })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /checkup history/i }));
    expect(screen.getByRole('heading', { name: /past monthly reports/i })).toBeInTheDocument();
    expect(screen.getByText('2026-07')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toBeInTheDocument();
    await user.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });
});