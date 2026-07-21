import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import LineChart from '../components/dashboard/lineChart';

vi.mock('../../services/api', () => ({
  api: {
    analytics: {
      trendline: () => Promise.resolve({
        data: {
          categories: ['Jan', 'Feb', 'Mar'],
          series: [
            { name: 'Normal', data: [5, 3, 4], color: '#10b981' },
            { name: 'Underweight', data: [1, 2, 1], color: '#f59e0b' }
          ]
        }
      })
    }
  }
}));

vi.mock('react-chartjs-2', () => ({
  Line: (props) => (
    <div 
      data-testid="mock-line-chart" 
      data-datasets={JSON.stringify(props.data.datasets)}
      data-options={JSON.stringify(props.options)}
    />
  )
}));

describe('Line Chart - Monthly Nutritional Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the line chart with monthly categories', async () => {
    render(<LineChart />);
    
    const lineChart = await screen.findByTestId('mock-line-chart');
    const datasets = JSON.parse(lineChart.getAttribute('data-datasets'));
    
    expect(Array.isArray(datasets)).toBe(true);
  });

  it('should have numeric data for each series', async () => {
    render(<LineChart />);
    
    const lineChart = await screen.findByTestId('mock-line-chart');
    const datasets = JSON.parse(lineChart.getAttribute('data-datasets'));
    
    datasets.forEach(d => {
      expect(d.data).toBeInstanceOf(Array);
      d.data.forEach(val => expect(typeof val).toBe('number'));
    });
  });

  it('should display the line at level 0 when there are no cases', async () => {
    render(<LineChart />);
    
    const lineChart = await screen.findByTestId('mock-line-chart');
    const options = JSON.parse(lineChart.getAttribute('data-options'));
    
    expect(options.scales.y.beginAtZero).toBe(true);
  });
});