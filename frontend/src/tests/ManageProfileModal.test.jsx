import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { ManageProfileModal } from '../components/bns/ManageProfileModal.jsx';

vi.mock('../services/api', () => ({
  api: {
    children: {
      history: vi.fn().mockResolvedValue({ data: [] })
    }
  }
}));

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
    expect(screen.getByText(/new monthly assessment/i)).toBeInTheDocument();

    const weightInput = screen.getByLabelText(/weight \(kg\)/i);
    const heightInput = screen.getByLabelText(/height \(cm\)/i);
    await user.type(weightInput, '4.7');
    await user.type(heightInput, '65');

    const computeBtn = screen.getByRole('button', { name: /compute nutritional status/i });
    await user.click(computeBtn);

    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'div' && content.includes('4.7 kg');
    })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /checkup history/i }));
    expect(await screen.findByText(/no assessment history yet/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toBeInTheDocument();
    await user.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });
});