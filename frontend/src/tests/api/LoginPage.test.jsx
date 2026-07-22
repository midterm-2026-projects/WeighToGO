import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    user: null,
  }),
}));

import LoginPage from '../../pages/LoginPage';

describe('LoginPage Display', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the WeighToGO logo letter W', () => {
    render(<LoginPage />);
    const logo = screen.getByText('W');
    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe('SPAN');
  });

  it('displays the heading and subtitle', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /WeighToGO/i })).toBeInTheDocument();
    expect(screen.getByText(/Sign in to access your portal/i)).toBeInTheDocument();
  });

  it('displays the Role select with all options', () => {
    render(<LoginPage />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveDisplayValue('Select role');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Select role');
    expect(options[1]).toHaveTextContent('Administrator (Admin)');
    expect(options[2]).toHaveTextContent('Barangay Nutrition Scholar');
  });

  it('displays the email input', () => {
    render(<LoginPage />);
    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
  });

  it('displays the password input', () => {
    render(<LoginPage />);
    const input = screen.getByPlaceholderText('Enter your password');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('displays the Sign In button', () => {
    render(<LoginPage />);
    const btn = screen.getByRole('button', { name: /sign in/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it('displays the Sign In button as disabled during loading', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {}));
    render(<LoginPage />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Administrator (Admin)' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  it('displays error message when login fails', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    render(<LoginPage />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Administrator (Admin)' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('clears previous error on new submission attempt', async () => {
    mockLogin
      .mockRejectedValueOnce(new Error('First error'))
      .mockRejectedValueOnce(new Error('Second error'));
    render(<LoginPage />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Administrator (Admin)' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByText('First error')).toBeInTheDocument());

    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByText('Second error')).toBeInTheDocument());
  });
});
