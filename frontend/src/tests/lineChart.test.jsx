import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import LineChart from '../components/dashboard/lineChart';

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

  it('should filter health cases in the line chart depending on the selected filter', async () => {
    const user = userEvent.setup();
    render(<LineChart />);
    
    const obesityCheckbox = screen.getByLabelText('Obesity');
    await user.click(obesityCheckbox);
    
    const lineChart = screen.getByTestId('mock-line-chart');
    const datasets = JSON.parse(lineChart.getAttribute('data-datasets'));
    
    const activeLabels = datasets.map(d => d.label);
    expect(activeLabels).toContain('Obesity');
  });

  it('should function correctly based on the actual number of cases', () => {
    render(<LineChart />);
    
    const lineChart = screen.getByTestId('mock-line-chart');
    const datasets = JSON.parse(lineChart.getAttribute('data-datasets'));
    
    const malnutritionData = datasets.find(d => d.label === 'Malnutrition');
    expect(malnutritionData.data).toBeInstanceOf(Array);
    expect(malnutritionData.data[0]).toBeTypeOf('number');
  });

  it('should display no lines in the chart when no filters are selected', async () => {
    const user = userEvent.setup();
    render(<LineChart />);
    
    const malnutritionCheckbox = screen.getByLabelText('Malnutrition');
    
    if (malnutritionCheckbox.checked) {
      await user.click(malnutritionCheckbox);
    }
    
    const lineChart = screen.getByTestId('mock-line-chart');
    const datasets = JSON.parse(lineChart.getAttribute('data-datasets'));
    
    expect(datasets).toHaveLength(0);
  });

  it('should only display the exact filters selected in the line chart', async () => {
    const user = userEvent.setup();
    render(<LineChart />);
    
    const malnutritionCheckbox = screen.getByLabelText('Malnutrition');
    const obesityCheckbox = screen.getByLabelText('Obesity');
    
    if (!malnutritionCheckbox.checked) await user.click(malnutritionCheckbox);
    if (obesityCheckbox.checked) await user.click(obesityCheckbox);
    
    const lineChart = screen.getByTestId('mock-line-chart');
    const datasets = JSON.parse(lineChart.getAttribute('data-datasets'));
    
    expect(datasets).toHaveLength(1);
    expect(datasets[0].label).toBe('Malnutrition');
  });

  it('should display the line at level 0 when there are no cases', () => {
    render(<LineChart />);
    
    const lineChart = screen.getByTestId('mock-line-chart');
    const options = JSON.parse(lineChart.getAttribute('data-options'));
    
    expect(options.scales.y.beginAtZero).toBe(true);
  });
});