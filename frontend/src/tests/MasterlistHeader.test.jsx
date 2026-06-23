import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MasterlistHeader } from '../components/bns/MasterlistHeader';

describe('MasterlistHeader Component', () => {
  
  it('calls the search function when typing a childs name', async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();
    render(<MasterlistHeader onSearch={handleSearch} onPurokChange={vi.fn()} onStatusChange={vi.fn()} onAddNewChild={vi.fn()} />);

    const searchInput = screen.getByRole('searchbox', { name: /search child/i });
    await user.type(searchInput, 'Juan');
    
    expect(handleSearch).toHaveBeenCalledWith('Juan');
  });

  it('updates the filters when a new Purok or Status is selected', async () => {
    const handlePurokChange = vi.fn();
    const handleStatusChange = vi.fn();
    const user = userEvent.setup();
    
    render(<MasterlistHeader onSearch={vi.fn()} onPurokChange={handlePurokChange} onStatusChange={handleStatusChange} onAddNewChild={vi.fn()} />);

    await user.selectOptions(screen.getByRole('combobox', { name: /purok/i }), 'purok1');
    expect(handlePurokChange).toHaveBeenCalledWith('purok1');

    await user.selectOptions(screen.getByRole('combobox', { name: /checkup status/i }), 'pending');
    expect(handleStatusChange).toHaveBeenCalledWith('pending');
  });

  it('triggers the add new child action when the button is clicked', async () => {
    const handleAddNewChild = vi.fn();
    const user = userEvent.setup();
    render(<MasterlistHeader onSearch={vi.fn()} onPurokChange={vi.fn()} onStatusChange={vi.fn()} onAddNewChild={handleAddNewChild} />);

    await user.click(screen.getByRole('button', { name: /\+ add new child/i }));
    expect(handleAddNewChild).toHaveBeenCalledTimes(1);
  });
});