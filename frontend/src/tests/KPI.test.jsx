import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { KPI } from '../components/dashboard/KPI';

describe('KPI Component - Missing Data Handling', () => {
  
  afterEach(() => {
    cleanup();
  });

  it('should render correctly when BOTH title and value are provided', () => {
    render(<KPI title="Healthy Cases" value="85" />);
    expect(screen.getByTestId('kpi-title')).toHaveTextContent('Healthy Cases');
    expect(screen.getByTestId('kpi-title')).toHaveClass('text-gray-600');
    expect(screen.getByTestId('kpi-value')).toHaveTextContent('85');
  });

  it('should display a fallback of "0" when ONLY the title is provided', () => {
    render(<KPI title="Deficit Cases" />);
    expect(screen.getByTestId('kpi-title')).toHaveTextContent('Deficit Cases');
    expect(screen.getByTestId('kpi-title')).toHaveClass('text-gray-600');
    expect(screen.getByTestId('kpi-value')).toHaveTextContent('0');
  });

  it('should display a warning text and color when ONLY the value is provided', () => {
    render(<KPI value="10" />);
    expect(screen.getByTestId('kpi-title')).toHaveTextContent('Missing Title');
    expect(screen.getByTestId('kpi-title')).toHaveClass('text-red-500');
    expect(screen.getByTestId('kpi-value')).toHaveTextContent('10');
  });

  it('should display fallbacks for both when NEITHER title nor value is provided', () => {
    render(<KPI />);
    expect(screen.getByTestId('kpi-title')).toHaveTextContent('Missing Title');
    expect(screen.getByTestId('kpi-title')).toHaveClass('text-red-500');
    expect(screen.getByTestId('kpi-value')).toHaveTextContent('0');
  });
});