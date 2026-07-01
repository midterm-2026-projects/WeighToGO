import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Masterlist } from '../components/bns/Masterlist';

describe('Masterlist Integration', () => {
  
  it('should smoothly toggle the modal open and closed from the header actions', async () => {
    const user = userEvent.setup();
    render(<Masterlist />);

    expect(screen.queryByRole('heading', { name: /register new child/i })).not.toBeInTheDocument();

    const addNewChildBtn = screen.getByRole('button', { name: /\+ add new child/i });
    await user.click(addNewChildBtn);

    expect(screen.getByRole('heading', { name: /register new child/i })).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);

    expect(screen.queryByRole('heading', { name: /register new child/i })).not.toBeInTheDocument();
  });
});