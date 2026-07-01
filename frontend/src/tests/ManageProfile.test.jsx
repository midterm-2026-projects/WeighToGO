import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { ManageProfileModal } from '../components/bns/ManageProfileModal.jsx';

describe('ManageProfileModal Component', () => {
  it('should display inner profile fields, switch tabs, and trigger close action', async () => {
    const user = userEvent.setup();

    const mockOnClose = () => {};

    render(<ManageProfileModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByRole('heading', { name: /gomez, james andrei/i })).toBeInTheDocument();

    expect(screen.getByText('BAUTISTA, ANGELIQUE')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /monthly assessment/i }));
    expect(screen.getByText(/assessment completed!/i)).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && content.includes('4.7 kg'); 
    })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /checkup history/i }));
    expect(screen.getByRole('heading', { name: /past monthly reports/i })).toBeInTheDocument();
    expect(screen.getByText('2026-07')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: '×' });
    expect(closeBtn).toBeInTheDocument();
    await user.click(closeBtn);
  });
});