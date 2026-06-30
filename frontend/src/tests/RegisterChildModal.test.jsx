import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { RegisterChildModal } from '../components/bns/RegisterChildModal';

describe('RegisterChildModal Component', () => {
  
  it('should not display the modal by default when closed', () => {
    render(<RegisterChildModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />);
    
    const modalHeading = screen.queryByRole('heading', { name: /register new child/i });
    expect(modalHeading).not.toBeInTheDocument();
  });

  it('should display all required form inputs when open', () => {
    render(<RegisterChildModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    
    expect(screen.getByRole('heading', { name: /register new child/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/birthdate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/parents \/ guardian/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/purok/i)).toBeInTheDocument();
  });

  it('should close the modal when the cancel button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    
    render(<RegisterChildModal isOpen={true} onClose={handleClose} onSave={vi.fn()} />);
    
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should submit all the correct form data when save is clicked', async () => {
    const handleSave = vi.fn();
    const user = userEvent.setup();
    
    render(<RegisterChildModal isOpen={true} onClose={vi.fn()} onSave={handleSave} />);

    await user.type(screen.getByLabelText(/full name/i), 'Juan Dela Cruz');
    await user.selectOptions(screen.getByLabelText(/gender/i), 'Male');
    await user.type(screen.getByLabelText(/birthdate/i), '2026-01-15');
    await user.type(screen.getByLabelText(/parents \/ guardian/i), 'Maria Dela Cruz');
    await user.selectOptions(screen.getByLabelText(/purok/i), 'Purok 1');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(handleSave).toHaveBeenCalledWith({
      fullName: 'Juan Dela Cruz',
      gender: 'Male',
      birthdate: '2026-01-15',
      parentGuardian: 'Maria Dela Cruz',
      purok: 'Purok 1',
    });
  });
});