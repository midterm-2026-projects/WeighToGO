import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Masterlist } from '../components/bns/Masterlist'; 
import { RMasterlistTable } from '../components/bns/MasterlistTable.jsx';
import { ManageProfileModal } from '../components/bns/ManageProfileModal.jsx';

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

  it('should display the masterlist table columns correctly with mock data', () => {
    render(<Masterlist />);

    expect(screen.getByRole('columnheader', { name: /name of child/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /parent \/ guardian/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /gender/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /age \(mos\)/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /purok \/ sitio/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /checkup status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /action/i })).toBeInTheDocument();

    expect(screen.getByText('GOMEZ, JAMES ANDREI')).toBeInTheDocument();
  });

  it('should open the manage profile modal and switch tabs without breaking', async () => {
    const user = userEvent.setup();
    render(<Masterlist />);

    const manageButtons = screen.getAllByRole('button', { name: /manage/i });
    await user.click(manageButtons[0]);

    expect(screen.getByRole('heading', { name: /gomez, james andrei/i })).toBeInTheDocument();

    expect(screen.getAllByText('BAUTISTA, ANGELIQUE')[1]).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /monthly assessment/i }));
    expect(screen.getByText(/assessment completed!/i)).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && content.includes('4.7 kg'); 
    })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /checkup history/i }));
    expect(screen.getByRole('heading', { name: /past monthly reports/i })).toBeInTheDocument();
    expect(screen.getByText('2026-07')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '×' }));
    expect(screen.queryByRole('heading', { name: /gomez, james andrei/i })).not.toBeInTheDocument();
  });
});