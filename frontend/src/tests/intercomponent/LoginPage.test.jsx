import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from '../../pages/LoginPage';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

const TestWrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('LoginPage Rendering', () => {
  it('renders the WeighToGO heading', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    expect(screen.getByRole('heading', { name: /WeighToGO/i })).toBeInTheDocument();
  });

  it('renders the sign-in description text', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    expect(screen.getByText(/Sign in to access your portal/i)).toBeInTheDocument();
  });

  it('renders the Role dropdown with placeholder', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    const roleSelect = screen.getByRole('combobox');
    expect(roleSelect).toBeInTheDocument();
    expect(roleSelect).toHaveDisplayValue('Select role');
  });

  it('renders the email input with placeholder', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('renders the password input with placeholder', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('renders the Sign In button', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
