import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { KPI } from '../components/dashboard/KPI';

describe('KPI Component - Health Trends', () => {
  it('should have KPI card components for Healthy, Deficit, and Excess statuses', () => {
   
    render(
      <>
        <KPI title="Healthy" value="85" />
        <KPI title="Deficit" value="10" />
        <KPI title="Excess" value="5" />
      </>
    );
    
    
    expect(screen.getByText('Healthy')).toBeInTheDocument();
    
   
    expect(screen.getByText('Deficit')).toBeInTheDocument();
    
    
    expect(screen.getByText('Excess')).toBeInTheDocument();
  });

  
  it('should renders predictive trend indicators when provided', () => {
    render(<KPI title="Deficit" value="15" trend="2%" trendDirection="down" />);
    
    expect(screen.getByText('↓ 2%')).toBeInTheDocument();
    expect(screen.getByText('↓ 2%')).toHaveClass('text-red-500');
  });
});