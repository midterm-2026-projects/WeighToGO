import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MasterlistHeader } from '../components/bns/MasterlistHeader';

describe('MasterlistHeader Component', () => {
  
  it('calls the search function when typing a childs name', async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();
    render(<MasterlistHeader onSearch={handleSearch} onPurokChange={vi.fn()} onAddNewChild={vi.fn()} />);

    const searchInput = screen.getByPlaceholderText('Search child name...');
    await user.type(searchInput, 'Juan');
    
    expect(handleSearch).toHaveBeenCalled();
  });

  it('updates the purok filter when a new option is selected', async () => {
    const handlePurokChange = vi.fn();
    const user = userEvent.setup();
    
    render(<MasterlistHeader onSearch={vi.fn()} onPurokChange={handlePurokChange} onAddNewChild={vi.fn()} />);

    const purokSelect = screen.getByDisplayValue('All Purok');
    await user.selectOptions(purokSelect, 'Purok 1');
    expect(handlePurokChange).toHaveBeenCalledWith('Purok 1');
  });

  it('triggers the add new child action when the button is clicked', async () => {
    const handleAddNewChild = vi.fn();
    const user = userEvent.setup();
    render(<MasterlistHeader onSearch={vi.fn()} onPurokChange={vi.fn()} onAddNewChild={handleAddNewChild} />);

    await user.click(screen.getByRole('button', { name: /\+ add new child/i }));
    expect(handleAddNewChild).toHaveBeenCalledTimes(1);
  });
});