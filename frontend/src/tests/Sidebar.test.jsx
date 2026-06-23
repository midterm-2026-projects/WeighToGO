import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Sidebar } from '../components/bns/Sidebar';

describe('Sidebar Component', () => {
  
  it('navigates to the correct page when menu links are clicked', async () => {
    const handleNavigate = vi.fn();
    const user = userEvent.setup();
    render(<Sidebar activePath="/" onNavigate={handleNavigate} onLogout={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /monthly report/i }));
    expect(handleNavigate).toHaveBeenCalledWith('/monthly-report');

    await user.click(screen.getByRole('button', { name: /kids masterlist/i }));
    expect(handleNavigate).toHaveBeenCalledWith('/kids-masterlist');
  });

  it('marks the current active page for screen readers', () => {
    render(<Sidebar activePath="/kids-masterlist" onNavigate={vi.fn()} onLogout={vi.fn()} />);
    
    const kidsMasterlistBtn = screen.getByRole('button', { name: /kids masterlist/i });
    expect(kidsMasterlistBtn).toHaveAttribute('aria-current', 'page');
  });

  it('logs the user out when the logout button is clicked', async () => {
    const handleLogout = vi.fn();
    const user = userEvent.setup();
    render(<Sidebar activePath="/" onNavigate={vi.fn()} onLogout={handleLogout} />);

    await user.click(screen.getByRole('button', { name: /logout/i }));
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});