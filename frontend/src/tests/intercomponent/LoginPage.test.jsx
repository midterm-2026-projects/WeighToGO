import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    isAuthenticated: false,
    user: null,
  }),
}));

import LoginPage from '../../pages/LoginPage';

describe('LoginPage Rendering', () => {
  it('renders the WeighToGO heading', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /WeighToGO/i })).toBeInTheDocument();
  });

  it('renders the sign-in description text', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Sign in to access your portal/i)).toBeInTheDocument();
  });

  it('renders the Role dropdown with placeholder', () => {
    render(<LoginPage />);
    const roleSelect = screen.getByRole('combobox');
    expect(roleSelect).toBeInTheDocument();
    expect(roleSelect).toHaveDisplayValue('Select role');
  });

  it('renders the email input with placeholder', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('renders the password input with placeholder', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('renders the Sign In button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
